import { All, Controller, Req, Res, UseGuards } from "@nestjs/common";
import { TusService } from "./tus/tus.service";
import { SupabaseAuthorisationGuard } from "../supabase-authorisation/supabase-authorisation.guard";

@Controller()
export class StorageController {
  constructor(private readonly tusService: TusService) {}

  @All(["files", "files/*"])
  async filesWrite(@Req() req, @Res() res) {
    return this.tusService.handle(req, res);
  }
}
