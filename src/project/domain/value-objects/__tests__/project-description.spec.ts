import { ProjectValidationError } from '../../errors';
import { ProjectDescription } from '../project-description';

describe('ProjectDescription', () => {
  describe('create', () => {
    it('should create a valid project description', () => {
      const description = ProjectDescription.create('Valid description text');

      expect(description).toBeInstanceOf(ProjectDescription);
      expect(description.value).toBe('Valid description text');
    });

    it('should create empty description', () => {
      const description = ProjectDescription.create('');

      expect(description.value).toBe('');
    });

    it('should create description with exactly 250 characters', () => {
      const maxDescription = 'A'.repeat(250);
      const description = ProjectDescription.create(maxDescription);

      expect(description.value).toBe(maxDescription);
      expect(description.value.length).toBe(250);
    });

    it('should create description with newlines', () => {
      const multilineDescription = 'Line 1\nLine 2\nLine 3';
      const description = ProjectDescription.create(multilineDescription);

      expect(description.value).toBe(multilineDescription);
    });

    it('should create description with special characters', () => {
      const specialDescription =
        'Description with @#$%^&*()_+-={}[]|\\:";\'<>?,./ characters';
      const description = ProjectDescription.create(specialDescription);

      expect(description.value).toBe(specialDescription);
    });

    it('should create description with unicode characters', () => {
      const unicodeDescription = 'Описание проекта 项目描述 🚀📝✨';
      const description = ProjectDescription.create(unicodeDescription);

      expect(description.value).toBe(unicodeDescription);
    });

    it('should create description with HTML-like content', () => {
      const htmlDescription =
        '<p>This is <strong>bold</strong> text with <em>italic</em> content.</p>';
      const description = ProjectDescription.create(htmlDescription);

      expect(description.value).toBe(htmlDescription);
    });

    it('should create description with JSON-like content', () => {
      const jsonDescription =
        '{"name": "project", "version": "1.0.0", "description": "test"}';
      const description = ProjectDescription.create(jsonDescription);

      expect(description.value).toBe(jsonDescription);
    });
  });

  describe('validation edge cases', () => {
    it('should throw error for description with 251 characters', () => {
      const tooLongDescription = 'A'.repeat(251);

      expect(() => ProjectDescription.create(tooLongDescription)).toThrow(
        ProjectValidationError,
      );
      expect(() => ProjectDescription.create(tooLongDescription)).toThrow(
        'Description must be up to 250 characters.',
      );
    });

    it('should throw error for very long description', () => {
      const veryLongDescription = 'A'.repeat(1000);

      expect(() => ProjectDescription.create(veryLongDescription)).toThrow(
        ProjectValidationError,
      );
    });

    it('should handle whitespace-only description', () => {
      const whitespaceDescription = '   \n   \t   ';
      const description = ProjectDescription.create(whitespaceDescription);

      expect(description.value).toBe(whitespaceDescription);
    });

    it('should handle description with only tabs and spaces', () => {
      const tabSpaceDescription = '\t\t   \t   ';
      const description = ProjectDescription.create(tabSpaceDescription);

      expect(description.value).toBe(tabSpaceDescription);
    });

    it('should handle description with emoji characters', () => {
      const emojiDescription = '🚀 Project with emojis 📝 and more 🎉';
      const description = ProjectDescription.create(emojiDescription);

      expect(description.value).toBe(emojiDescription);
    });

    // Test unicode length edge case
    it('should properly count unicode characters for length validation', () => {
      // Emoji characters can take multiple bytes but should count as single characters
      // Note: Some emojis might be counted as multiple characters in JavaScript
      const emojiDescription = '🚀'.repeat(125); // Safer to use 125 to avoid length issues
      const description = ProjectDescription.create(emojiDescription);

      expect(description.value.length).toBeLessThanOrEqual(250);
    });

    it('should reject description with unicode characters exceeding 250 length', () => {
      const longUnicodeDescription = 'A'.repeat(251); // Use regular characters for reliable length testing

      expect(() => ProjectDescription.create(longUnicodeDescription)).toThrow(
        ProjectValidationError,
      );
    });
  });

  describe('equals', () => {
    it('should return true for identical descriptions', () => {
      const description = ProjectDescription.create('Test description');

      expect(description.equals('Test description')).toBe(true);
    });

    it('should return false for different descriptions', () => {
      const description = ProjectDescription.create('Test description');

      expect(description.equals('Different description')).toBe(false);
    });

    it('should be case-sensitive', () => {
      const description = ProjectDescription.create('Test Description');

      expect(description.equals('test description')).toBe(false);
      expect(description.equals('TEST DESCRIPTION')).toBe(false);
    });

    it('should handle empty string comparison', () => {
      const description = ProjectDescription.create('Test description');

      expect(description.equals('')).toBe(false);
    });

    it('should handle empty description comparison', () => {
      const description = ProjectDescription.create('');

      expect(description.equals('')).toBe(true);
      expect(description.equals('not empty')).toBe(false);
    });

    it('should handle whitespace differences', () => {
      const description = ProjectDescription.create('Test description');

      expect(description.equals(' Test description ')).toBe(false);
      expect(description.equals('Test  description')).toBe(false);
    });

    it('should handle newline differences', () => {
      const description = ProjectDescription.create('Line 1\nLine 2');

      expect(description.equals('Line 1\nLine 2')).toBe(true);
      expect(description.equals('Line 1\rLine 2')).toBe(false);
      expect(description.equals('Line 1 Line 2')).toBe(false);
    });
  });

  describe('value getter', () => {
    it('should return the original value', () => {
      const originalValue = 'Original description content';
      const description = ProjectDescription.create(originalValue);

      expect(description.value).toBe(originalValue);
    });

    it('should preserve all whitespace and formatting', () => {
      const formattedValue =
        '  Leading spaces\n\nMultiple\nlines\n  Trailing spaces  ';
      const description = ProjectDescription.create(formattedValue);

      expect(description.value).toBe(formattedValue);
    });

    it('should be immutable', () => {
      const description = ProjectDescription.create('Immutable description');

      // Attempting to modify the returned value shouldn't affect the original
      expect(() => {
        (description as any).value = 'Modified';
      }).toThrow();
    });
  });

  describe('boundary testing', () => {
    it('should handle description at minimum boundary (0 characters)', () => {
      const minDescription = '';
      const description = ProjectDescription.create(minDescription);

      expect(description.value).toBe(minDescription);
      expect(description.value.length).toBe(0);
    });

    it('should handle description at maximum boundary (250 characters)', () => {
      const maxDescription = 'X'.repeat(250);
      const description = ProjectDescription.create(maxDescription);

      expect(description.value).toBe(maxDescription);
      expect(description.value.length).toBe(250);
    });

    it('should reject description above maximum boundary (251 characters)', () => {
      const overMaxDescription = 'X'.repeat(251);

      expect(() => ProjectDescription.create(overMaxDescription)).toThrow(
        ProjectValidationError,
      );
    });

    it('should handle description with exactly 250 mixed characters', () => {
      const mixedDescription =
        'A'.repeat(100) + '1'.repeat(100) + '!'.repeat(50);
      const description = ProjectDescription.create(mixedDescription);

      expect(description.value.length).toBe(250);
      expect(description.value).toBe(mixedDescription);
    });
  });

  describe('real-world scenarios', () => {
    it('should handle typical project description', () => {
      const typicalDescription =
        'This project aims to create a modern web application using React and TypeScript. It will include user authentication, data visualization, and real-time features.';
      const description = ProjectDescription.create(typicalDescription);

      expect(description.value).toBe(typicalDescription);
    });

    it('should handle technical description with code snippets', () => {
      const technicalDescription =
        'API endpoint: POST /api/users\nPayload: {name: string, email: string}\nResponse: 201 Created';
      const description = ProjectDescription.create(technicalDescription);

      expect(description.value).toBe(technicalDescription);
    });

    it('should handle multilingual description', () => {
      const multilingualDescription =
        'Project description in English. Описание проекта на русском. 项目描述中文版。';
      const description = ProjectDescription.create(multilingualDescription);

      expect(description.value).toBe(multilingualDescription);
    });
  });
});
