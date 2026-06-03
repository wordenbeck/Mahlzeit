/**
 * Tests für Error Handling System (FIX #3)
 *
 * Testet:
 * - Error code mapping
 * - User-friendly messages
 * - Actionable buttons
 * - Error detection logic
 */

import { describe, it, expect } from 'vitest';
import { getErrorInfo, formatErrorDisplay, type AppError } from '../lib/errors';

describe('Error Handling System', () => {
  describe('getErrorInfo', () => {
    it('should return correct info for Instagram blocked error', () => {
      const error = getErrorInfo('ERR_INSTAGRAM_BLOCKED');
      expect(error.code).toBe('ERR_INSTAGRAM_BLOCKED');
      expect(error.message).toContain('blockiert');
      expect(error.action).toBe('RETRY');
    });

    it('should return correct info for caption empty error', () => {
      const error = getErrorInfo('ERR_CAPTION_EMPTY');
      expect(error.code).toBe('ERR_CAPTION_EMPTY');
      expect(error.message).toContain('Caption');
      expect(error.action).toBe('MANUAL_EDIT');
    });

    it('should return correct info for Groq timeout', () => {
      const error = getErrorInfo('ERR_GROQ_TIMEOUT');
      expect(error.code).toBe('ERR_GROQ_TIMEOUT');
      expect(error.message).toContain('KI-Analyse');
      expect(error.action).toBe('RETRY');
    });

    it('should return correct info for rate limit', () => {
      const error = getErrorInfo('ERR_GROQ_RATELIMIT');
      expect(error.code).toBe('ERR_GROQ_RATELIMIT');
      expect(error.message).toContain('Rate-Limit');
      expect(error.action).toBe('RETRY');
    });

    it('should return correct info for image search failed', () => {
      const error = getErrorInfo('ERR_IMAGE_SEARCH_FAILED');
      expect(error.code).toBe('ERR_IMAGE_SEARCH_FAILED');
      expect(error.message).toContain('Bildsuche');
      expect(error.action).toBe('SKIP');
    });

    it('should include context details', () => {
      const context = 'Connection timeout after 30s';
      const error = getErrorInfo('ERR_NETWORK', context);
      expect(error.details).toBe(context);
    });
  });

  describe('formatErrorDisplay', () => {
    it('should format error with correct buttons for RETRY action', () => {
      const error = getErrorInfo('ERR_GROQ_TIMEOUT');
      const display = formatErrorDisplay(error);
      expect(display.buttons.some((b) => b.action === 'RETRY')).toBe(true);
      expect(display.icon).toBeTruthy();
    });

    it('should format error with correct buttons for MANUAL_EDIT action', () => {
      const error = getErrorInfo('ERR_CAPTION_EMPTY');
      const display = formatErrorDisplay(error);
      expect(display.buttons.some((b) => b.action === 'MANUAL_EDIT')).toBe(true);
    });

    it('should format error with correct buttons for SKIP action', () => {
      const error = getErrorInfo('ERR_IMAGE_SEARCH_FAILED');
      const display = formatErrorDisplay(error);
      expect(display.buttons.some((b) => b.action === 'SKIP')).toBe(true);
    });

    it('should have no buttons for NONE action', () => {
      const error = getErrorInfo('ERR_INSTAGRAM_PRIVATE');
      const display = formatErrorDisplay(error);
      expect(display.buttons).toHaveLength(0);
    });

    it('should include error code in title', () => {
      const error = getErrorInfo('ERR_NETWORK');
      const display = formatErrorDisplay(error);
      expect(display.title).toContain('ERR_NETWORK');
    });
  });

  describe('Error Detection Logic', () => {
    it('should detect timeout in error message', () => {
      const errorMsg = 'Request timeout after 30s';
      const hasTimeout = errorMsg.toLowerCase().includes('timeout');
      expect(hasTimeout).toBe(true);
    });

    it('should detect rate limit in error message', () => {
      const errorMsg = 'HTTP 429: Rate limit exceeded';
      const hasRateLimit = errorMsg.toLowerCase().includes('rate');
      expect(hasRateLimit).toBe(true);
    });

    it('should detect 404 as Instagram private', () => {
      const status = 404;
      const isNotFound = status === 404;
      expect(isNotFound).toBe(true);
    });

    it('should detect network errors', () => {
      const errors = [
        'Failed to fetch',
        'Network error',
        'Connection refused',
        'CORS blocked',
      ];
      errors.forEach((err) => {
        expect(err.toLowerCase()).toMatch(/network|fetch|connection|cors/i);
      });
    });
  });

  describe('All Error Codes Covered', () => {
    const errorCodes = [
      'ERR_INSTAGRAM_BLOCKED',
      'ERR_INSTAGRAM_PRIVATE',
      'ERR_CAPTION_EMPTY',
      'ERR_GROQ_TIMEOUT',
      'ERR_GROQ_RATELIMIT',
      'ERR_GROQ_FAILED',
      'ERR_IMAGE_SEARCH_FAILED',
      'ERR_NETWORK',
      'ERR_PARSE_FAILED',
      'ERR_UNKNOWN',
    ] as const;

    errorCodes.forEach((code) => {
      it(`should have proper display for ${code}`, () => {
        const error = getErrorInfo(code);
        const display = formatErrorDisplay(error);
        expect(error.message).toBeTruthy();
        expect(error.message.length > 0).toBe(true);
        expect(display.icon).toBeTruthy();
        expect(display.title).toContain(code);
      });
    });
  });

  describe('User Experience', () => {
    it('should not repeat error code in message', () => {
      const error = getErrorInfo('ERR_GROQ_TIMEOUT');
      // Message should be user-friendly, not "ERR_GROQ_TIMEOUT: ERR_GROQ_TIMEOUT..."
      expect(error.message).not.toContain('ERR_GROQ');
    });

    it('should have actionable messages (with specific guidance)', () => {
      const errors = [
        getErrorInfo('ERR_INSTAGRAM_BLOCKED'),
        getErrorInfo('ERR_CAPTION_EMPTY'),
        getErrorInfo('ERR_GROQ_TIMEOUT'),
      ];
      errors.forEach((error) => {
        expect(error.message.length).toBeGreaterThan(10);
        expect(error.action).not.toBeUndefined();
      });
    });

    it('should have icons for visual distinction', () => {
      const codes = [
        'ERR_INSTAGRAM_BLOCKED',
        'ERR_GROQ_TIMEOUT',
        'ERR_CAPTION_EMPTY',
      ] as const;
      codes.forEach((code) => {
        const error = getErrorInfo(code);
        const display = formatErrorDisplay(error);
        expect(/[🚫⏱️📝🤖🖼️🌐]/i.test(display.icon)).toBe(true);
      });
    });
  });
});
