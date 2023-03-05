import { ObjectType, Field, ID } from '@nestjs/graphql';
import { WithdrawalToken } from './withdrawalToken.entity';

@ObjectType()
export class Withdrawal {
  @Field(() => ID)
  id: string;

  @Field()
  totalWithdrawal: string;

  @Field(() => [WithdrawalToken], { nullable: true })
  WithdrawalToken: WithdrawalToken[];
}
