import { ProjectValidationError } from '../errors';

export class ProjectDescription {
  #value: string;

  private constructor(value: string) {
    this.validate(value);

    this.#value = value;
  }

  static create(value: string): ProjectDescription {
    return new ProjectDescription(value);
  }

  private isValidDescription(value: string): boolean {
    return value.length <= 250;
  }

  private validate(value: string): void {
    if (!this.isValidDescription(value)) {
      throw new ProjectValidationError(
        'Description must be up to 250 characters.',
      );
    }
  }

  equals(other: string): boolean {
    return this.value === other;
  }

  get value(): string {
    return this.#value;
  }
}
