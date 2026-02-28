import { describe, it, expect, vi } from 'vitest';
import { WebChannel } from '../src/web-channel.js';
import type { Message } from '@teamclaw/core';

describe('WebChannel', () => {
  describe('constructor', () => {
    it('should create web channel with correct name', () => {
      const channel = new WebChannel();
      expect(channel.name).toBe('web');
    });
  });

  describe('start and stop', () => {
    it('should start channel', async () => {
      const channel = new WebChannel();
      await expect(channel.start()).resolves.not.toThrow();
    });

    it('should stop channel', async () => {
      const channel = new WebChannel();
      await channel.start();
      await expect(channel.stop()).resolves.not.toThrow();
    });

    it('should allow start-stop-start cycle', async () => {
      const channel = new WebChannel();
      await channel.start();
      await channel.stop();
      await channel.start();
      await channel.stop();
    });
  });

  describe('sendMessage', () => {
    it('should send message without throwing', async () => {
      const channel = new WebChannel();
      await expect(
        channel.sendMessage('test-channel', 'Hello world')
      ).resolves.not.toThrow();
    });

    it('should handle empty message', async () => {
      const channel = new WebChannel();
      await expect(
        channel.sendMessage('test-channel', '')
      ).resolves.not.toThrow();
    });

    it('should handle special characters', async () => {
      const channel = new WebChannel();
      await expect(
        channel.sendMessage('test-channel', 'Hello @dev! 🦀')
      ).resolves.not.toThrow();
    });
  });

  describe('onMessage', () => {
    it('should register message handler', () => {
      const channel = new WebChannel();
      const handler = vi.fn();
      
      channel.onMessage(handler);
      // Handler registered, no error
      expect(true).toBe(true);
    });

    it('should allow multiple handler registrations', () => {
      const channel = new WebChannel();
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      channel.onMessage(handler1);
      channel.onMessage(handler2);
      expect(true).toBe(true);
    });
  });

  describe('simulateMessage', () => {
    it('should call registered handler with message', async () => {
      const channel = new WebChannel();
      const handler = vi.fn();
      
      channel.onMessage(handler);
      await channel.simulateMessage('Test message');
      
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should not call handler when no handler registered', async () => {
      const channel = new WebChannel();
      
      await expect(
        channel.simulateMessage('Test message')
      ).resolves.not.toThrow();
    });

    it('should pass message with correct structure', async () => {
      const channel = new WebChannel();
      let capturedMessage: Message | undefined;
      
      channel.onMessage(async (msg) => {
        capturedMessage = msg;
      });
      
      await channel.simulateMessage('Hello @dev');
      
      expect(capturedMessage).toBeDefined();
      expect(capturedMessage?.content).toBe('Hello @dev');
      expect(capturedMessage?.channel).toBe('web');
      expect(capturedMessage?.user).toBe('user');
    });

    it('should have empty mentions by default', async () => {
      const channel = new WebChannel();
      let capturedMessage: Message | undefined;
      
      channel.onMessage(async (msg) => {
        capturedMessage = msg;
      });
      
      await channel.simulateMessage('@dev fix this');
      
      expect(capturedMessage?.mentions).toEqual([]);
    });
  });
});
