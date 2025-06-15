import { Project } from 'src/project/domain/entities/Project';
import { IProjectRepository } from 'src/project/domain/ports/repository';

type ProjectSchema = {
  id: string;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

export class InMemoryProjectRepository implements IProjectRepository {
  private projects: ProjectSchema[] = [];

  async findAll(): Promise<Project[]> {
    return this.projects.map(this.toDomain);
  }

  async findById(id: string): Promise<Project | null> {
    const project = this.projects.find((p) => p.id === id);
    return project ? this.toDomain(project) : null;
  }

  async save(project: Project): Promise<void> {
    const existingIndex = this.projects.findIndex((p) => p.id === project.id);
    const projectSchema: ProjectSchema = {
      id: project.id,
      title: project.title,
      description: project.description,
      status: project.status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      this.projects[existingIndex] = projectSchema;
    } else {
      this.projects.push(projectSchema);
    }
  }

  async delete(id: string): Promise<void> {
    this.projects = this.projects.filter((p) => p.id !== id);
  }

  toDomain(project: ProjectSchema): Project {
    return Project.create(
      project.id,
      project.title,
      project.description,
      project.status,
    );
  }
}
