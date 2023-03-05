import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDetails {
  @Field()
  appId: string;

  @Field()
  usedName: string;

  @Field()
  provider: string;

  @Field()
  email: string;

  @Field()
  isEmailVerified: boolean;

  @Field()
  fullName: string;

  @Field()
  avatar: string;
}
