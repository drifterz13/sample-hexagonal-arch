import {
  ProjectNotFoundError,
  ProjectValidationError,
} from 'src/project/domain/errors';
import { Project } from 'src/project/domain/model/Project';
import { IProjectRepository } from 'src/project/domain/ports/repository';
import { ProjectId } from 'src/project/domain/value-object/project-id';
import { IProjectUseCases } from '../ports/project-usecases.interface';

export class ProjectUseCases implements IProjectUseCases {
  private readonly repo: IProjectRepository;

  constructor(repo: IProjectRepository) {
    this.repo = repo;
  }

  async createProject(
    title: string,
    description: string,
    status: string,
  ): Promise<void> {
    try {
      const project = Project.create(
        ProjectId.generate().value,
        title,
        description,
        status,
      );
      return this.repo.save(project);
    } catch (error) {
      if (error instanceof ProjectValidationError) {
        throw error;
      }
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  async updateProject(
    projectId: string,
    updates: {
      title?: string;
      description?: string;
      status?: string;
    },
  ): Promise<void> {
    const project = await this.repo.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(`Project with ID ${projectId} not found`);
    }

    try {
      if (updates.title !== undefined) {
        project.updateTitle(updates.title);
      }
      if (updates.description !== undefined) {
        project.updateDescription(updates.description);
      }
      if (updates.status !== undefined) {
        project.updateStatus(updates.status);
      }

      return this.repo.save(project);
    } catch (error) {
      if (error instanceof ProjectValidationError) {
        throw error;
      }
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  async getProject(projectId: string): Promise<Project> {
    const project = await this.repo.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(`Project with ID ${projectId} not found`);
    }
    return project;
  }

  async deleteProject(projectId: string): Promise<void> {
    const project = await this.repo.findById(projectId);
    if (!project) {
      throw new ProjectNotFoundError(`Project with ID ${projectId} not found`);
    }
    await this.repo.delete(projectId);
  }
}
