import { GenId } from '../../../shared/domain/gen-id';

export class ProjectId extends GenId {
  private constructor(id?: string) {
    super(id);
  }

  static generate(id?: string): ProjectId {
    return new ProjectId(id);
  }
}
