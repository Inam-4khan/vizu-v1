import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateLoginForm,
} from '../utils/validation';

describe('Form Validation Logic', () => {
  describe('validateEmail', () => {
    it('returns true for valid email formats', () => {
      expect(validateEmail('alex@vizu.app')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('returns false for invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('returns valid when password meets minimum length requirement', () => {
      const result = validatePassword('securepass123', 8);
      expect(result.isValid).toBe(true);
    });

    it('returns error when password is too short', () => {
      const result = validatePassword('short', 8);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters long');
    });
  });

  describe('validateLoginForm', () => {
    it('validates complete form successfully when inputs are correct', () => {
      const result = validateLoginForm('persona@vizu.app', 'password123');
      expect(result.isValid).toBe(true);
    });
  });
});
