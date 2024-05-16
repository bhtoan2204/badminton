import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GrpcOptions, Transport } from "@nestjs/microservices";
import { dirname, join } from "path";

@Injectable()
export class GrpcService {
    constructor(private readonly configService: ConfigService) { }

    getOptions(service: string): GrpcOptions {
        return {
            transport: Transport.GRPC,
            options: {
                package: this.configService.get<string>(`GRPC_${service}_PACKAGE`),
                protoPath: join(dirname(__filename), '..', this.configService.get<string>(`GRPC_${service}_PROTO_PATH`)),
                url: this.configService.get<string>(`GRPC_${service}_URL`),
                maxReceiveMessageLength: 500 * 1024 * 1024,
                maxSendMessageLength: 500 * 1024 * 1024
            },
        };
    }
}