import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../../types';
import { Request } from 'express';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies['_at'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.AT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
