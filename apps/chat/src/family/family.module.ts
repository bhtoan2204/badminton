import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { GrpcModule } from '@app/common';

@Module({
  imports: [GrpcModule.register({ name: 'FAMILY' })],
  providers: [FamilyService],
  exports: [FamilyService],
})
export class FamilyModule {}
