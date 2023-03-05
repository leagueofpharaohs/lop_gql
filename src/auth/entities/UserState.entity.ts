import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserState {
  @Field()
  id: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field()
  isEmailVerified: boolean;

  @Field()
  avatar: string;

  @Field()
  provider: string;
}
