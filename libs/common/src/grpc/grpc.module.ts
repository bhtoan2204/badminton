import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GrpcService } from './grpc.service';

interface GrpcModuleOptions {
    name: string;
}

@Module({
    providers: [GrpcService],
    exports: [GrpcService],
})
export class GrpcModule {
    static register({ name }: GrpcModuleOptions): DynamicModule {
        return {
            module: GrpcModule,
            imports: [
                ClientsModule.registerAsync([
                    {
                        name,
                        useFactory: (configService: ConfigService) => ({
                            transport: Transport.GRPC,
                            options: {
                                package: configService.get<string>(`GRPC_${name}_PACKAGE`),
                                protoPath: configService.get<string>(`GRPC_${name}_PROTO_PATH`)
                            },
                        }),
                        inject: [ConfigService],
                    },
                ]),
            ],
            exports: [ClientsModule],
        };
    }
}