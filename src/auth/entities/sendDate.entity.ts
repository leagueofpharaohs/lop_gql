import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SendDate {
  @Field()
  sendDate: string;
  @Field()
  codeLength: number;
}
