import { Module, forwardRef } from "@nestjs/common";
import { FamilyWalletController } from "./familyWallet.controller";
import { FamilyWalletService } from "./familyWallet.service";
import { FinanceModule } from "../finance.module";
import { FamilyWalletCategoryModule } from "./familyWalletCategory/familyWalletCategory.module";

@Module({
  imports: [
    forwardRef(() => FinanceModule),
    forwardRef(() => FamilyWalletCategoryModule)
  ],
  controllers: [FamilyWalletController],
  providers: [FamilyWalletService],
  exports: [FamilyWalletCategoryModule],
})
export class FamilyWalletModule {}
