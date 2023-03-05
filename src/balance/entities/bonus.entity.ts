import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BonusToken } from './bounsToken.entity';

@ObjectType()
export class Bonus {
  @Field(() => ID)
  id: string;

  @Field()
  totlaBonus: string;

  @Field(() => [BonusToken], { nullable: true })
  bonusToken: BonusToken[];
}
