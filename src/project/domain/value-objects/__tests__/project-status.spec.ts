import { ProjectValidationError } from '../../errors';
import { ProjectStatus } from '../project-status';

describe('ProjectStatus', () => {
  const validStatuses = ['draft', 'active', 'completed', 'archived'];

  describe('create', () => {
    it.each(validStatuses)('should create valid status: %s', (status) => {
      const projectStatus = ProjectStatus.create(status);

      expect(projectStatus).toBeInstanceOf(ProjectStatus);
      expect(projectStatus.value).toBe(status);
    });

    it('should create status with exact valid string', () => {
      const status = ProjectStatus.create('active');

      expect(status.value).toBe('active');
    });
  });

  describe('static factory methods', () => {
    it('should create draft status', () => {
      const status = ProjectStatus.draft();

      expect(status).toBeInstanceOf(ProjectStatus);
      expect(status.value).toBe('draft');
    });

    it('should create active status', () => {
      const status = ProjectStatus.active();

      expect(status).toBeInstanceOf(ProjectStatus);
      expect(status.value).toBe('active');
    });

    it('should create completed status', () => {
      const status = ProjectStatus.completed();

      expect(status).toBeInstanceOf(ProjectStatus);
      expect(status.value).toBe('completed');
    });

    it('should create archived status', () => {
      const status = ProjectStatus.archived();

      expect(status).toBeInstanceOf(ProjectStatus);
      expect(status.value).toBe('archived');
    });

    it('should create different instances for same status', () => {
      const status1 = ProjectStatus.draft();
      const status2 = ProjectStatus.draft();

      expect(status1).not.toBe(status2);
      expect(status1.value).toBe(status2.value);
    });
  });

  describe('validation edge cases', () => {
    it('should throw error for invalid status', () => {
      expect(() => ProjectStatus.create('invalid')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('invalid')).toThrow(
        'Invalid project status',
      );
    });

    it('should throw error for empty string', () => {
      expect(() => ProjectStatus.create('')).toThrow(ProjectValidationError);
      expect(() => ProjectStatus.create('')).toThrow('Invalid project status');
    });

    it('should throw error for null status', () => {
      expect(() => ProjectStatus.create(null as any)).toThrow(
        ProjectValidationError,
      );
    });

    it('should throw error for undefined status', () => {
      expect(() => ProjectStatus.create(undefined as any)).toThrow(
        ProjectValidationError,
      );
    });

    it('should be case-sensitive - reject uppercase', () => {
      expect(() => ProjectStatus.create('DRAFT')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('Active')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('COMPLETED')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('ARCHIVED')).toThrow(
        ProjectValidationError,
      );
    });

    it('should be case-sensitive - reject mixed case', () => {
      expect(() => ProjectStatus.create('Draft')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('Active')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('Completed')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('Archived')).toThrow(
        ProjectValidationError,
      );
    });

    it('should reject status with leading whitespace', () => {
      expect(() => ProjectStatus.create(' draft')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('  active')).toThrow(
        ProjectValidationError,
      );
    });

    it('should reject status with trailing whitespace', () => {
      expect(() => ProjectStatus.create('draft ')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('active  ')).toThrow(
        ProjectValidationError,
      );
    });

    it('should reject status with internal whitespace', () => {
      expect(() => ProjectStatus.create('dr aft')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('act ive')).toThrow(
        ProjectValidationError,
      );
    });

    it('should reject numeric strings', () => {
      expect(() => ProjectStatus.create('1')).toThrow(ProjectValidationError);
      expect(() => ProjectStatus.create('0')).toThrow(ProjectValidationError);
      expect(() => ProjectStatus.create('123')).toThrow(ProjectValidationError);
    });

    it('should reject boolean strings', () => {
      expect(() => ProjectStatus.create('true')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('false')).toThrow(
        ProjectValidationError,
      );
    });

    it('should reject similar but invalid statuses', () => {
      expect(() => ProjectStatus.create('drafts')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('activ')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('complete')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('archive')).toThrow(
        ProjectValidationError,
      );
    });

    it('should reject special characters', () => {
      expect(() => ProjectStatus.create('draft!')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('active@')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('completed#')).toThrow(
        ProjectValidationError,
      );
    });

    it('should reject unicode and emoji characters', () => {
      expect(() => ProjectStatus.create('📝')).toThrow(ProjectValidationError);
      expect(() => ProjectStatus.create('активный')).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create('完成')).toThrow(
        ProjectValidationError,
      );
    });
  });

  describe('equals', () => {
    it('should return true for identical statuses', () => {
      const status = ProjectStatus.create('active');

      expect(status.equals('active')).toBe(true);
    });

    it('should return false for different statuses', () => {
      const status = ProjectStatus.create('active');

      expect(status.equals('draft')).toBe(false);
      expect(status.equals('completed')).toBe(false);
      expect(status.equals('archived')).toBe(false);
    });

    it('should be case-sensitive', () => {
      const status = ProjectStatus.create('active');

      expect(status.equals('Active')).toBe(false);
      expect(status.equals('ACTIVE')).toBe(false);
    });

    it('should handle empty string comparison', () => {
      const status = ProjectStatus.create('active');

      expect(status.equals('')).toBe(false);
    });

    it('should handle whitespace differences', () => {
      const status = ProjectStatus.create('active');

      expect(status.equals(' active')).toBe(false);
      expect(status.equals('active ')).toBe(false);
      expect(status.equals(' active ')).toBe(false);
    });

    it('should return false for invalid status strings', () => {
      const status = ProjectStatus.create('active');

      expect(status.equals('invalid')).toBe(false);
      expect(status.equals('activ')).toBe(false);
      expect(status.equals('activee')).toBe(false);
    });
  });

  describe('value getter', () => {
    it('should return the original value', () => {
      validStatuses.forEach((statusValue) => {
        const status = ProjectStatus.create(statusValue);
        expect(status.value).toBe(statusValue);
      });
    });

    it('should be immutable', () => {
      const status = ProjectStatus.create('active');

      // Attempting to modify the returned value shouldn't affect the original
      expect(() => {
        (status as any).value = 'modified';
      }).toThrow();
    });

    it('should return consistent value across multiple calls', () => {
      const status = ProjectStatus.create('completed');

      expect(status.value).toBe('completed');
      expect(status.value).toBe('completed');
      expect(status.value).toBe('completed');
    });
  });

  describe('status transitions and business logic', () => {
    it('should create all valid workflow statuses', () => {
      const draft = ProjectStatus.draft();
      const active = ProjectStatus.active();
      const completed = ProjectStatus.completed();
      const archived = ProjectStatus.archived();

      expect([
        draft.value,
        active.value,
        completed.value,
        archived.value,
      ]).toEqual(['draft', 'active', 'completed', 'archived']);
    });

    it('should maintain status integrity', () => {
      const status1 = ProjectStatus.create('draft');
      const status2 = ProjectStatus.draft();

      expect(status1.value).toBe(status2.value);
      expect(status1.equals(status2.value)).toBe(true);
    });

    it('should handle status comparison scenarios', () => {
      const activeStatus = ProjectStatus.active();
      const completedStatus = ProjectStatus.completed();

      expect(activeStatus.equals('active')).toBe(true);
      expect(activeStatus.equals('completed')).toBe(false);
      expect(completedStatus.equals('completed')).toBe(true);
      expect(completedStatus.equals('active')).toBe(false);
    });
  });

  describe('comprehensive invalid input testing', () => {
    const invalidInputs = [
      'pending',
      'started',
      'finished',
      'deleted',
      'suspended',
      'in-progress',
      'in_progress',
      'not-started',
      'cancelled',
      'Draft',
      'Active',
      'Completed',
      'Archived',
      'DRAFT',
      'ACTIVE',
      'COMPLETED',
      'ARCHIVED',
      ' draft',
      'active ',
      ' completed ',
      '\tdraft',
      'draft\n',
      'active\r',
      'completed\t',
      '1',
      '0',
      'true',
      'false',
      'null',
      'undefined',
      '!@#$%',
      '....',
      '----',
      '____',
      'активный',
      '有效的',
      'アクティブ',
      'نشط',
      '🟢',
      '✅',
      '📝',
      '⭐',
      '🚀',
    ];

    it.each(invalidInputs)(
      'should reject invalid input: "%s"',
      (invalidInput) => {
        expect(() => ProjectStatus.create(invalidInput)).toThrow(
          ProjectValidationError,
        );
        expect(() => ProjectStatus.create(invalidInput)).toThrow(
          'Invalid project status',
        );
      },
    );
  });

  describe('type safety and edge cases', () => {
    it('should handle non-string types gracefully', () => {
      expect(() => ProjectStatus.create(123 as any)).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create(true as any)).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create({} as any)).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectStatus.create([] as any)).toThrow(
        ProjectValidationError,
      );
    });

    it('should maintain type consistency', () => {
      const status = ProjectStatus.active();

      expect(typeof status.value).toBe('string');
      expect(status.value).toBe('active');
    });
  });
});
