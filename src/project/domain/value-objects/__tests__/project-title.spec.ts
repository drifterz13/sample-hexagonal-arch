import { ProjectValidationError } from '../../errors';
import { ProjectTitle } from '../project-title';

describe('ProjectTitle', () => {
  describe('create', () => {
    it('should create a valid project title', () => {
      const title = ProjectTitle.create('Valid Title');

      expect(title).toBeInstanceOf(ProjectTitle);
      expect(title.value).toBe('Valid Title');
    });

    it('should create title with exactly 1 character', () => {
      const title = ProjectTitle.create('A');

      expect(title.value).toBe('A');
    });

    it('should create title with exactly 50 characters', () => {
      const longTitle = 'A'.repeat(50);
      const title = ProjectTitle.create(longTitle);

      expect(title.value).toBe(longTitle);
      expect(title.value.length).toBe(50);
    });

    it('should create title with special characters', () => {
      const specialTitle = 'Project #1 - @Home & Work [2024]';
      const title = ProjectTitle.create(specialTitle);

      expect(title.value).toBe(specialTitle);
    });

    it('should create title with numbers', () => {
      const numericTitle = 'Project 123';
      const title = ProjectTitle.create(numericTitle);

      expect(title.value).toBe(numericTitle);
    });

    it('should create title with mixed case', () => {
      const mixedCaseTitle = 'PrOjEcT TiTlE';
      const title = ProjectTitle.create(mixedCaseTitle);

      expect(title.value).toBe(mixedCaseTitle);
    });
  });

  describe('validation edge cases', () => {
    it('should throw error for empty string', () => {
      expect(() => ProjectTitle.create('')).toThrow(ProjectValidationError);
      expect(() => ProjectTitle.create('')).toThrow(
        'Title must be between 1 and 50 characters.',
      );
    });

    it('should throw error for title with 51 characters', () => {
      const tooLongTitle = 'A'.repeat(51);

      expect(() => ProjectTitle.create(tooLongTitle)).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectTitle.create(tooLongTitle)).toThrow(
        'Title must be between 1 and 50 characters.',
      );
    });

    it('should throw error for very long title', () => {
      const veryLongTitle = 'A'.repeat(1000);

      expect(() => ProjectTitle.create(veryLongTitle)).toThrow(
        ProjectValidationError,
      );
    });

    it('should handle whitespace-only string', () => {
      const whitespaceTitle = '   ';
      const title = ProjectTitle.create(whitespaceTitle);

      expect(title.value).toBe('   ');
    });

    it('should handle title with leading/trailing spaces', () => {
      const spacedTitle = ' Valid Title ';
      const title = ProjectTitle.create(spacedTitle);

      expect(title.value).toBe(' Valid Title ');
    });

    it('should handle unicode characters', () => {
      const unicodeTitle = 'Проект 测试 🚀';
      const title = ProjectTitle.create(unicodeTitle);

      expect(title.value).toBe(unicodeTitle);
    });
  });

  describe('equals', () => {
    it('should return true for identical titles', () => {
      const title = ProjectTitle.create('Test Title');

      expect(title.equals('Test Title')).toBe(true);
    });

    it('should return false for different titles', () => {
      const title = ProjectTitle.create('Test Title');

      expect(title.equals('Different Title')).toBe(false);
    });

    it('should be case-sensitive', () => {
      const title = ProjectTitle.create('Test Title');

      expect(title.equals('test title')).toBe(false);
      expect(title.equals('TEST TITLE')).toBe(false);
    });

    it('should handle empty string comparison', () => {
      const title = ProjectTitle.create('Test Title');

      expect(title.equals('')).toBe(false);
    });

    it('should handle whitespace differences', () => {
      const title = ProjectTitle.create('Test Title');

      expect(title.equals(' Test Title ')).toBe(false);
      expect(title.equals('Test  Title')).toBe(false);
    });
  });

  describe('value getter', () => {
    it('should return the original value', () => {
      const originalValue = 'Original Title';
      const title = ProjectTitle.create(originalValue);

      expect(title.value).toBe(originalValue);
    });

    it('should be immutable', () => {
      const title = ProjectTitle.create('Immutable Title');
      const value = title.value;

      // Attempting to modify the returned value shouldn't affect the original
      expect(() => {
        (title as any).value = 'Modified';
      }).toThrow();
    });
  });

  describe('boundary testing', () => {
    it('should handle title at minimum boundary (1 character)', () => {
      const minTitle = 'X';
      const title = ProjectTitle.create(minTitle);

      expect(title.value).toBe(minTitle);
      expect(title.value.length).toBe(1);
    });

    it('should handle title at maximum boundary (50 characters)', () => {
      const maxTitle = 'X'.repeat(50);
      const title = ProjectTitle.create(maxTitle);

      expect(title.value).toBe(maxTitle);
      expect(title.value.length).toBe(50);
    });

    it('should reject title below minimum boundary (0 characters)', () => {
      expect(() => ProjectTitle.create('')).toThrow(ProjectValidationError);
    });

    it('should reject title above maximum boundary (51 characters)', () => {
      const overMaxTitle = 'X'.repeat(51);

      expect(() => ProjectTitle.create(overMaxTitle)).toThrow(
        ProjectValidationError,
      );
    });
  });
});
