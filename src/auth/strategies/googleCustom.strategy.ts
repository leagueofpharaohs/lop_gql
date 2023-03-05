import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from '../auth.service';
import { GraphQLError } from 'graphql';
import { GqlContextType, QueryOptions } from '@nestjs/graphql';
import { Context } from 'vm';

@Injectable()
export class GoogleCustomeStrategy extends PassportStrategy(
  Strategy,
  'googleCustom',
) {
  constructor(private authService: AuthService) {
    super();
  }

  client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );

  async validate(req: Request): Promise<any> {
    const idToken = req.body;
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const details = {
      appId: payload.sub,
      usedName: payload.name,
      fullName: payload.name,
      provider: 'google',
      email: payload.email,
      isEmailVerified: payload.email_verified,
      avatar: payload.picture,
    };
    const user = await this.authService.validateOAuthLogin(details);
    if (!user) {
      throw new GraphQLError('email or password is incorrect');
    }
    return user;
  }
}
