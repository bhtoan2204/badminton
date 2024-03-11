import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty } from "class-validator";

export class RoleMemberDTO {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '' })
    id_user: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: '8' })
    id_family: number;


}