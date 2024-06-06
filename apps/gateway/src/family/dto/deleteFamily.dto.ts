import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteMemberDTO {
  @IsNotEmpty()
  @ApiProperty({ example: 60 })
  id_family: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '52f8ec77-212e-4eec-94cb-1c37063a9354' })
  id_user: string;
}
