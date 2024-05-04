import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_room: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  room_name: string;
}