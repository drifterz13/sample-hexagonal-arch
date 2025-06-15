import { Project } from 'src/project/domain/model/Project';

export interface IProjectUseCases {
  createProject(
    title: string,
    description: string,
    status: string,
  ): Promise<void>;
  updateProject(
    projectId: string,
    params: {
      title?: string;
      description?: string;
      status?: string;
    },
  ): Promise<void>;
  getProject(projectId: string): Promise<Project>;
  deleteProject(projectId: string): Promise<void>;
}
