import { InputType, Field } from '@nestjs/graphql';
import { BonusToken, BuyToken } from '../entities';
import { NewBonusInput } from './new-bonus.input';

@InputType()
export class bonusInput {
  @Field()
  totalBonus: string;

  @Field(() => [NewBonusInput])
  bonusToken: NewBonusInput;
}
