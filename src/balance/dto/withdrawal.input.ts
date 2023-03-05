import { InputType, Field } from '@nestjs/graphql';
import { NewWithdrawalInput } from './new-withdrawal.input';

@InputType()
export class WithdrawalInput {
  @Field()
  totalWithdrawal: string;

  @Field(() => [NewWithdrawalInput])
  WithdrawalToken: NewWithdrawalInput;
}
