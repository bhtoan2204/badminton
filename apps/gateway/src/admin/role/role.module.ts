import { forwardRef, Module } from '@nestjs/common';
import { AdminModule } from '../admin.module';
import { RmqModule } from '@app/common';
import { FAMILY_SERVICE } from '../../utils';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  imports: [
    forwardRef(() => AdminModule),
    RmqModule.register({ name: FAMILY_SERVICE }),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
