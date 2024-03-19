import { IsNotEmpty, IsString } from "class-validator";

export class NewImageMessageDto {
  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  imageData: string;
}