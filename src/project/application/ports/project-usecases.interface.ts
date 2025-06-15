import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectResponseDto } from '../dto/project-response.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';

export interface IProjectUseCases {
  createProject(dto: CreateProjectDto): Promise<void>;
  updateProject(projectId: string, dto: UpdateProjectDto): Promise<void>;
  getProject(projectId: string): Promise<ProjectResponseDto>;
  getAllProjects(): Promise<ProjectResponseDto[]>;
  deleteProject(projectId: string): Promise<void>;
}
