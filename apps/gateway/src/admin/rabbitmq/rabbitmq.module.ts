import { forwardRef, Module } from '@nestjs/common';
import { RabbitMqController } from './rabbitmq.controller';
import { RabbitMqService } from './rabbitmq.service';
import { AdminModule } from '../admin.module';

@Module({
  imports: [forwardRef(() => AdminModule)],
  controllers: [RabbitMqController],
  providers: [RabbitMqService],
})
export class RabbitMqModule {}
