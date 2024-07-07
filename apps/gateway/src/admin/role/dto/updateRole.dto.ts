import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class UpdateRoleDto {
  @ApiProperty({ description: 'Role ID' })
  @IsNotEmpty()
  @IsNumber()
  id_family_role: number;

  @ApiProperty({ description: 'Role name in Vietnamese' })
  @IsOptional()
  @IsString()
  role_name_vn: string;

  @ApiProperty({ description: 'Role name in English' })
  @IsOptional()
  @IsString()
  role_name_en: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
