import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class SendCodeInput {
  @Field()
  @IsEmail()
  email: string;
}
