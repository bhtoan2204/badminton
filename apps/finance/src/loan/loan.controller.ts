import { Controller } from "@nestjs/common";
import { LoanService } from "./loan.service";
import { RmqService } from "@app/common";

@Controller()
export class LoanController {
  constructor(
    private readonly loanService: LoanService,
    private readonly rmqService: RmqService
  ) { }
}