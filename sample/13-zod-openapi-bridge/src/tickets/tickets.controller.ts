import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';
import { TicketDto } from './ticket.dto';
import {
  createTicketSchema,
  type CreateTicketInput,
} from './ticket.validation';
import { TicketsService } from './tickets.service';
import { ZodValidationPipe } from '../zod-validation.pipe';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOkResponse({ type: TicketDto, isArray: true })
  list(): Promise<TicketDto[]> {
    return this.ticketsService.list();
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTicketSchema))
  @ApiBody({ type: CreateTicketDto })
  @ApiCreatedResponse({ type: TicketDto })
  @ApiBadRequestResponse({ description: 'Zod validation failed' })
  create(@Body() body: CreateTicketInput): Promise<TicketDto> {
    return this.ticketsService.create(body);
  }
}
