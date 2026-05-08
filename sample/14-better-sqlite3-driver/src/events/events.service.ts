import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  type AuditEvent,
  type CreateAuditEvent,
  EventsRepository,
} from './events.repository';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(private readonly eventsRepository: EventsRepository) {}

  onModuleInit(): void {
    this.eventsRepository.migrate();
  }

  list(): AuditEvent[] {
    return this.eventsRepository.list();
  }

  create(input: CreateAuditEvent): AuditEvent {
    return this.eventsRepository.create(input);
  }
}
