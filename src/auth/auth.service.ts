import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { GraphQLError } from 'graphql';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfirmEmailInput, SendCodeInput, SignupInput } from './dto';
import { v4 as uuid } from 'uuid';
import { UserDetails } from './entities';
import { BalanceService } from '../balance/balance.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private balanceService: BalanceService,
    @InjectRedis() private readonly redisClient: Redis,
    private mailService: MailerService,
  ) {}

  //*signup method
  async signup(signupInput: SignupInput) {
    const { email } = signupInput;
    const hashPassword = await bcrypt.hash(signupInput.password, 10);
    await this.isUserExists(email);
    await this.userService.createUser({
      data: {
        ...signupInput,
        password: hashPassword,
        account: {
          create: {
            provider: 'local',
            providerId: email,
            type: 'credential',
          },
        },
      },
    });
    return { message: 'register success' };
  }

  //*validate Local user method
  async validateUser(email: string, pass: string) {
    const user = await this.userService.findUserByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
  }

  //*validate OAuth user method
  async validateOAuthLogin(details: UserDetails) {
    const { email, provider } = details;
    const user = await this.userService.findUserByEmail(email);

    if (user && user.account.provider === provider) {
      return user;
    }

    if (user && user.account.provider !== provider) {
      throw new GraphQLError(
        `You have already signed up this email with ${
          user.account.provider == 'local'
            ? 'username and password'
            : user.account.provider
        }`,
      );
    }

    return await this.userService.createUser({
      data: {
        email,
        usedName: details.usedName,
        fullName: details.fullName,
        avatar: details.avatar,
        isEmailVerified: details.isEmailVerified,
        account: {
          create: {
            provider: details.provider,
            providerId: details.appId,
            type: 'oauth',
          },
        },
      },
    });
  }

  //*signin method
  async signin(ctx: any) {
    const res = ctx.req.res;
    const user = ctx.user;
    const { id } = user;
    if (user && !user.balance) {
      await this.balanceService.createBalance({
        userId: id,
        totalLocked: '0',
        totalUnlocked: '0',
        buy: {
          create: {
            totalToken: '0',
            buyToken: {},
          },
        },
        bonus: {
          create: {
            totalBonus: '0',
            bonusToken: {},
          },
        },
        withdrawal: {
          create: {
            totalWithdrawal: '0',
            WithdrawalToken: {},
          },
        },
      });
    }
    const tokens = await this.getToken(
      user.id,
      user.fullName,
      user.email,
      user.avatar,
      user.isEmailVerified,
      user.account.provider,
    );
    await this.updateRTHash(user.id, tokens.refreshToken);

    res.cookie('_at', tokens.accessToken, {
      secure: true,
      sameSite: 'none',
    });

    res.cookie('_rt', tokens.refreshToken, {
      secure: true,
      sameSite: 'none',
    });
    const returnValues = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };

    return returnValues;
  }

  //*isUserExists method
  async isUserExists(email: string) {
    const userExists = await this.userService.findUserByEmail(email);
    if (userExists) {
      throw new GraphQLError('User already exists');
    }
  }

  //*signout method
  async signout(id: string) {
    await this.userService.updateAccountByUserIdIfHashIsNotNull(id);
    await this.redisClient.del(id);
    return { message: 'logout success' };
  }

  //*refreshToken Utils method
  async refreshToken(ctx: any) {
    const res = ctx.req.res;
    const id = ctx.req.user.sub;
    const rtHash = ctx.req.user.refreshToken;
    const user = await this.userService.findUserById(id);
    if (!user || !user.account.hashRT) {
      throw new GraphQLError('Access Denied');
    }

    const isHashMatch = await bcrypt.compare(rtHash, user.account.hashRT);
    if (!isHashMatch) {
      throw new GraphQLError('Refresh token is invalid');
    }
    const tokens = await this.getToken(
      user.id,
      user.fullName,
      user.email,
      user.avatar,
      user.isEmailVerified,
      user.account.provider,
    );
    await this.updateRTHash(user.id, tokens.refreshToken);

    const returnValues = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
    return returnValues;
  }

  //?getToken Utils method
  async getToken(
    id: string,
    userName: string,
    email: string,
    avatar: string,
    isEmailVerified: boolean,
    provider: string,
  ) {
    const [at, rt] = await Promise.all([
      this.jwtService.sign(
        {
          sub: id,
          userName,
          email,
          avatar,
          isEmailVerified,
          provider,
        },
        {
          expiresIn: 60 * 60 * 1,
          secret: process.env.AT_SECRET,
        },
      ),
      this.jwtService.sign(
        {
          sub: id,
          email,
        },
        {
          expiresIn: 60 * 60 * 24 * 2,
          secret: process.env.RT_SECRET,
        },
      ),
    ]);
    await this.redisClient.set(id, rt, 'EX', 60 * 60 * 24 * 2, (err) => {
      if (err) {
        throw new GraphQLError('expired token');
      }
    });
    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  //?updata RTHash Utils method
  async updateRTHash(id: string, rtHash: string) {
    const hashRT = await bcrypt.hash(rtHash, 10);
    await this.userService.updateAccountByUserId(id, { hashRT: hashRT });
  }

  //?isUserExists Utils method
  async isUserExistsForSignUp(email: string) {
    const userExists = await this.userService.findUserByEmail(email);
    if (userExists) {
      return true;
    }
    return false;
  }

  //*sendConfiremationEmail method
  async sendConfiremationEmail(sendCodeInput: SendCodeInput) {
    const { email } = sendCodeInput;

    const token = Math.floor(1000 + Math.random() * 9000).toString();

    await this.redisClient.set(email, token, 'EX', 180);

    await this.mailService
      .sendMail({
        to: email,
        from: 'League of Pharaohs <no-reply@leagueofpharaohs.com>',
        subject: 'Confirm your email',
        text: `Your confirmation code is ${token}`,
      })
      .catch((err) => {
        throw new GraphQLError(`Error sending email ${err}`);
      });

    return { sendDate: new Date().getTime(), codeLength: token.length };
  }

  //*confirmEmail method
  async confirmEmail(confirmEmailInput: ConfirmEmailInput) {
    const { email, code, confiremStep } = confirmEmailInput;
    const user = await this.userService.findUserByEmail(email);

    const redisToken = await this.redisClient.get(email);

    if (!redisToken || redisToken !== code) {
      throw new GraphQLError('Invalid token');
    }

    await this.redisClient.del(email);

    if (confiremStep === 'register') {
      return { message: 'Email confirmed', isValide: true };
    }

    if (confiremStep === 'account') {
      const data = { id: user.id, isEmailVerified: true };
      await this.userService.updateUser(data);
      return { message: 'Email confirmed', isValide: true };
    }
  }

  //*sendResetPasswordEmail method
  async sendResetPasswordEmail(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new GraphQLError(`User with email ${email} does not exist `);
    }

    const generateCode = uuid();

    const url = `${process.env.ORIGIN_URL}/auth/reset-password?uid=${user.id}&token=${generateCode}`;

    await this.redisClient.set(user.id, generateCode, 'EX', 60 * 15);

    await this.mailService
      .sendMail({
        to: user.email,
        from: 'League of Pharaohs <no-reply@leagueofpharaohs.com>',
        subject: 'Reset your password',
        text: `Your reset password link is ${url}`,
      })
      .catch((err) => {
        throw new GraphQLError(`Error sending email ${err}`);
      });
    return { message: 'Email has been sent, please check your Email' };
  }

  //*forgotPassword help method
  async resetPassword(data: any) {
    const { id, token, password } = data;
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new GraphQLError(`User with id ${id} does not exist `);
    }

    const redisValue = await this.redisClient.get(id);

    if (!redisValue) {
      throw new GraphQLError(`Token expired`);
    }

    if (redisValue == token) {
      const hashPassword = await bcrypt.hash(password, 10);
      await this.userService.updateUser({
        id,
        password: hashPassword,
      });
      await this.redisClient.del(id);
      return { message: 'Password changed' };
    }
    throw new GraphQLError(`Token is not valid`);
  }
}
