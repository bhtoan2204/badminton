import { Module } from '@nestjs/common';
import { FamilyGrpcService } from './family-grpc.service';
import { FamilyGrpcController } from './family-grpc.controller';
import {
  MainDatabaseModule,
  Family,
  GrpcModule,
  MemberFamily,
} from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GrpcModule,
    TypeOrmModule.forFeature([Family, MemberFamily]),
    MainDatabaseModule,
  ],
  controllers: [FamilyGrpcController],
  providers: [FamilyGrpcService],
})
export class FamilyGrpcModule {}
