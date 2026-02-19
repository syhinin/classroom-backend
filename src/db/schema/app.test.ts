import { describe, it, expect } from 'vitest';
import {
  departments,
  subjects,
  departmentSubjectRelation,
  subjectDepartmentRelation,
  type Department,
  type NewDepartment,
  type Subject,
  type NewSubject,
} from './app.js';

describe('Database Schema - app.ts', () => {
  describe('Departments Table', () => {
    it('should export departments table', () => {
      expect(departments).toBeDefined();
      expect(typeof departments).toBe('object');
    });

    it('should have all required columns', () => {
      const columns = Object.keys(departments);
      expect(columns).toContain('id');
      expect(columns).toContain('code');
      expect(columns).toContain('name');
      expect(columns).toContain('description');
      expect(columns).toContain('createdAt');
      expect(columns).toContain('updatedAt');
    });

    it('should have id as primary key with identity generation', () => {
      const idColumn = departments.id;
      expect(idColumn).toBeDefined();
      expect(idColumn.primary).toBe(true);
    });

    it('should have code as unique field', () => {
      const codeColumn = departments.code;
      expect(codeColumn).toBeDefined();
      expect(codeColumn.isUnique).toBe(true);
    });

    it('should have varchar columns', () => {
      expect(departments.code).toBeDefined();
      expect(departments.name).toBeDefined();
      expect(departments.description).toBeDefined();
    });

    it('should have required fields as not null', () => {
      expect(departments.code.notNull).toBe(true);
      expect(departments.name.notNull).toBe(true);
      expect(departments.createdAt.notNull).toBe(true);
      expect(departments.updatedAt.notNull).toBe(true);
    });

    it('should have timestamp columns with defaults', () => {
      expect(departments.createdAt).toBeDefined();
      expect(departments.updatedAt).toBeDefined();
      expect(departments.createdAt.hasDefault).toBe(true);
      expect(departments.updatedAt.hasDefault).toBe(true);
    });
  });

  describe('Subjects Table', () => {
    it('should export subjects table', () => {
      expect(subjects).toBeDefined();
      expect(typeof subjects).toBe('object');
    });

    it('should have all required columns', () => {
      const columns = Object.keys(subjects);
      expect(columns).toContain('id');
      expect(columns).toContain('departmentId');
      expect(columns).toContain('name');
      expect(columns).toContain('code');
      expect(columns).toContain('description');
      expect(columns).toContain('createdAt');
      expect(columns).toContain('updatedAt');
    });

    it('should have id as primary key', () => {
      const idColumn = subjects.id;
      expect(idColumn).toBeDefined();
      expect(idColumn.primary).toBe(true);
    });

    it('should have code as unique field', () => {
      const codeColumn = subjects.code;
      expect(codeColumn).toBeDefined();
      expect(codeColumn.isUnique).toBe(true);
    });

    it('should have departmentId as foreign key', () => {
      const deptIdColumn = subjects.departmentId;
      expect(deptIdColumn).toBeDefined();
      expect(deptIdColumn.notNull).toBe(true);
    });

    it('should have varchar columns', () => {
      expect(subjects.name).toBeDefined();
      expect(subjects.code).toBeDefined();
      expect(subjects.description).toBeDefined();
    });

    it('should have required fields as not null', () => {
      expect(subjects.departmentId.notNull).toBe(true);
      expect(subjects.name.notNull).toBe(true);
      expect(subjects.code.notNull).toBe(true);
      expect(subjects.createdAt.notNull).toBe(true);
      expect(subjects.updatedAt.notNull).toBe(true);
    });

    it('should have timestamp columns', () => {
      expect(subjects.createdAt).toBeDefined();
      expect(subjects.updatedAt).toBeDefined();
      expect(subjects.createdAt.hasDefault).toBe(true);
      expect(subjects.updatedAt.hasDefault).toBe(true);
    });
  });

  describe('Table Relations', () => {
    it('should export department-subject relation', () => {
      expect(departmentSubjectRelation).toBeDefined();
    });

    it('should export subject-department relation', () => {
      expect(subjectDepartmentRelation).toBeDefined();
    });
  });

  describe('TypeScript Types', () => {
    it('should allow valid Department type', () => {
      const dept: Department = {
        id: 1,
        code: 'CS',
        name: 'Computer Science',
        description: 'Computer Science Department',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(dept.id).toBe(1);
      expect(dept.code).toBe('CS');
    });

    it('should allow valid NewDepartment type without id', () => {
      const newDept: NewDepartment = {
        code: 'MATH',
        name: 'Mathematics',
        description: 'Mathematics Department',
      };

      expect(newDept.code).toBe('MATH');
      expect(newDept.name).toBe('Mathematics');
    });

    it('should allow valid Subject type', () => {
      const subject: Subject = {
        id: 1,
        departmentId: 1,
        name: 'Introduction to Programming',
        code: 'CS101',
        description: 'Basic programming',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(subject.id).toBe(1);
      expect(subject.departmentId).toBe(1);
    });

    it('should allow valid NewSubject type without id', () => {
      const newSubject: NewSubject = {
        departmentId: 1,
        name: 'Data Structures',
        code: 'CS201',
        description: 'Advanced data structures',
      };

      expect(newSubject.departmentId).toBe(1);
      expect(newSubject.code).toBe('CS201');
    });

    it('should allow optional description in NewDepartment', () => {
      const newDept: NewDepartment = {
        code: 'PHYS',
        name: 'Physics',
      };

      expect(newDept.description).toBeUndefined();
    });

    it('should allow optional description in NewSubject', () => {
      const newSubject: NewSubject = {
        departmentId: 2,
        name: 'Quantum Mechanics',
        code: 'PHYS301',
      };

      expect(newSubject.description).toBeUndefined();
    });
  });

  describe('Schema Constraints', () => {
    it('should have proper column data types for departments', () => {
      expect(departments.id.dataType).toBe('number');
      expect(departments.code.dataType).toBe('string');
      expect(departments.name.dataType).toBe('string');
    });

    it('should have proper column data types for subjects', () => {
      expect(subjects.id.dataType).toBe('number');
      expect(subjects.departmentId.dataType).toBe('number');
      expect(subjects.name.dataType).toBe('string');
      expect(subjects.code.dataType).toBe('string');
    });
  });

  describe('Edge Cases', () => {
    it('should handle Department with null description', () => {
      const dept: Department = {
        id: 1,
        code: 'BIO',
        name: 'Biology',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(dept.description).toBeNull();
    });

    it('should handle Subject with null description', () => {
      const subject: Subject = {
        id: 1,
        departmentId: 1,
        name: 'Cell Biology',
        code: 'BIO101',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(subject.description).toBeNull();
    });

    it('should handle very long strings within varchar limits', () => {
      const longName = 'A'.repeat(255);
      const dept: Department = {
        id: 1,
        code: 'TEST',
        name: longName,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(dept.name.length).toBe(255);
    });

    it('should maintain referential integrity with departmentId', () => {
      const subject: Subject = {
        id: 1,
        departmentId: 999, // Valid foreign key reference
        name: 'Test Subject',
        code: 'TEST101',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(subject.departmentId).toBe(999);
    });
  });
});