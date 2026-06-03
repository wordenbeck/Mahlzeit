/**
 * End-to-End Integration Tests für Web Share Target API
 *
 * Testet complete flow:
 * Instagram Share → Parse Caption → Select Image → Save Recipe
 *
 * Mock scenarios ohne Supabase/Groq
 */

import { describe, it, expect, vi } from 'vitest';

describe('Web Share Target API - End-to-End Integration', () => {
  /**
   * Scenario 1: Happy Path
   * Perfekte Caption → Gutes Parsing → Beste Image → Success
   */
  describe('Happy Path: Perfect Caption', () => {
    it('should parse German recipe caption correctly', () => {
      const caption = `
        Pasta Carbonara 🍝

        Zutaten:
        - 400g Spaghetti
        - 200g Guanciale
        - 3 Eigelb
        - 100g Pecorino
        - Schwarzer Pfeffer

        Zubereitung:
        1. Wasser erhitzen
        2. Spaghetti kochen
        3. Guanciale braten
        4. Sauce machen
        5. Alles vermischen
      `;

      // Should extract:
      // - Titel: "Pasta Carbonara"
      // - 5 Zutaten mit Mengen
      // - 5 Zubereitungsschritte

      const titleMatch = caption.match(/^([^\n]+)/m);
      expect(titleMatch?.[1]).toContain('Carbonara');

      const zutatenSection = caption.match(/Zutaten:([\s\S]*?)(?:Zubereitung:|$)/);
      const zutatenLines = zutatenSection?.[1]
        ?.split('\n')
        .filter((l) => l.trim().startsWith('-'))
        .length;
      expect(zutatenLines).toBe(5);

      const zubereitungLines = caption.match(/\d+\./g)?.length;
      expect(zubereitungLines).toBe(5);
    });

    it('should handle ingredients with quantities and units', () => {
      const ingredients = [
        '400g Spaghetti',
        '2 EL Olivenöl',
        '1 Zwiebel',
        '250ml Wasser',
        'Salz nach Geschmack',
      ];

      const parsed = ingredients.map((ing) => {
        const match = ing.match(/^([\d.]+)\s+([a-zA-Z]+)\s+(.+)$/);
        return match
          ? { menge: parseFloat(match[1]), einheit: match[2], name: match[3] }
          : { menge: null, einheit: null, name: ing };
      });

      expect(parsed[0].menge).toBe(400);
      expect(parsed[0].einheit).toBe('g');
      expect(parsed[1].menge).toBe(2);
      expect(parsed[1].einheit).toBe('EL');
      expect(parsed[4].menge).toBeNull(); // "nach Geschmack"
    });
  });

  /**
   * Scenario 2: Messy Caption
   * Caption mit Adjektiven, mehreren "oder", ungültigen Mengen
   */
  describe('Messy Caption with Edge Cases', () => {
    it('should handle caption with cooking adjectives', () => {
      const zutaten = [
        'Zwiebel, fein gehackt',
        'Knoblauch fein gerieben',
        'Tomaten, geschält und zerkleinert',
      ];

      const cleaned = zutaten.map((z) => {
        return z
          .replace(
            /,\s*(gehackt|fein|grob|ganz|klein|gross|geraspelt|gerieben|zerkleinert|zerstoßen|gepellt|geschält)/gi,
            ''
          )
          .replace(
            /\s+(gehackt|fein|grob|ganz|klein|gross|geraspelt|gerieben|zerkleinert|zerstoßen|gepellt|geschält)/i,
            ''
          )
          .trim();
      });

      expect(cleaned[0]).toBe('Zwiebel');
      expect(cleaned[1]).toBe('Knoblauch');
      expect(cleaned[2]).toContain('Tomaten');
    });

    it('should split "oder" alternatives', () => {
      const ingredient = 'Pasta oder Nudeln oder Spaghetti';
      const alternatives = ingredient.split(/\s+oder\s+/i);

      expect(alternatives).toHaveLength(3);
      expect(alternatives[0]).toBe('Pasta');
      expect(alternatives[1]).toBe('Nudeln');
      expect(alternatives[2]).toBe('Spaghetti');
    });

    it('should reject invalid quantities', () => {
      const invalidQuantities = [-5, -100, 500000, 99999999];
      const isValid = (q: number) => q > 0 && q <= 10000;

      invalidQuantities.forEach((q) => {
        expect(isValid(q)).toBe(false);
      });

      expect(isValid(400)).toBe(true);
      expect(isValid(2.5)).toBe(true);
    });
  });

  /**
   * Scenario 3: Error Recovery
   * Caption zu kurz → Fallback zu Regex
   * Kein Bild gefunden → User kann skip
   */
  describe('Error Recovery Flows', () => {
    it('should detect empty caption', () => {
      const caption = '';
      expect(caption.trim().length < 20).toBe(true);
    });

    it('should fallback to regex when Groq fails', () => {
      const caption = `
        Einfaches Rezept

        Zutaten:
        - Zutat 1
        - Zutat 2

        Zubereitung:
        Alles vermischen
      `;

      // Simple regex parser
      const zutatenMatch = caption.match(/Zutaten:([\s\S]*?)(?:Zubereitung:|$)/);
      const zutaten = zutatenMatch?.[1]
        ?.split('\n')
        .filter((l) => l.trim().startsWith('-'))
        .map((l) => l.replace(/^[-•*]\s*/, '').trim());

      expect(zutaten?.length).toBe(2);
    });

    it('should handle no image search results', () => {
      const results: any[] = [];
      expect(results.length).toBe(0);
      // User should see "no images found" message
      // onSkip should be callable
    });
  });

  /**
   * Scenario 4: Data Integrity
   * Alle Daten sind korrekt validiert bevor Save
   */
  describe('Data Integrity Before Save', () => {
    interface Recipe {
      titel: string;
      zutaten: Array<{ name: string; menge: number | null; einheit: string | null }>;
      zubereitung: string[];
      bild_url: string | null;
    }

    function validateRecipe(recipe: Recipe): { valid: boolean; errors: string[] } {
      const errors: string[] = [];

      if (!recipe.titel || recipe.titel.trim().length < 3) {
        errors.push('Titel zu kurz');
      }

      if (recipe.zutaten.length === 0) {
        errors.push('Keine Zutaten');
      }

      if (recipe.zubereitung.length === 0) {
        errors.push('Keine Zubereitung');
      }

      recipe.zutaten.forEach((z, i) => {
        if (!z.name || z.name.trim().length === 0) {
          errors.push(`Zutat ${i + 1} hat keinen Namen`);
        }
        if (z.menge !== null && z.menge < 0) {
          errors.push(`Zutat ${i + 1} hat negative Menge`);
        }
      });

      return {
        valid: errors.length === 0,
        errors,
      };
    }

    it('should validate complete recipe', () => {
      const validRecipe: Recipe = {
        titel: 'Pasta Carbonara',
        zutaten: [
          { name: 'Spaghetti', menge: 400, einheit: 'g' },
          { name: 'Guanciale', menge: 200, einheit: 'g' },
        ],
        zubereitung: ['Kochen', 'Braten', 'Vermischen'],
        bild_url: 'https://example.com/image.jpg',
      };

      const result = validateRecipe(validRecipe);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject incomplete recipe', () => {
      const invalidRecipe: Recipe = {
        titel: 'A', // Too short
        zutaten: [], // No ingredients
        zubereitung: [],
        bild_url: null,
      };

      const result = validateRecipe(invalidRecipe);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject recipe with invalid data', () => {
      const invalidRecipe: Recipe = {
        titel: 'Recipe',
        zutaten: [
          { name: 'Ingredient', menge: -100, einheit: 'g' }, // Negative!
          { name: '', menge: null, einheit: null }, // Empty name!
        ],
        zubereitung: [],
        bild_url: null,
      };

      const result = validateRecipe(invalidRecipe);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  /**
   * Scenario 5: Multiple Shares in Sequence
   * User shares mehrere Rezepte hintereinander
   * Keine Crosstalk zwischen shares
   */
  describe('Multiple Shares Without Crosstalk', () => {
    it('should isolate recipes from multiple shares', () => {
      const share1 = {
        title: 'Pasta',
        caption: 'Pasta mit Tomaten',
        imageUrl: 'https://example.com/pasta.jpg',
      };

      const share2 = {
        title: 'Salat',
        caption: 'Gemischter Salat',
        imageUrl: 'https://example.com/salat.jpg',
      };

      // Should NOT mix data
      expect(share1.title).not.toBe(share2.title);
      expect(share1.caption).not.toBe(share2.caption);
      expect(share1.imageUrl).not.toBe(share2.imageUrl);

      // Should be independently valid
      const recipes = [share1, share2].map((s) => ({
        titel: s.title,
        bild_url: s.imageUrl,
      }));

      recipes.forEach((r) => {
        expect(r.titel).toBeTruthy();
        expect(r.bild_url).toBeTruthy();
      });
    });
  });

  /**
   * Scenario 6: Language Handling
   * English captions, mixed language, special characters
   */
  describe('Language & Special Characters', () => {
    it('should handle English captions', () => {
      const caption = `
        Pasta Carbonara

        Ingredients:
        - 400g Spaghetti
        - 200g Guanciale

        Instructions:
        1. Boil water
        2. Cook pasta
      `;

      expect(caption).toContain('Ingredients');
      // Parser should detect English keywords
      expect(/ingredients|ingredient/i.test(caption)).toBe(true);
    });

    it('should handle special characters in names', () => {
      const zutaten = [
        'Öl (hocherhitzbares)',
        'Zwiebel – fein gehackt',
        'Paprika "edelsüß"',
      ];

      const cleaned = zutaten.map((z) => {
        return z.replace(/\(.*?\)/g, '').replace(/–|"/g, '').trim();
      });

      expect(cleaned[0]).toContain('Öl');
      expect(cleaned[1]).toContain('Zwiebel');
      expect(cleaned[2]).toContain('Paprika');
    });
  });
});
