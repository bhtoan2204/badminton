import { Module, forwardRef } from '@nestjs/common';
import { AuthApiModule } from '../auth.module';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [forwardRef(() => AuthApiModule)],
  controllers: [FirebaseController],
  providers: [FirebaseService],
})
export class FirebaseModule {}
