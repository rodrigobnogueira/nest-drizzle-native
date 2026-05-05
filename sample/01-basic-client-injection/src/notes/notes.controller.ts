import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotesService, type Note } from './notes.service';

interface CreateNoteBody {
  title?: string;
}

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  list(): Promise<Note[]> {
    return this.notesService.list();
  }

  @Post()
  create(@Body() body: CreateNoteBody): Promise<Note> {
    return this.notesService.create(body.title ?? 'Untitled note');
  }
}
