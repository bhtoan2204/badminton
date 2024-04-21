import { Module, forwardRef } from "@nestjs/common";
import { AssetController } from "./asset.controller";
import { AssetService } from "./asset.service";
import { FinanceModule } from "../finance.module";

@Module({
  imports: [forwardRef(() => FinanceModule)],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {
  
}