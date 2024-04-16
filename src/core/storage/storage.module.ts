import { Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { TusService } from './tus/tus.service';

@Module({
  controllers: [StorageController],
  providers: [TusService]
})
export class StorageModule {}
