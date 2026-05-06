import { Module } from '@nestjs/common';
import { DatabaseConfigService } from './database-config.service';
import { DatabaseLifecycleTracker } from './database-lifecycle.tracker';

@Module({
  providers: [DatabaseConfigService, DatabaseLifecycleTracker],
  exports: [DatabaseConfigService, DatabaseLifecycleTracker],
})
export class DatabaseConfigModule {}
