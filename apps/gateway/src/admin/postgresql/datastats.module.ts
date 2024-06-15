import { forwardRef, Module } from '@nestjs/common';
import { PostgresqlService } from './datastats.service';
import { PostgresqlController } from './datastats.controller';
import { AdminModule } from '../admin.module';

@Module({
  imports: [forwardRef(() => AdminModule)],
  controllers: [PostgresqlController],
  providers: [PostgresqlService],
})
export class PostgresqlModule {}
