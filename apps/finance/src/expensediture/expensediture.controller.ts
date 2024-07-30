import { Controller } from '@nestjs/common';
import { ExpenseditureService } from './expensediture.service';
import { RmqService } from '@app/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class ExpenseditureController {
  constructor(
    private readonly expenseService: ExpenseditureService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('financeClient/getExpenseByDate')
  async getExpenseByDate(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.getExpenseByDate(
      data.id_user,
      data.id_family,
      data.date,
    );
  }
  @EventPattern('financeClient/getExpenseByMonth')
  async getExpenseByMonth(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.getExpenseByMonth(
      data.id_user,
      data.id_family,
      data.month,
      data.year,
    );
  }
  @EventPattern('financeClient/getExpenseByYear')
  async getExpenseByYear(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.getExpenseByYear(
      data.id_user,
      data.id_family,
      data.year,
    );
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
    return this.expenseService.deleteExpenseditureType(
      data.id_user,
      data.id_family,
      data.id_expenditure_type,
    );
  }

  @EventPattern('financeClient/getExpenseditureType')
  async getExpenseditureType(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.getExpenseditureType(
      data.id_user,
      data.id_family,
      data.page,
      data.itemsPerPage,
    );
  }

  @EventPattern('financeClient/createExpensediture')
  async createExpense(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.createExpensediture(
      data.id_user,
      data.dto,
      data.file,
    );
  }

  @EventPattern('financeClient/getExpenseditureById')
  async getExpenseById(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.getExpenditureById(
      data.id_user,
      data.id_family,
      data.id_expenditure,
    );
  }

  @EventPattern('financeClient/getExpenseByDateRange')
  async getExpenseByDateRange(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.expenseService.getExpenseByDateRange(data.id_user, data.dto);
  }

  @EventPattern('financeClient/updateExpensediture')
  async updateExpense(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.updateExpensediture(
      data.id_user,
      data.dto,
      data.file,
    );
  }

  @EventPattern('financeClient/deleteExpensediture')
  async deleteExpense(@Payload() data: any, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    return this.expenseService.deleteExpensediture(
      data.id_user,
      data.id_family,
      data.id_expenditure,
    );
  }

  @EventPattern('financeClient/addDefaultExpenseType')
  async addDefaultExpenseType(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.expenseService.addDefaultExpenseType(data.id_family);
  }
}
