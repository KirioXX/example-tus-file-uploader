import { Module } from "@nestjs/common";
import { StorageModule } from "./core/storage/storage.module";
import { ConfigModule } from "@nestjs/config";

// Configurations
import storage from "./config/storage";
import { APP_GUARD } from "@nestjs/core";
import { SupabaseAuthorisationGuard } from "./core/supabase-authorisation/supabase-authorisation.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [storage],
      isGlobal: true,
    }),
    StorageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthorisationGuard,
    },
  ],
})
export class AppModule {}
