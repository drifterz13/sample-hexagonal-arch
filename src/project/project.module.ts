import { Module } from '@nestjs/common';
import { ProjectUseCases } from './application/adapters/project-usecases';
import { IProjectRepository } from './domain/ports/repository';
import { INJECTION_TOKENS } from './injection-tokens';
import { ProjectController } from './infrastructure/adapters/http/project.controller';
import { InMemoryProjectRepository } from './infrastructure/adapters/storage/in-memory/project.repository';

@Module({
  controllers: [ProjectController],
  providers: [
    {
      provide: INJECTION_TOKENS.PROJECT_REPOSITORY,
      useClass: InMemoryProjectRepository,
    },
    {
      provide: INJECTION_TOKENS.PROJECT_USE_CASES,
      useFactory: (repository: IProjectRepository) => {
        return new ProjectUseCases(repository);
      },
      inject: [INJECTION_TOKENS.PROJECT_REPOSITORY],
    },
  ],
  exports: [INJECTION_TOKENS.PROJECT_USE_CASES],
})
export class ProjectModule {}
