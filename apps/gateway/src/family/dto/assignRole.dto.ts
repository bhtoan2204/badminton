import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id_user: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_family: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id_family_role: number;
}
