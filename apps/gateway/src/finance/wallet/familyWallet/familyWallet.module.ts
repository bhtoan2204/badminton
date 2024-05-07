import { Module, forwardRef } from "@nestjs/common";
import { FamilyWalletCategoryModule } from "./familyWalletCategory/familyWalletCategory.module";
import { FinanceModule } from "../../finance.module";
import { FamilyWalletController } from "./familyWallet.controller";
import { FamilyWalletService } from "./familyWallet.service";

@Module({
  imports: [
    FamilyWalletCategoryModule,
    forwardRef(() => FinanceModule),
  ],
  controllers: [FamilyWalletController],
  providers: [FamilyWalletService],
})
export class FamilyWalletModule {}