import { ProjectId } from '../project-id';

describe('ProjectId', () => {
  describe('generate', () => {
    it('should generate a valid project ID without input', () => {
      const projectId = ProjectId.generate();

      expect(projectId).toBeInstanceOf(ProjectId);
      expect(projectId.value).toBeDefined();
      expect(typeof projectId.value).toBe('string');
      expect(projectId.value.length).toBeGreaterThan(0);
    });

    it('should generate a valid project ID with provided ID', () => {
      const customId = 'custom-project-id-123';
      const projectId = ProjectId.generate(customId);

      expect(projectId).toBeInstanceOf(ProjectId);
      expect(projectId.value).toBe(customId);
    });

    it('should generate UUID when no ID provided', () => {
      const projectId = ProjectId.generate();

      // UUID v4 pattern: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(projectId.value).toMatch(uuidPattern);
    });

    it('should generate different IDs on subsequent calls', () => {
      const id1 = ProjectId.generate();
      const id2 = ProjectId.generate();

      expect(id1.value).not.toBe(id2.value);
    });

    it('should generate UUID when empty string provided', () => {
      const projectId = ProjectId.generate('');

      // Empty string is falsy, so UUID should be generated
      expect(projectId.value).toBeDefined();
      expect(projectId.value.length).toBeGreaterThan(0);
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(projectId.value).toMatch(uuidPattern);
    });

    it('should accept null as ID and generate UUID', () => {
      const projectId = ProjectId.generate(null as any);

      expect(projectId.value).toBeDefined();
      expect(projectId.value.length).toBeGreaterThan(0);
      // Should generate UUID when null is passed
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(projectId.value).toMatch(uuidPattern);
    });

    it('should accept undefined as ID and generate UUID', () => {
      const projectId = ProjectId.generate(undefined);

      expect(projectId.value).toBeDefined();
      expect(projectId.value.length).toBeGreaterThan(0);
      // Should generate UUID when undefined is passed
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(projectId.value).toMatch(uuidPattern);
    });
  });

  describe('custom ID scenarios', () => {
    it('should accept numeric string as ID', () => {
      const numericId = '12345';
      const projectId = ProjectId.generate(numericId);

      expect(projectId.value).toBe(numericId);
    });

    it('should accept UUID string as ID', () => {
      const uuidId = '123e4567-e89b-12d3-a456-426614174000';
      const projectId = ProjectId.generate(uuidId);

      expect(projectId.value).toBe(uuidId);
    });

    it('should accept alphanumeric ID', () => {
      const alphanumericId = 'proj123abc';
      const projectId = ProjectId.generate(alphanumericId);

      expect(projectId.value).toBe(alphanumericId);
    });

    it('should accept ID with special characters', () => {
      const specialId = 'proj-123_abc.def';
      const projectId = ProjectId.generate(specialId);

      expect(projectId.value).toBe(specialId);
    });

    it('should accept very long ID', () => {
      const longId = 'a'.repeat(1000);
      const projectId = ProjectId.generate(longId);

      expect(projectId.value).toBe(longId);
    });

    it('should accept unicode characters in ID', () => {
      const unicodeId = 'проект-123-测试';
      const projectId = ProjectId.generate(unicodeId);

      expect(projectId.value).toBe(unicodeId);
    });

    it('should accept emoji in ID', () => {
      const emojiId = 'project-🚀-123';
      const projectId = ProjectId.generate(emojiId);

      expect(projectId.value).toBe(emojiId);
    });

    it('should accept whitespace in ID', () => {
      const whitespaceId = 'project id with spaces';
      const projectId = ProjectId.generate(whitespaceId);

      expect(projectId.value).toBe(whitespaceId);
    });

    it('should accept ID with newlines', () => {
      const multilineId = 'line1\nline2\nline3';
      const projectId = ProjectId.generate(multilineId);

      expect(projectId.value).toBe(multilineId);
    });
  });

  describe('value getter', () => {
    it('should return the original value for custom ID', () => {
      const originalId = 'custom-id-12345';
      const projectId = ProjectId.generate(originalId);

      expect(projectId.value).toBe(originalId);
    });

    it('should return generated UUID value', () => {
      const projectId = ProjectId.generate();
      const value = projectId.value;

      expect(value).toBeDefined();
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });

    it('should be immutable', () => {
      const projectId = ProjectId.generate('immutable-id');

      // Attempting to modify the returned value shouldn't affect the original
      expect(() => {
        (projectId as any).value = 'modified';
      }).toThrow();
    });

    it('should return consistent value across multiple calls', () => {
      const projectId = ProjectId.generate('consistent-id');

      expect(projectId.value).toBe('consistent-id');
      expect(projectId.value).toBe('consistent-id');
      expect(projectId.value).toBe('consistent-id');
    });
  });

  describe('UUID generation quality', () => {
    it('should generate valid UUID v4 format', () => {
      const projectId = ProjectId.generate();
      const uuid = projectId.value;

      // Check UUID v4 format
      expect(uuid).toHaveLength(36);
      expect(uuid.charAt(8)).toBe('-');
      expect(uuid.charAt(13)).toBe('-');
      expect(uuid.charAt(18)).toBe('-');
      expect(uuid.charAt(23)).toBe('-');
      expect(uuid.charAt(14)).toBe('4'); // Version 4
      expect(['8', '9', 'a', 'b']).toContain(uuid.charAt(19)); // Variant
    });

    it('should generate cryptographically random UUIDs', () => {
      const ids = new Set();
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const projectId = ProjectId.generate();
        ids.add(projectId.value);
      }

      // All generated IDs should be unique
      expect(ids.size).toBe(iterations);
    });

    it('should generate UUIDs with proper entropy', () => {
      const projectId1 = ProjectId.generate();
      const projectId2 = ProjectId.generate();

      // UUIDs should be different
      expect(projectId1.value).not.toBe(projectId2.value);

      // UUIDs should not have obvious patterns
      const uuid1 = projectId1.value;
      const uuid2 = projectId2.value;

      expect(uuid1.slice(0, 8)).not.toBe(uuid2.slice(0, 8));
    });
  });

  describe('inheritance from GenId', () => {
    it('should inherit GenId functionality', () => {
      const projectId = ProjectId.generate();

      // Should have value property from GenId
      expect(projectId.value).toBeDefined();
      expect(typeof projectId.value).toBe('string');
    });

    it('should maintain type identity', () => {
      const projectId = ProjectId.generate();

      expect(projectId).toBeInstanceOf(ProjectId);
    });

    it('should use GenId constructor behavior', () => {
      const customId = 'test-id';
      const projectId = ProjectId.generate(customId);

      expect(projectId.value).toBe(customId);
    });
  });

  describe('edge cases and error scenarios', () => {
    it('should handle falsy string values correctly', () => {
      const zeroId = ProjectId.generate('0');
      expect(zeroId.value).toBe('0');

      const falseId = ProjectId.generate('false');
      expect(falseId.value).toBe('false');

      // Empty string generates UUID since it's falsy
      const emptyId = ProjectId.generate('');
      expect(emptyId.value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it('should handle very short IDs', () => {
      const shortId = ProjectId.generate('a');
      expect(shortId.value).toBe('a');
    });

    it('should handle IDs with only special characters', () => {
      const specialId = ProjectId.generate('!@#$%^&*()');
      expect(specialId.value).toBe('!@#$%^&*()');
    });

    it('should handle IDs with control characters', () => {
      const controlId = ProjectId.generate('id\t\n\r');
      expect(controlId.value).toBe('id\t\n\r');
    });

    it('should handle mixed content IDs', () => {
      const mixedId = 'abc123!@#\nюникод🚀';
      const projectId = ProjectId.generate(mixedId);
      expect(projectId.value).toBe(mixedId);
    });
  });

  describe('performance and reliability', () => {
    it('should generate IDs quickly', () => {
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        ProjectId.generate();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should generate 100 IDs in reasonable time (less than 100ms)
      expect(duration).toBeLessThan(100);
    });

    it('should maintain consistency across rapid generation', () => {
      const ids = [];

      for (let i = 0; i < 10; i++) {
        ids.push(ProjectId.generate().value);
      }

      // All IDs should be unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
