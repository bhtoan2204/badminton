import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class NewMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;
}