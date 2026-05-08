import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({
    example: 'Document schema-derived validation',
    minLength: 3,
    maxLength: 120,
  })
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

  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 13,
  })
  estimatePoints!: number;
}
