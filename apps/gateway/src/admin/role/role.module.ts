import { forwardRef, Module } from '@nestjs/common';
import { AdminModule } from '../admin.module';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  imports: [forwardRef(() => AdminModule)],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
