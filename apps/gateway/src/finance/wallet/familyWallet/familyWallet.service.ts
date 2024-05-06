import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FINANCE_SERVICE } from "../../../utils";

@Injectable()
export class FamilyWalletService {
  constructor(
    @Inject(FINANCE_SERVICE) private financeClient: ClientProxy
  ) {}
  
}