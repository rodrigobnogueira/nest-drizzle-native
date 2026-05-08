import { ApiProperty } from '@nestjs/swagger';

export class TicketDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Document schema-derived validation' })
  title!: string;

  @ApiProperty({
    example: 'ada@example.com',
    format: 'email',
  })
  requesterEmail!: string;

  @ApiProperty({
    enum: ['low', 'normal', 'urgent'],
    example: 'urgent',
  })
  priority!: 'low' | 'normal' | 'urgent';

  @ApiProperty({ example: 5 })
  estimatePoints!: number;

  @ApiProperty({ example: '2026-05-08T12:00:00.000Z' })
  createdAt!: string;
}
