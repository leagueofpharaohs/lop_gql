import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from '../decorators';
import { AuthService } from './auth.service';
import {
  ConfirmEmailInput,
  ResetPasswordInput,
  SendCodeInput,
  SigninInput,
  SignupInput,
} from './dto';
import { ConfirmEmail, Message, SendDate, Token } from './entities';
import { UserData } from './entities/user';
import { JwtAuthGuard, JwtAuthRefreshGuard, LocalGuard } from './guards';
import { GoogleGuard } from './guards/googleAuth.guard';

@Resolver()
@Public()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Message, { nullable: true, name: 'signUp' })
  signup(@Args('signupInput') signupInput: SignupInput) {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => Boolean, {
    nullable: true,
    name: 'isUserExists',
  })
  isUserExists(@Args('email') email: string) {
    return this.authService.isUserExistsForSignUp(email);
  }

  @UseGuards(LocalGuard)
  @Mutation(() => Message, {
    name: 'signIn',
    nullable: true,
  })
  signin(@Args('signinInput') signinInput: SigninInput, @Context() ctx: any) {
    return this.authService.signin(ctx);
  }

  @UseGuards(GoogleGuard)
  @Mutation(() => Message, { name: 'signInWithGoogle', nullable: true })
  signInWithGoogle(
    @Args('credential') credential: string,
    @Context() ctx: any,
  ) {
    return this.authService.signin(ctx);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Message, {
    name: 'signOut',
    nullable: true,
  })
  signout(@Context() ctx: any) {
    return this.authService.signout(ctx.req.user.sub);
  }

  @UseGuards(JwtAuthRefreshGuard)
  @Mutation(() => Token, {
    name: 'refreshToken',
    nullable: true,
  })
  refreshToken(@Context() ctx: any) {
    return this.authService.refreshToken(ctx);
  }

  @Mutation(() => SendDate, { name: 'sendConfiremationEmail', nullable: true })
  sendConfiremationEmail(@Args('sendCodeInput') sendCodeInput: SendCodeInput) {
    return this.authService.sendConfiremationEmail(sendCodeInput);
  }

  @Mutation(() => ConfirmEmail, { name: 'confirmEmail', nullable: true })
  confirmEmail(
    @Args('confirmEmailInput') confirmEmailInput: ConfirmEmailInput,
  ) {
    return this.authService.confirmEmail(confirmEmailInput);
  }

  @Mutation(() => Message, { name: 'sendResetPasswordEmail', nullable: true })
  sendResetPasswordEmail(@Args('email') email: string) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Mutation(() => Message, { name: 'resetPassword', nullable: true })
  resetPassword(@Args('resetPassword') resetPasswordInput: ResetPasswordInput) {
    return this.authService.resetPassword(resetPasswordInput);
  }
}
