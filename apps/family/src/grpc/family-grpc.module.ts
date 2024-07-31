import { Module } from '@nestjs/common';
import { FamilyGrpcService } from './family-grpc.service';
import { FamilyGrpcController } from './family-grpc.controller';
import { DatabaseModule, Family, GrpcModule, MemberFamily } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GrpcModule,
    TypeOrmModule.forFeature([Family, MemberFamily]),
    DatabaseModule,
  ],
  controllers: [FamilyGrpcController],
  providers: [FamilyGrpcService],
})
export class FamilyGrpcModule {}
