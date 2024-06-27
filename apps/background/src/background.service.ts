import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { FirebaseService } from '@app/common';

@Injectable()
@Processor('cron-queue')
export class BackgroundService implements OnModuleInit {
  constructor(
    @InjectQueue('cron-queue') private readonly cronQueue: Queue,
    private readonly firebaseService: FirebaseService,
  ) {}

  async getHello(id_user: string): Promise<any> {
    try {
      const data = await this.firebaseService.sendNotificationByUserId(
        id_user,
        'title',
        'body',
      );
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async onModuleInit() {
    await this.addCronJobA();
    await this.addCronJobB();
  }

  async addCronJobA() {
    await this.cronQueue.add('job-a', {}, { repeat: { cron: '*/1 * * * *' } });
  }

  async addCronJobB() {
    await this.cronQueue.add('job-b', {}, { repeat: { cron: '*/2 * * * *' } });
  }

  @Process('job-a')
  async handleJobA(job: Job<any>) {
    console.log(job.data);
    console.log('A');
  }

  @Process('job-b')
  async handleJobB(job: Job<any>) {
    console.log(job.data);
    console.log('B');
  }

  @Process('calendar')
  async handleCalendar(job: Job<any>) {
    console.log(job.data);
    console.log('Calendar');
  }
}
