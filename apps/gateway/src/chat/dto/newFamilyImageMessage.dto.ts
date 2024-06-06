import { IsNotEmpty, IsString } from 'class-validator';

export class NewFamilyImageMessageDto {
  @IsString()
  @IsNotEmpty()
  familyId: number;

  @IsString()
  @IsNotEmpty()
  imageData: string;
}
