import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ConfirmEmail {
  @Field()
  message: string;

  @Field()
  isValide: boolean;
}
