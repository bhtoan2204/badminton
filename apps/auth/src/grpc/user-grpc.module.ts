import { Module } from '@nestjs/common';
import { UserGrpcService } from './user-grpc.service';
import { UserGrpcController } from './user-grpc.controller';
import { MainDatabaseModule, GrpcModule, Users } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [GrpcModule, MainDatabaseModule, TypeOrmModule.forFeature([Users])],
  controllers: [UserGrpcController],
  providers: [UserGrpcService],
})
export class UserGrpcModule {}
