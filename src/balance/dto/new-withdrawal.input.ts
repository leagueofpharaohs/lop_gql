import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class NewWithdrawalInput {
  @Field()
  withdrawalMethod: string;

  @Field()
  tokenUnits: string;

  @Field()
  wallet: string;

  @Field({ nullable: true })
  @IsOptional()
  status?: string;

  @Field()
  withdrawalId: string;
}
