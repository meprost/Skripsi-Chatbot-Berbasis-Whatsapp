import env from '@/lib/env';

describe('env', () => {
  it('should contain all defined env', () => {
    const expectedKey = [
      'ADMIN_PHONE_NUMBER',
      'PAYMENT_API_URL',
      'PAYMENT_API_KEY',
      'NODE_ENV',
    ];

    expectedKey.map((key) => {
      expect(env).toHaveProperty(key);
    });
  });
});
