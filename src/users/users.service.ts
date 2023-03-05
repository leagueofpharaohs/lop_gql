import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserInput } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //*find All Users method
  async findAllUsers() {
    const users = await this.prisma.user.findMany({
      include: {
        account: true,
        balance: {
          include: {
            buy: {
              include: {
                buyToken: true,
              },
            },
            bonus: {
              include: {
                bonusToken: true,
              },
            },
            withdrawal: {
              include: {
                WithdrawalToken: true,
              },
            },
          },
        },
      },
    });
    return users;
  }

  //*find User by id method
  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        account: true,
        balance: {
          include: {
            buy: {
              include: {
                buyToken: true,
              },
            },
            bonus: {
              include: {
                bonusToken: true,
              },
            },
            withdrawal: {
              include: {
                WithdrawalToken: true,
              },
            },
          },
        },
      },
    });
    return user;
  }

  //*find User by email method
  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        account: true,
        balance: {
          include: {
            buy: {
              include: {
                buyToken: true,
              },
            },
            bonus: {
              include: {
                bonusToken: true,
              },
            },
            withdrawal: {
              include: {
                WithdrawalToken: true,
              },
            },
          },
        },
      },
    });
    return user;
  }

  async createUser(data: any) {
    const user = await this.prisma.user.create({
      ...data,
      include: {
        account: true,
        balance: {
          include: {
            buy: {
              include: {
                buyToken: true,
              },
            },
            bonus: {
              include: {
                bonusToken: true,
              },
            },
            withdrawal: {
              include: {
                WithdrawalToken: true,
              },
            },
          },
        },
      },
    });
    return user;
  }

  async createAccount(data: any) {
    const account = await this.prisma.account.create({
      ...data,
    });
    return account;
  }

  //*update User by id method
  async updateUser(updateUserInput: UpdateUserInput) {
    const { id, ...rest } = updateUserInput;
    const user = await this.prisma.user.update({
      where: { id },
      include: {
        account: true,
        balance: {
          include: {
            buy: {
              include: {
                buyToken: true,
              },
            },
            bonus: {
              include: {
                bonusToken: true,
              },
            },
            withdrawal: {
              include: {
                WithdrawalToken: true,
              },
            },
          },
        },
      },
      data: {
        ...rest,
      },
    });
    return user;
  }

  //*Update Account by user id method
  async updateAccountByUserId(id: string, data: any) {
    const account = await this.prisma.account.update({
      where: { userId: id },
      data: {
        ...data,
      },
    });
    return account;
  }

  //*Update Account by user id method if hash is not null

  async updateAccountByUserIdIfHashIsNotNull(id: string) {
    const account = await this.prisma.account.updateMany({
      where: { userId: id, hashRT: { not: null } },
      data: {
        hashRT: null,
      },
    });
    return account;
  }

  //*remove User by id method
  async removeUser(id: string) {
    await this.prisma.account.delete({
      where: {
        userId: id,
      },
    });
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return user;
  }
}
