export class ProjectValidationError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ProjectValidationError';
  }
}

export class ProjectNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ProjectNotFoundError';
  }
}
