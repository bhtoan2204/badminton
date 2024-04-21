import { Controller } from "@nestjs/common";
import { SavingService } from "./saving.service";
import { RmqService } from "@app/common";

@Controller()
export class SavingController {
  constructor(
    private readonly savingService: SavingService,
    private readonly rmqService: RmqService
  ) { }
}