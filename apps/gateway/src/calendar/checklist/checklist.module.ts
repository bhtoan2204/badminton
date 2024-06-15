import { Module, forwardRef } from "@nestjs/common";
import { CalendarModule } from "../calendar.module";
import { ChecklistController } from "./checklist.controller";
import { ChecklistService } from "./checklist.service";

@Module({
  imports: [
    forwardRef(() => CalendarModule),
  ],
  controllers: [ChecklistController],
  providers: [ChecklistService],
})
export class ChecklistModule {}