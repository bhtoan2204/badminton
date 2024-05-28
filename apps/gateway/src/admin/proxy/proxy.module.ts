import { RmqModule } from "@app/common";
import { Module } from "@nestjs/common";
import { ELASTICSEARCH_SERVICE } from "../../utils";
import { ProxyController } from "./proxy.controller";
import { ProxyService } from "./proxy.service";

@Module({
  imports: [
    RmqModule.register({ name: ELASTICSEARCH_SERVICE }),
  ],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule { }