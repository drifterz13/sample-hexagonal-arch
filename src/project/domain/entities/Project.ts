import { ProjectDescription } from '../value-objects/project-description';
import { ProjectId } from '../value-objects/project-id';
import { ProjectStatus } from '../value-objects/project-status';
import { ProjectTitle } from '../value-objects/project-title';

export class Project {
  readonly #id: ProjectId;
  #title: ProjectTitle;
  #description: ProjectDescription;
  #status: ProjectStatus;

  private constructor(
    id: string,
    title: string,
    description: string,
    status: string,
  ) {
    this.#id = ProjectId.generate(id);
    this.#title = ProjectTitle.create(title);
    this.#description = ProjectDescription.create(description);
    this.#status = ProjectStatus.create(status);
  }

  static create(
    id: string,
    title: string,
    description: string,
    status: string,
  ): Project {
    return new Project(id, title, description, status);
  }

  updateTitle(newTitle: string) {
    this.#title = ProjectTitle.create(newTitle);
  }

  updateDescription(newDescription: string) {
    this.#description = ProjectDescription.create(newDescription);
  }

  updateStatus(newStatus: string) {
    this.#status = ProjectStatus.create(newStatus);
  }

  get id(): string {
    return this.#id.value;
  }

  get title(): string {
    return this.#title.value;
  }

  get description(): string {
    return this.#description.value;
  }
  get status(): string {
    return this.#status.value;
  }
}
