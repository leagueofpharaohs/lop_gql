import { ObjectType, Field, ID } from '@nestjs/graphql';
import { BuyToken } from './buyToken.entity';

@ObjectType()
export class Buy {
  @Field(() => ID)
  id: string;

  @Field()
  totalToken: string;

  @Field(() => [BuyToken], { nullable: true })
  buyToken: BuyToken[];
}
