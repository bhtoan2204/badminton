import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Old password'})
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'New password'})
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/, {
    message: 'newPassword must be at least 8 characters, include at least one uppercase letter, one lowercase letter, and one number.'
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Confirm password'})
  confirmPassword: string;
}