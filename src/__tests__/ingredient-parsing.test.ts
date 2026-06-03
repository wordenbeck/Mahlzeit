/**
 * Tests für Ingredient Parsing Edge Cases (FIX #1)
 *
 * Testet:
 * - Negative Mengen rejection
 * - Cooking adjectives cleanup
 * - "oder" splitting
 * - Name/Menge/Einheit extraction
 */

import { describe, it, expect } from 'vitest';

/**
 * Simuliert den Post-Processing nach Groq
 * (aus parse-recipe-caption Edge Function)
 */
function sanitizeIngredients(
  zutaten: Array<{ name: string; menge: number | null; einheit: string | null }>
) {
  return zutaten
    .map((z) => {
      let name = z.name.trim();
      let menge = z.menge;
      let einheit = z.einheit;

      // 1. Validate menge (no negatives, reasonable max)
      if (menge !== null) {
        if (menge < 0) menge = null;
        if (menge > 10000) menge = null;
      }

      // 2. Clean up name
      name = name
        .replace(
          /,\s*(gehackt|fein|grob|ganz|klein|gross|geraspelt|gerieben|zerkleinert|zerstoßen|gepellt|geschält|gesäuert)/gi,
          ''
        )
        .replace(
          /\s+(gehackt|fein|grob|ganz|klein|gross|geraspelt|gerieben|zerkleinert|zerstoßen|gepellt|geschält|gesäuert)$/i,
          ''
        )
        .trim();

      // 3. Split "oder"
      const orParts = name.split(/\s+oder\s+/i);
      if (orParts.length > 1) {
        return orParts.map((part) => ({
          name: part.trim(),
          menge,
          einheit,
        }));
      }

      return [{ name, menge, einheit }];
    })
    .flat()
    .filter((z) => z.name.length > 0);
}

describe('Ingredient Parsing Edge Cases', () => {
  describe('Menge Validation', () => {
    it('should reject negative quantities', () => {
      const input = [{ name: 'Öl', menge: -5, einheit: 'EL' }];
      const result = sanitizeIngredients(input);
      expect(result[0].menge).toBeNull();
    });

    it('should reject unreasonably large quantities', () => {
      const input = [{ name: 'Wasser', menge: 50000, einheit: 'ml' }];
      const result = sanitizeIngredients(input);
      expect(result[0].menge).toBeNull();
    });

    it('should accept normal quantities', () => {
      const input = [{ name: 'Nudeln', menge: 400, einheit: 'g' }];
      const result = sanitizeIngredients(input);
      expect(result[0].menge).toBe(400);
      expect(result[0].einheit).toBe('g');
    });
  });

  describe('Cooking Adjectives Cleanup', () => {
    it('should remove "gehackt" suffix', () => {
      const input = [{ name: 'Zwiebel, gehackt', menge: 1, einheit: null }];
      const result = sanitizeIngredients(input);
      expect(result[0].name).toBe('Zwiebel');
    });

    it('should remove "fein gehackt" suffix', () => {
      const input = [{ name: 'Knoblauch fein gehackt', menge: 2, einheit: null }];
      const result = sanitizeIngredients(input);
      expect(result[0].name).toBe('Knoblauch');
    });

    it('should handle "gerieben" adjective', () => {
      const input = [{ name: 'Parmesan, gerieben', menge: 100, einheit: 'g' }];
      const result = sanitizeIngredients(input);
      expect(result[0].name).toBe('Parmesan');
    });

    it('should keep important adjectives in middle of name', () => {
      const input = [{ name: 'frische Tomaten', menge: 500, einheit: 'g' }];
      const result = sanitizeIngredients(input);
      expect(result[0].name).toContain('Tomaten');
    });
  });

  describe('Order Splitting ("oder")', () => {
    it('should split "oder" alternatives', () => {
      const input = [{ name: 'Pasta oder Nudeln', menge: 400, einheit: 'g' }];
      const result = sanitizeIngredients(input);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Pasta');
      expect(result[1].name).toBe('Nudeln');
      expect(result[0].menge).toBe(400);
      expect(result[1].menge).toBe(400);
    });

    it('should preserve menge + einheit for all "oder" items', () => {
      const input = [{ name: 'Milch oder Sahne', menge: 250, einheit: 'ml' }];
      const result = sanitizeIngredients(input);
      expect(result).toHaveLength(2);
      result.forEach((item) => {
        expect(item.menge).toBe(250);
        expect(item.einheit).toBe('ml');
      });
    });

    it('should handle multiple "oder"', () => {
      const input = [{ name: 'Öl oder Butter oder Margarine', menge: 2, einheit: 'EL' }];
      const result = sanitizeIngredients(input);
      expect(result).toHaveLength(3);
      expect(result.map((r) => r.name)).toEqual(['Öl', 'Butter', 'Margarine']);
    });
  });

  describe('Combined Edge Cases', () => {
    it('should handle complex ingredient with adjectives and oder', () => {
      const input = [{ name: 'Zwiebel fein gehackt oder Lauch', menge: 2, einheit: null }];
      const result = sanitizeIngredients(input);
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Zwiebel');
      expect(result[1].name).toBe('Lauch');
    });

    it('should handle all edge cases at once', () => {
      const input = [
        { name: 'Wasser', menge: -100, einheit: 'ml' }, // negative
        { name: 'Nudeln, fein gehackt', menge: 400, einheit: 'g' }, // adjective
        { name: 'Tomaten oder Paprika', menge: 500, einheit: 'g' }, // oder
        { name: 'Öl', menge: 999999, einheit: 'ml' }, // unreasonable
      ];
      const result = sanitizeIngredients(input);

      expect(result).toHaveLength(5); // Wasser (null), Nudeln, Tomaten, Paprika, Öl (null)
      expect(result[0].name).toBe('Wasser');
      expect(result[0].menge).toBeNull(); // negative rejected
      expect(result[1].name).toBe('Nudeln'); // adjective removed
      expect(result[2].name).toBe('Tomaten'); // oder split
      expect(result[3].name).toBe('Paprika'); // oder split
      expect(result[4].name).toBe('Öl');
      expect(result[4].menge).toBeNull(); // unreasonable rejected
    });
  });

  describe('Empty/Invalid Cases', () => {
    it('should filter out empty names', () => {
      const input = [{ name: '', menge: 100, einheit: 'g' }];
      const result = sanitizeIngredients(input);
      expect(result).toHaveLength(0);
    });

    it('should handle null menge gracefully', () => {
      const input = [{ name: 'Salz nach Geschmack', menge: null, einheit: null }];
      const result = sanitizeIngredients(input);
      expect(result[0].menge).toBeNull();
      expect(result[0].einheit).toBeNull();
    });
  });
});
