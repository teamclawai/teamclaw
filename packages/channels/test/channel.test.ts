import { describe, it, expect } from 'vitest';
import { WebChannel } from '../src/web-channel.js';

describe('WebChannel', () => {
  it('should create web channel', () => {
    const channel = new WebChannel();
    expect(channel.name).toBe('web');
  });

  it('should start and stop', async () => {
    const channel = new WebChannel();
    await channel.start();
    await channel.stop();
  });
});
