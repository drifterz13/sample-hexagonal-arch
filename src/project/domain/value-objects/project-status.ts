import { ProjectValidationError } from '../errors';

export class ProjectStatus {
  #value: string;

  private constructor(value: string) {
    if (!this.isValidStatus(value)) {
      throw new ProjectValidationError('Invalid project status');
    }

    this.#value = value;
  }

  static create(value: string): ProjectStatus {
    return new ProjectStatus(value);
  }

  private isValidStatus(value: string): boolean {
    const validStatuses = ['draft', 'active', 'completed', 'archived'];
    return validStatuses.includes(value);
  }

  equals(other: string): boolean {
    return this.value === other;
  }

  static draft(): ProjectStatus {
    return new ProjectStatus('draft');
  }

  static active(): ProjectStatus {
    return new ProjectStatus('active');
  }

  static completed(): ProjectStatus {
    return new ProjectStatus('completed');
  }

  static archived(): ProjectStatus {
    return new ProjectStatus('archived');
  }

  get value(): string {
    return this.#value;
  }
}
