import { Module, forwardRef } from "@nestjs/common";
import { FamilyWalletCategoryModule } from "./familyWalletCategory/familyWalletCategory.module";
import { FinanceModule } from "../../finance.module";

@Module({
  imports: [
    FamilyWalletCategoryModule,
    forwardRef(() => FinanceModule),
  ],
  controllers: [],
  providers: [],
})
export class FamilyWalletModule {}