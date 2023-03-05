import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BalanceService {
  constructor(private prisma: PrismaService) {}

  async createBalance(data: any) {
    const { id, ...rest } = data;
    const newBalance = await this.prisma.balance.create({
      include: {
        buy: true,
        bonus: true,
        withdrawal: true,
      },
      data: {
        ...rest,
      },
    });

    return newBalance;
  }

  async buyToken(data: any) {
    const { balanceId, userId, ...rest } = data;
    const currentBalance = await this.prisma.balance.findUnique({
      where: { id: balanceId },
      include: {
        buy: {
          include: {
            buyToken: true,
          },
        },
      },
    });

    const newBuy = await this.prisma.balance.update({
      where: { id: balanceId },
      include: {
        buy: {
          include: {
            buyToken: true,
          },
        },
      },
      data: {
        totalLocked:
          rest.status === 'LOCKED' || rest.status === 'LINEAR_VESTING'
            ? (
                Number(rest.tokenUnits) + Number(currentBalance.totalLocked)
              ).toString()
            : currentBalance.totalLocked,
        totalUnlocked:
          rest.status === 'NORMAL'
            ? (
                Number(currentBalance.totalUnlocked) + Number(rest.tokenUnits)
              ).toString()
            : currentBalance.totalUnlocked,
        buy: {
          update: {
            totalToken: (
              Number(currentBalance.buy.totalToken) + Number(rest.tokenUnits)
            ).toString(),
            buyToken: {
              create: {
                ...rest,
              },
            },
          },
        },
      },
    });

    const returnValue = {
      id: newBuy.id,
      totalLocked: newBuy.totalLocked,
      totalUnlocked: newBuy.totalUnlocked,
      totalToken: newBuy.buy.totalToken,
      buyToken: newBuy.buy.buyToken,
    };

    return returnValue;
  }
}
