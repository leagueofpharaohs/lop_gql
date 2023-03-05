import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordInput {
  @Field()
  id: string;

  @Field()
  token: string;

  @Field()
  password: string;
}
