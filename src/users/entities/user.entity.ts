import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Balance } from 'src/balance/entities';

import { Account } from './account.entity';

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  AFFILIATE = 'AFFILIATE',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User Role',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  usedName: string;

  @Field()
  fullName: string;

  @Field()
  birthDate?: number;

  @Field()
  password?: string;

  @Field()
  isEmailVerified: boolean;

  @Field()
  avatar?: string;

  @Field(() => [Role])
  role: Role[];

  @Field()
  referralCode?: string;

  @Field(() => Account)
  account?: Account;

  @Field(() => Balance)
  balance: Balance;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
