import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadWithRefreshToken } from 'src/types';
import { Request } from 'express';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(@InjectRedis() private readonly redisClient: Redis) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies['_rt'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.RT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayloadWithRefreshToken) {
    const refreshToken = req?.cookies['_rt'];
    const redisData = await this.redisClient.get(payload.sub);
    if (!redisData) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (refreshToken !== redisData) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return { ...payload, refreshToken };
  }
}
