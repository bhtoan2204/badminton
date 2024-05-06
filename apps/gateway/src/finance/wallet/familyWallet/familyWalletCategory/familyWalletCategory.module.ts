import { Module, forwardRef } from "@nestjs/common";
import { FamilyWalletCategoryController } from "./familyWalletCategory.controller";
import { FamilyWalletCategoryService } from "./familyWalletCategory.service";
import { FinanceModule } from "../../../finance.module";

@Module({
  imports: [
    forwardRef(() => FinanceModule)
  ],
  controllers: [FamilyWalletCategoryController],
  providers: [FamilyWalletCategoryService]
})
export class FamilyWalletCategoryModule {}