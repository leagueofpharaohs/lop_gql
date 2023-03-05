import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @MinLength(5)
  fullName: string;

  @Field()
  @MinLength(5)
  birthDate: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field()
  @IsNotEmpty()
  isEmailVerified: boolean;
}
