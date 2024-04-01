import { GlobalJwtModule } from "@app/common";
import { Module } from "@nestjs/common";
import { VideoController } from "./video.controller";
import { VideoService } from "./video.service";
import { VideoGateway } from "./video.gateway";

@Module({
  imports: [
    GlobalJwtModule
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoGateway]
})
export class VideoModule { }