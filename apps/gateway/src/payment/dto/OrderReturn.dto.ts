import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class OrderReturnDTO {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 1 })
    id_order: number;

    @IsString()
    @ApiProperty({ example: 'NCB' })
    bankCode: string;

    @IsNumber()
    @ApiProperty({ example: 10000000 })
    amount: number;

    @IsString()
    @ApiProperty({ example: '00' })
    vnp_ResponseCode: string;

    @IsString()
    @ApiProperty({ example: '00' })
    vnp_TransactionStatus: string;
    
}