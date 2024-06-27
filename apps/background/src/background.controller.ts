import { Controller, Get, Param } from '@nestjs/common';
import { BackgroundService } from './background.service';

@Controller()
export class BackgroundController {
  constructor(private readonly backgroundService: BackgroundService) {}

  @Get(':id_user')
  async getHello(@Param('id_user') id_user: string): Promise<any> {
    return this.backgroundService.getHello(id_user);
  }
}
