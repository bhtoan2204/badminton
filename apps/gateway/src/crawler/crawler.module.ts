import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { CRAWLER_SERVICE } from "../utils/constant/services.constant";
import { CrawlerController } from "./crawler.controller";
import { CrawlerService } from "./crawler.service";

@Module({
  imports: [
    RmqModule.register({ name: CRAWLER_SERVICE }),
  ],
  controllers: [CrawlerController],
  providers: [CrawlerService]
})
export class CrawlerModule { }