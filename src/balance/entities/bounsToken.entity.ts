import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class BonusToken {
  @Field(() => ID)
  id: string;

  @Field()
  bonusType: string;

  @Field()
  tokenUnits: string;

  @Field()
  tokenStatus: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
