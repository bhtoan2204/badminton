import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateFamilyDTO {
    @IsNotEmpty()
    @ApiProperty({ example: 60 })
    id_family: number;

    @IsString()
    @ApiProperty({ example: 'abc' })
    description: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'family' })
    name: string;

}