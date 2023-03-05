import { InputType, Field } from '@nestjs/graphql';
import { bonusInput } from './bonus-input';
import { BuyInput } from './buy-inputs';
import { WithdrawalInput } from './withdrawal.input';

@InputType()
export class BalanceInput {
  @Field()
  totalLocked: string;

  @Field()
  totalUnlocked: string;

  @Field()
  userId: string;

  @Field()
  buy: BuyInput;

  @Field()
  bonus: bonusInput;

  @Field()
  withdrawal?: WithdrawalInput;
}
