import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GrpcService } from './grpc.service';
import { dirname, join } from 'path';

interface GrpcModuleOptions {
    name: string;
}

@Module({
    providers: [GrpcService],
    exports: [GrpcService],
})
export class GrpcModule {
    static register({ name }: GrpcModuleOptions): DynamicModule {
        const currentDir = dirname(__filename);
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
                                protoPath: join(currentDir, '..', '..', '..', 'proto', configService.get<string>(`GRPC_${name}_PROTO_PATH`)),
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