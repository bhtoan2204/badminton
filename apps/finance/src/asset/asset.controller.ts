import { Controller} from "@nestjs/common";
import { RmqService } from "@app/common";
import { AssetService } from "./asset.service";

@Controller()
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly rmqService: RmqService
  ) { }
}