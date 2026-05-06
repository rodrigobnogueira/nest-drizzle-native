import { Module } from '@nestjs/common';
import { DatabaseConfigModule } from '../config/database-config.module';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';

@Module({
  imports: [DatabaseConfigModule],
  controllers: [SystemController],
  providers: [SystemService],
})
export class SystemModule {}
