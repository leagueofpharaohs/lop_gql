import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class BuyToken {
  @Field(() => ID)
  id: string;

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
  wallet: string;

  @Field()
  buyPhase: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
