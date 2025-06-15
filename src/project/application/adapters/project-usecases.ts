import {
  ProjectNotFoundError,
  ProjectValidationError,
} from 'src/project/domain/errors';
import { Project } from 'src/project/domain/model/Project';
import { IProjectRepository } from 'src/project/domain/ports/repository';
import { ProjectId } from 'src/project/domain/value-object/project-id';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectResponseDto } from '../dto/project-response.dto';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { IProjectUseCases } from '../ports/project-usecases.interface';

export class ProjectUseCases implements IProjectUseCases {
  constructor(private readonly repo: IProjectRepository) {}

  async createProject(dto: CreateProjectDto): Promise<void> {
    try {
      const project = Project.create(
        ProjectId.generate().value,
        dto.title,
        dto.description,
        dto.status,
      );
      return this.repo.save(project);
    } catch (error) {
      if (error instanceof ProjectValidationError) {
        throw error;
      }
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  async updateProject(projectId: string, dto: UpdateProjectDto): Promise<void> {
    const project = await this.repo.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(`Project with ID ${projectId} not found`);
    }

    try {
      if (dto.title !== undefined) {
        project.updateTitle(dto.title);
      }
      if (dto.description !== undefined) {
        project.updateDescription(dto.description);
      }
      if (dto.status !== undefined) {
        project.updateStatus(dto.status);
      }

      return this.repo.save(project);
    } catch (error) {
      if (error instanceof ProjectValidationError) {
        throw error;
      }
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  async getProject(projectId: string): Promise<ProjectResponseDto> {
    const project = await this.repo.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(`Project with ID ${projectId} not found`);
    }
    return new ProjectResponseDto(
      project.id,
      project.title,
      project.description,
      project.status,
    );
  }

  async getAllProjects(): Promise<ProjectResponseDto[]> {
    const projects = await this.repo.findAll();
    return projects.map(
      (project) =>
        new ProjectResponseDto(
          project.id,
          project.title,
          project.description,
          project.status,
        ),
    );
  }

  async deleteProject(projectId: string): Promise<void> {
    const project = await this.repo.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(`Project with ID ${projectId} not found`);
    }
    await this.repo.delete(projectId);
  }
}
