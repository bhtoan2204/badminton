import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { GrpcCalendarService } from './grpc-calendar.service';

@Processor('default-checklist-queue')
export class BackgroundCalendarService {
  constructor(private readonly grpcCalendarService: GrpcCalendarService) {}

  @Process('createChecklist')
  async createChecklist(job: Job) {
    const { id_family } = job.data;
    await this.grpcCalendarService.createDefaultChecklistType({
      idFamily: id_family,
    });
  }
}
