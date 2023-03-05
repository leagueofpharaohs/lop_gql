import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Bonus } from './bonus.entity';
import { Buy } from './buy.entity';
import { Withdrawal } from './withdrawal.entity';

@ObjectType()
export class Balance {
  @Field(() => ID)
  id: string;

  @Field()
  totalLocked: string;

  @Field()
  totalUnlocked: string;

  @Field(() => Buy)
  buy: Buy;

  @Field(() => Bonus)
  bonus: Bonus;

  @Field(() => Withdrawal)
  withdrawal: Withdrawal;
}
