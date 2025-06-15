import { Project } from '../entities/Project';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  save(project: Project): Promise<void>;
  delete(projectId: string): Promise<void>;
}
