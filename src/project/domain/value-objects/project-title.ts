import { ProjectValidationError } from '../errors';

export class ProjectTitle {
  #value: string;

  private constructor(value: string) {
    this.validate(value);
    this.#value = value;
  }

  static create(value: string): ProjectTitle {
    return new ProjectTitle(value);
  }

  equals(other: string): boolean {
    return this.value === other;
  }

  private validate(value: string) {
    if (!this.isValidTitle(value)) {
      throw new ProjectValidationError(
        'Title must be between 1 and 50 characters.',
      );
    }
  }

  private isValidTitle(value: string) {
    return value.length > 0 && value.length <= 50;
  }

  get value(): string {
    return this.#value;
  }
}
