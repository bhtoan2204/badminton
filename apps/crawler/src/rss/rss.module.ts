import { Module } from "@nestjs/common";
import { RssController } from "./rss.controller";
import { RssService } from "./rss.service";
import { RmqModule } from "@app/common";

@Module({
  imports: [RmqModule],
  controllers: [RssController],
  providers: [RssService],
})
export class RssModule {}