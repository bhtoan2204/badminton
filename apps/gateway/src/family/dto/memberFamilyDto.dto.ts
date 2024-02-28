import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, IsString } from "class-validator";



export class memberFamilyDto {

    @IsString()

    @ApiProperty({ example: 'Test@gmail.com' })

    gmail: string;



    @IsString()

    @ApiProperty({ example: '' })

    phone: string;



    @ApiProperty({ example: 1 })

    role: number;

}