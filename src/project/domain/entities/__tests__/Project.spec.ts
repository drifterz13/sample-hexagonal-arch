import { ProjectValidationError } from '../../errors';
import { Project } from '../Project';

describe('Project Entity', () => {
  const validProjectData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Project',
    description: 'Test project description',
    status: 'active',
  };

  describe('create', () => {
    it('should create a valid project', () => {
      const project = Project.create(
        validProjectData.id,
        validProjectData.title,
        validProjectData.description,
        validProjectData.status,
      );

      expect(project).toBeInstanceOf(Project);
      expect(project.id).toBe(validProjectData.id);
      expect(project.title).toBe(validProjectData.title);
      expect(project.description).toBe(validProjectData.description);
      expect(project.status).toBe(validProjectData.status);
    });

    it('should create project with generated ID when no ID provided', () => {
      const project = Project.create(
        '',
        validProjectData.title,
        validProjectData.description,
        validProjectData.status,
      );

      expect(project.id).toBeDefined();
      expect(project.id.length).toBeGreaterThan(0);
    });

    it('should create project with minimal valid data', () => {
      const project = Project.create('id', 'T', '', 'draft');

      expect(project.id).toBe('id');
      expect(project.title).toBe('T');
      expect(project.description).toBe('');
      expect(project.status).toBe('draft');
    });

    it('should create project with maximum length data', () => {
      const maxTitle = 'A'.repeat(50);
      const maxDescription = 'B'.repeat(250);

      const project = Project.create(
        'long-id',
        maxTitle,
        maxDescription,
        'completed',
      );

      expect(project.title).toBe(maxTitle);
      expect(project.description).toBe(maxDescription);
    });

    it('should create project with all valid statuses', () => {
      const statuses = ['draft', 'active', 'completed', 'archived'];

      statuses.forEach((status) => {
        const project = Project.create('id', 'Title', 'Description', status);
        expect(project.status).toBe(status);
      });
    });

    it('should create project with unicode characters', () => {
      const unicodeTitle = 'Проект 测试 🚀';
      const unicodeDescription = 'Описание проекта 项目描述';

      const project = Project.create(
        'unicode-id',
        unicodeTitle,
        unicodeDescription,
        'active',
      );

      expect(project.title).toBe(unicodeTitle);
      expect(project.description).toBe(unicodeDescription);
    });
  });

  describe('validation during creation', () => {
    it('should throw error for invalid title', () => {
      expect(() => Project.create('id', '', 'desc', 'active')).toThrow(
        ProjectValidationError,
      );
      expect(() =>
        Project.create('id', 'A'.repeat(51), 'desc', 'active'),
      ).toThrow(ProjectValidationError);
    });

    it('should throw error for invalid description', () => {
      const longDescription = 'A'.repeat(251);
      expect(() =>
        Project.create('id', 'title', longDescription, 'active'),
      ).toThrow(ProjectValidationError);
    });

    it('should throw error for invalid status', () => {
      expect(() => Project.create('id', 'title', 'desc', 'invalid')).toThrow(
        ProjectValidationError,
      );
      expect(() => Project.create('id', 'title', 'desc', 'ACTIVE')).toThrow(
        ProjectValidationError,
      );
      expect(() => Project.create('id', 'title', 'desc', '')).toThrow(
        ProjectValidationError,
      );
    });

    it('should throw specific validation errors', () => {
      expect(() => Project.create('id', '', 'desc', 'active')).toThrow(
        'Title must be between 1 and 50 characters.',
      );

      expect(() =>
        Project.create('id', 'title', 'A'.repeat(251), 'active'),
      ).toThrow('Description must be up to 250 characters.');

      expect(() => Project.create('id', 'title', 'desc', 'invalid')).toThrow(
        'Invalid project status',
      );
    });
  });

  describe('updateTitle', () => {
    it('should update title with valid value', () => {
      const project = Project.create('id', 'Original Title', 'desc', 'active');

      project.updateTitle('Updated Title');

      expect(project.title).toBe('Updated Title');
    });

    it('should update title to minimum length', () => {
      const project = Project.create('id', 'Original Title', 'desc', 'active');

      project.updateTitle('A');

      expect(project.title).toBe('A');
    });

    it('should update title to maximum length', () => {
      const project = Project.create('id', 'Original Title', 'desc', 'active');
      const maxTitle = 'B'.repeat(50);

      project.updateTitle(maxTitle);

      expect(project.title).toBe(maxTitle);
    });

    it('should throw error for invalid title update', () => {
      const project = Project.create('id', 'Original Title', 'desc', 'active');

      expect(() => project.updateTitle('')).toThrow(ProjectValidationError);
      expect(() => project.updateTitle('A'.repeat(51))).toThrow(
        ProjectValidationError,
      );
    });

    it('should maintain other properties when updating title', () => {
      const project = Project.create(
        'id',
        'Original Title',
        'Original Description',
        'active',
      );

      project.updateTitle('New Title');

      expect(project.id).toBe('id');
      expect(project.description).toBe('Original Description');
      expect(project.status).toBe('active');
    });

    it('should handle unicode characters in title update', () => {
      const project = Project.create('id', 'Original Title', 'desc', 'active');
      const unicodeTitle = 'Новый заголовок 🎯';

      project.updateTitle(unicodeTitle);

      expect(project.title).toBe(unicodeTitle);
    });
  });

  describe('updateDescription', () => {
    it('should update description with valid value', () => {
      const project = Project.create(
        'id',
        'title',
        'Original Description',
        'active',
      );

      project.updateDescription('Updated Description');

      expect(project.description).toBe('Updated Description');
    });

    it('should update description to empty string', () => {
      const project = Project.create(
        'id',
        'title',
        'Original Description',
        'active',
      );

      project.updateDescription('');

      expect(project.description).toBe('');
    });

    it('should update description to maximum length', () => {
      const project = Project.create(
        'id',
        'title',
        'Original Description',
        'active',
      );
      const maxDescription = 'C'.repeat(250);

      project.updateDescription(maxDescription);

      expect(project.description).toBe(maxDescription);
    });

    it('should throw error for invalid description update', () => {
      const project = Project.create(
        'id',
        'title',
        'Original Description',
        'active',
      );
      const tooLongDescription = 'A'.repeat(251);

      expect(() => project.updateDescription(tooLongDescription)).toThrow(
        ProjectValidationError,
      );
    });

    it('should maintain other properties when updating description', () => {
      const project = Project.create(
        'id',
        'Original Title',
        'Original Description',
        'active',
      );

      project.updateDescription('New Description');

      expect(project.id).toBe('id');
      expect(project.title).toBe('Original Title');
      expect(project.status).toBe('active');
    });

    it('should handle multiline descriptions', () => {
      const project = Project.create(
        'id',
        'title',
        'Original Description',
        'active',
      );
      const multilineDescription = 'Line 1\nLine 2\nLine 3';

      project.updateDescription(multilineDescription);

      expect(project.description).toBe(multilineDescription);
    });

    it('should handle special characters in description', () => {
      const project = Project.create(
        'id',
        'title',
        'Original Description',
        'active',
      );
      const specialDescription =
        'Description with @#$%^&*()_+-={}[]|\\:";\'<>?,./ characters';

      project.updateDescription(specialDescription);

      expect(project.description).toBe(specialDescription);
    });
  });

  describe('updateStatus', () => {
    it('should update status with valid value', () => {
      const project = Project.create('id', 'title', 'desc', 'draft');

      project.updateStatus('active');

      expect(project.status).toBe('active');
    });

    it('should update status through all valid transitions', () => {
      const project = Project.create('id', 'title', 'desc', 'draft');

      project.updateStatus('active');
      expect(project.status).toBe('active');

      project.updateStatus('completed');
      expect(project.status).toBe('completed');

      project.updateStatus('archived');
      expect(project.status).toBe('archived');

      project.updateStatus('draft');
      expect(project.status).toBe('draft');
    });

    it('should throw error for invalid status update', () => {
      const project = Project.create('id', 'title', 'desc', 'active');

      expect(() => project.updateStatus('invalid')).toThrow(
        ProjectValidationError,
      );
      expect(() => project.updateStatus('ACTIVE')).toThrow(
        ProjectValidationError,
      );
      expect(() => project.updateStatus('')).toThrow(ProjectValidationError);
      expect(() => project.updateStatus('pending')).toThrow(
        ProjectValidationError,
      );
    });

    it('should maintain other properties when updating status', () => {
      const project = Project.create(
        'id',
        'Original Title',
        'Original Description',
        'draft',
      );

      project.updateStatus('completed');

      expect(project.id).toBe('id');
      expect(project.title).toBe('Original Title');
      expect(project.description).toBe('Original Description');
    });

    it('should allow status to remain the same', () => {
      const project = Project.create('id', 'title', 'desc', 'active');

      project.updateStatus('active');

      expect(project.status).toBe('active');
    });
  });

  describe('property getters', () => {
    it('should return immutable property values', () => {
      const project = Project.create(
        'test-id',
        'Test Title',
        'Test Description',
        'active',
      );

      expect(project.id).toBe('test-id');
      expect(project.title).toBe('Test Title');
      expect(project.description).toBe('Test Description');
      expect(project.status).toBe('active');
    });

    it('should maintain property values across multiple accesses', () => {
      const project = Project.create(
        'consistent-id',
        'Consistent Title',
        'Consistent Description',
        'draft',
      );

      expect(project.id).toBe('consistent-id');
      expect(project.id).toBe('consistent-id');

      expect(project.title).toBe('Consistent Title');
      expect(project.title).toBe('Consistent Title');

      expect(project.description).toBe('Consistent Description');
      expect(project.description).toBe('Consistent Description');

      expect(project.status).toBe('draft');
      expect(project.status).toBe('draft');
    });

    it('should prevent direct property modification', () => {
      const project = Project.create('id', 'title', 'desc', 'active');

      // Properties should be read-only
      expect(() => {
        (project as any).id = 'modified-id';
      }).toThrow();

      expect(() => {
        (project as any).title = 'modified-title';
      }).toThrow();

      expect(() => {
        (project as any).description = 'modified-description';
      }).toThrow();

      expect(() => {
        (project as any).status = 'modified-status';
      }).toThrow();
    });
  });

  describe('complex scenarios and edge cases', () => {
    it('should handle multiple sequential updates', () => {
      const project = Project.create(
        'id',
        'Initial Title',
        'Initial Description',
        'draft',
      );

      project.updateTitle('Updated Title 1');
      project.updateDescription('Updated Description 1');
      project.updateStatus('active');

      project.updateTitle('Updated Title 2');
      project.updateDescription('Updated Description 2');
      project.updateStatus('completed');

      expect(project.title).toBe('Updated Title 2');
      expect(project.description).toBe('Updated Description 2');
      expect(project.status).toBe('completed');
    });

    it('should maintain data integrity after failed updates', () => {
      const project = Project.create(
        'id',
        'Valid Title',
        'Valid Description',
        'active',
      );

      const originalTitle = project.title;
      const originalDescription = project.description;
      const originalStatus = project.status;

      // Try invalid updates
      expect(() => project.updateTitle('')).toThrow();
      expect(() => project.updateDescription('A'.repeat(251))).toThrow();
      expect(() => project.updateStatus('invalid')).toThrow();

      // Original values should be preserved
      expect(project.title).toBe(originalTitle);
      expect(project.description).toBe(originalDescription);
      expect(project.status).toBe(originalStatus);
    });

    it('should handle boundary value updates', () => {
      const project = Project.create('id', 'Initial', 'Initial', 'draft');

      // Update to boundary values
      project.updateTitle('A');
      project.updateDescription('');
      project.updateStatus('archived');

      expect(project.title).toBe('A');
      expect(project.description).toBe('');
      expect(project.status).toBe('archived');

      // Update to other boundary values
      project.updateTitle('B'.repeat(50));
      project.updateDescription('C'.repeat(250));
      project.updateStatus('completed');

      expect(project.title).toBe('B'.repeat(50));
      expect(project.description).toBe('C'.repeat(250));
      expect(project.status).toBe('completed');
    });

    it('should create projects with complex real-world data', () => {
      const complexProject = Project.create(
        'proj-2024-web-app-v2',
        'E-commerce Platform Redesign 🛒',
        'A complete redesign of our e-commerce platform using modern technologies.\n\nFeatures:\n- React 18 with TypeScript\n- Next.js for SSR\n- Stripe payment integration\n- Real-time notifications\n\nTimeline: Q2 2024',
        'active',
      );

      expect(complexProject.id).toBe('proj-2024-web-app-v2');
      expect(complexProject.title).toContain('🛒');
      expect(complexProject.description).toContain('React 18');
      expect(complexProject.description).toContain('\n');
      expect(complexProject.status).toBe('active');
    });

    it('should handle stress testing with rapid updates', () => {
      const project = Project.create(
        'stress-test',
        'Initial',
        'Initial',
        'draft',
      );

      for (let i = 0; i < 100; i++) {
        project.updateTitle(`Title ${i}`);
        project.updateDescription(`Description ${i}`);
        const statuses = ['draft', 'active', 'completed', 'archived'];
        project.updateStatus(statuses[i % statuses.length]);
      }

      expect(project.title).toBe('Title 99');
      expect(project.description).toBe('Description 99');
      expect(project.status).toBe('archived'); // 99 % 4 = 3, statuses[3] = 'archived'
    });
  });

  describe('type safety and invariants', () => {
    it('should maintain type consistency', () => {
      const project = Project.create('id', 'title', 'description', 'active');

      expect(typeof project.id).toBe('string');
      expect(typeof project.title).toBe('string');
      expect(typeof project.description).toBe('string');
      expect(typeof project.status).toBe('string');
    });

    it('should maintain object identity', () => {
      const project = Project.create('id', 'title', 'description', 'active');

      expect(project).toBeInstanceOf(Project);

      // After updates, should still be the same instance
      project.updateTitle('new title');
      expect(project).toBeInstanceOf(Project);
    });

    it('should handle constructor privacy', () => {
      // Constructor should be private, only accessible through create method
      expect(() => {
        new (Project as any)('id', 'title', 'description', 'status');
      }).toThrow();
    });
  });
});
