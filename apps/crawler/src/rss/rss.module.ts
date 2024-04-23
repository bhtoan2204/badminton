import { Module, forwardRef } from "@nestjs/common";
import { RssController } from "./rss.controller";
import { RssService } from "./rss.service";
import { RmqModule } from "@app/common";
import { CrawlerModule } from "../crawler.module";

@Module({
  imports: [forwardRef(() => CrawlerModule)],
  controllers: [RssController],
  providers: [RssService],
})
export class RssModule { }