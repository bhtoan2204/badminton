import { IsNotEmpty, IsString } from 'class-validator';

export class NewFamilyMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  familyId: number;
}
