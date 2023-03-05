import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserData {
  @Field()
  id: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field()
  avatar: string;

  @Field()
  isEmailVerified: boolean;

  @Field()
  provider: string;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
