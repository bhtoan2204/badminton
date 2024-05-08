import { Controller } from "@nestjs/common";
import { ExpenseditureService } from "./expensediture.service";
import { RmqService } from "@app/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";

@Controller()
export class ExpenseditureController {
  constructor(
    private readonly expenseService: ExpenseditureService,
    private readonly rmqService: RmqService
  ) { }

  @EventPattern('financeClient/getExpenseditureType')
  async getExpenseType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.getExpenseditureType(data.id_user, data.id_family);
  }

  @EventPattern('financeClient/createExpenseditureType')
  async createExpenseType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.createExpenseditureType(data.id_user, data.dto);
  }

  @EventPattern('financeClient/updateExpenseditureType')
  async updateExpenseType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.updateExpenseditureType(data.id_user, data.dto);
  }

  @EventPattern('financeClient/deleteExpenseditureType')
  async deleteExpenseType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.deleteExpenseditureType(data.id_user, data.id_family, data.id_expenditure_type);
  }

  @EventPattern('financeClient/getExpensediture')
  async getExpense(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.getExpensediture(data.id_user, data.id_family, data.page, data.itemsPerPage);
  }

  @EventPattern('financeClient/createExpensediture')
  async createExpense(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.createExpensediture(data.id_user, data.dto);
  }

  @EventPattern('financeClient/getExpenseditureById')
  async getExpenseById(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.getExpenditureById(data.id_user, data.id_family, data.id_expenditure);
  }

  @EventPattern('financeClient/getStatiscalExpensediture')
  async getStatiscalExpense(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.getStatiscalExpensediture(data.id_user, data.id_family);
  }

  @EventPattern('financeClient/updateExpensediture')
  async updateExpense(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.updateExpensediture(data.id_user, data.dto);
  }

  @EventPattern('financeClient/deleteExpensediture')
  async deleteExpense(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.deleteExpensediture(data.id_user, data.id_family, data.id_expenditure);
  }
}