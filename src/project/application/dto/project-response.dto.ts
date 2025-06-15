import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProjectResponseDto {
  @ApiProperty({
    description: 'Unique project identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  readonly id: string;

  @ApiProperty({
    description: 'Project title',
    example: 'My Awesome Project',
  })
  @Expose()
  readonly title: string;

  @ApiProperty({
    description: 'Project description',
    example: 'This is a detailed description of my project',
  })
  @Expose()
  readonly description: string;

  @ApiProperty({
    description: 'Current project status',
    enum: ['draft', 'active', 'completed', 'archived'],
    example: 'active',
  })
  @Expose()
  readonly status: string;

  constructor(id: string, title: string, description: string, status: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}
