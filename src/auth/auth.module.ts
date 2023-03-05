import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, LocalStrategy, RtStrategy } from './strategies';
import { GoogleCustomeStrategy } from './strategies/googleCustom.strategy';
import { BalanceModule } from '../balance/balance.module';

@Module({
  imports: [UsersModule, BalanceModule, JwtModule.register({})],
  providers: [
    AuthResolver,
    AuthService,
    LocalStrategy,
    AtStrategy,
    RtStrategy,
    GoogleCustomeStrategy,
  ],
})
export class AuthModule {}
