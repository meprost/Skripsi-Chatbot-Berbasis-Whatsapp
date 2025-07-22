import { commandParser } from '@/apps/commands/utils';

describe('commandParser', () => {
  const params = '/buy BETOL';

  it('should return a correct command', () => {
    expect(commandParser(params).command).toBe('/buy');
  });

  it('should return a correct args', () => {
    expect(commandParser(params).args).toStrictEqual(['BETOL']);
  });
});
