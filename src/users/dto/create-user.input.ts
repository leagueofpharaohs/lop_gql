import { InputType, Field } from '@nestjs/graphql';
import { Balance, User } from '@prisma/client';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  @MinLength(5)
  fullName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  password?: string;

  @Field({ nullable: true })
  @IsOptional()
  isEmailVerified?: boolean;
}
