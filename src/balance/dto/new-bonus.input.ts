import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class NewBonusInput {
  @Field()
  bonusType: string;

  @Field()
  tokenUnits: string;

  @Field({ nullable: true })
  @IsOptional()
  tokenStatus?: string;

  @Field()
  bonusId: string;
}
