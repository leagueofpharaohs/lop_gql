import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class NewBuyInput {
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

  @Field({ nullable: true })
  @IsOptional()
  buyPhase?: string;

  @Field({ nullable: true })
  @IsOptional()
  status: string;

  @Field()
  buyId: string;
}
