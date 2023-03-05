import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BuyToken } from './buyToken.entity';

@ObjectType()
export class ReturnBuy {
  @Field(() => ID)
  id: string;

  @Field()
  totalLocked: string;

  @Field()
  totalUnlocked: string;

  @Field()
  totalToken: string;

  @Field(() => [BuyTokenReturn], { nullable: true })
  buyToken: BuyTokenReturn[];
}

@ObjectType()
export class BuyTokenReturn {
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
  buyPhase: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
