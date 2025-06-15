import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Project title',
    example: 'My Awesome Project',
    maxLength: 50,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MaxLength(50, { message: 'Title must be 50 characters or less' })
  readonly title: string;

  @ApiProperty({
    description: 'Project description',
    example: 'This is a detailed description of my project',
    maxLength: 250,
  })
  @IsString({ message: 'Description must be a string' })
  @MaxLength(250, { message: 'Description must be 250 characters or less' })
  readonly description: string;
}
