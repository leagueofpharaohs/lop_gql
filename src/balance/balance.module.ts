import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceResolver } from './balance.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [BalanceResolver, BalanceService, PrismaService],
  exports: [BalanceService],
})
export class BalanceModule {}
