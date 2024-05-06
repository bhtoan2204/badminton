import { Module, forwardRef } from "@nestjs/common";
import { FinanceModule } from "../../finance.module";
import { FamilyWalletCategoryController } from "./familyWalletCategory.controller";
import { FamilyWalletCategoryService } from "./familyWalletCategory.service";

@Module({
  imports: [
    forwardRef(() => FinanceModule)
  ],
  controllers: [FamilyWalletCategoryController],
  providers: [FamilyWalletCategoryService]
})
export class FamilyWalletCategoryModule {}