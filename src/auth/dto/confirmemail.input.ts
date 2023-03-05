import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class ConfirmEmailInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  code: string;

  @Field()
  confiremStep: string;
}
