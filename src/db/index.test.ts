import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Database Connection', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    // Clear module cache to allow re-import with different env vars
    vi.resetModules();
  });

  it('should throw an error if DATABASE_URL is not defined', async () => {
    // Remove DATABASE_URL from environment
    delete process.env.DATABASE_URL;

    // Dynamically import the module to trigger the error
    await expect(async () => {
      await import('./index.js?t=' + Date.now());
    }).rejects.toThrow('DATABASE_URL is not defined');
  });

  it('should throw an error if DATABASE_URL is an empty string', async () => {
    process.env.DATABASE_URL = '';

    await expect(async () => {
      await import('./index.js?t=' + Date.now());
    }).rejects.toThrow('DATABASE_URL is not defined');
  });

  it('should successfully initialize database connection with valid DATABASE_URL', async () => {
    process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/testdb';

    const dbModule = await import('./index.js?t=' + Date.now());
    expect(dbModule.db).toBeDefined();
    expect(typeof dbModule.db).toBe('object');
  });

  it('should export db object with Drizzle methods', async () => {
    process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/testdb';

    const { db } = await import('./index.js?t=' + Date.now());

    // Check that db has typical Drizzle ORM methods
    expect(db).toHaveProperty('select');
    expect(db).toHaveProperty('insert');
    expect(db).toHaveProperty('update');
    expect(db).toHaveProperty('delete');
  });
});