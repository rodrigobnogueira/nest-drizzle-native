import { Body, Controller, Get, Post } from '@nestjs/common';
import { SystemService } from './system.service';

interface RecordEventBody {
  message?: string;
}

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get()
  status(): Promise<{ events: number; source: string }> {
    return this.systemService.status();
  }

  @Post('events')
  record(@Body() body: RecordEventBody): Promise<{ id: number; message: string }> {
    return this.systemService.record(body.message ?? 'async configuration');
  }
}
