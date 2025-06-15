import { Project } from 'src/project/domain/entities/Project';
import { ProjectResponseDto } from '../dto/project-response.dto';

export class ProjectDtoMapper {
  static toResponseDto(project: Project): ProjectResponseDto {
    return new ProjectResponseDto(
      project.id,
      project.title,
      project.description,
      project.status,
    );
  }
}
