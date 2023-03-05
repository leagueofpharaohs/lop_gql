import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Account {
  @Field(() => ID)
  id: string;

  @Field()
  provider: string;

  @Field()
  type: string;

  @Field()
  providerId: string;

  @Field({ nullable: true })
  refreshTokenHash: string;
}
