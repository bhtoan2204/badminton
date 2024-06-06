import { Inject, Injectable } from '@nestjs/common';
import { FINANCE_SERVICE } from '../../utils';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class SavingService {
  constructor(@Inject(FINANCE_SERVICE) private financeClient: ClientProxy) {}

  async getSaving() {
    return 'Saving';
  }

  async createSaving() {
    return 'Saving created';
  }

  async updateSaving() {
    return 'Saving updated';
  }

  async deleteSaving() {
    return 'Saving deleted';
  }
}
