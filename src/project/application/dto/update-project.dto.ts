import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class UpdateProjectDto {
  @ApiPropertyOptional({
    description: 'Project title',
    example: 'Updated Project Title',
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MaxLength(50, { message: 'Title must be 50 characters or less' })
  readonly title?: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'Updated project description',
    maxLength: 250,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(250, { message: 'Description must be 250 characters or less' })
  readonly description?: string;

  @ApiPropertyOptional({
    description: 'Project status',
    enum: ['draft', 'active', 'completed', 'archived'],
    example: 'completed',
  })
  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsIn(['draft', 'active', 'completed', 'archived'], {
    message: 'Status must be one of: draft, active, completed, archived',
  })
  readonly status?: string;
}
