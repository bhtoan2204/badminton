import { Module, forwardRef } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { FinanceModule } from '../finance.module';
import { DatabaseModule, FinanceAssets } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    forwardRef(() => FinanceModule),
    DatabaseModule,
    TypeOrmModule.forFeature([FinanceAssets]),
    StorageModule,
  ],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
