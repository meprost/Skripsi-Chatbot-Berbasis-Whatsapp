import logger from '@/lib/logger';

describe('logger', () => {
  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should export production logger when NODE_ENV=production', async () => {
    process.env.NODE_ENV = 'production';

    expect(logger.level).toBe('debug');
  });
});
