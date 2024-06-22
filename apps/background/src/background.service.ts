import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';

@Injectable()
@Processor('cron-queue')
export class BackgroundService implements OnModuleInit {
  constructor(@InjectQueue('cron-queue') private readonly cronQueue: Queue) {}

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
