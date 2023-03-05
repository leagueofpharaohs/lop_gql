import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class WithdrawalToken {
  @Field(() => ID)
  id: string;

  @Field()
  withdrawalMethod: string;

  @Field()
  tokenUnits: string;

  @Field()
  wallet: string;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
