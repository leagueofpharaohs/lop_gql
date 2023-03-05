import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateBalanceInput {
  @Field()
  currencyUsed: string;

  @Field()
  currencyprice: string;

  @Field()
  amount: string;

  @Field()
  tokenUnits: string;

  @Field()
  tokenPrice: string;

  @Field()
  buyPhase: string;

  @Field()
  wallet: string;

  @Field()
  status: string;

  @Field()
  balanceId: string;
}
