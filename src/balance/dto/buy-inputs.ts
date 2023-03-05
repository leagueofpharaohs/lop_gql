import { InputType, Field } from '@nestjs/graphql';
import { NewBuyInput } from './new-buy.input';

@InputType()
export class BuyInput {
  @Field()
  totalToken: string;

  @Field(() => [NewBuyInput])
  buyToken: NewBuyInput;
}
