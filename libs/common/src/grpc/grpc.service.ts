import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GrpcOptions, Transport } from "@nestjs/microservices";
import { dirname, join } from "path";

@Injectable()
export class GrpcService {
    constructor(private readonly configService: ConfigService) { }

    getOptions(service: string): GrpcOptions {
        const currentDir = dirname(__filename);
        return {
            transport: Transport.GRPC,
            options: {
                package: this.configService.get<string>(`GRPC_${service}_PACKAGE`),
                protoPath: join(currentDir, '..', '..', '..', 'proto', this.configService.get<string>(`GRPC_${service}_PROTO_PATH`)),
            },
        };
    }
}