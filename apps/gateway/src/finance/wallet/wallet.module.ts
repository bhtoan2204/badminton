import { Module } from "@nestjs/common";
import { FamilyWalletModule } from "./familyWallet/familyWallet.module";

@Module({
  imports: [
    FamilyWalletModule
  ],
})
export class WalletModule { }