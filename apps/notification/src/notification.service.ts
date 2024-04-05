import { Injectable } from '@nestjs/common';

const limit = 20;

@Injectable()
export class NotificationService {
  constructor(

  ) { }

  async getNotification(id_user: string, index: number) {
    return { id_user, index }
  }
}
