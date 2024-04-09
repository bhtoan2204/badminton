import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator"

enum Status {
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

export class ChangeStatusSubjectDto {
  @ApiProperty({ description: 'Subject id' })
  @IsNumber()
  @IsNotEmpty()
  id_subject: number

  @ApiProperty({ description: 'Education progress id' })
  @IsNumber()
  @IsNotEmpty()
  id_education_progress: number

  @ApiProperty({ description: 'Family id' })
  @IsNumber()
  @IsNotEmpty()
  id_family: number

  @ApiProperty({ description: 'Status' })
  @IsEnum(Status, {
    message: `Status must be either ${Status.IN_PROGRESS} or ${Status.DONE}`
  })
  @IsNotEmpty()
  status: string
}