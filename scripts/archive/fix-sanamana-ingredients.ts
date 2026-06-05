/**
 * Fix SanaMana ingredient data
 * Standardizes: name, menge, einheit
 *
 * Rules:
 * - Zwiebel-Varianten → "Rote Zwiebel" etc., menge=1, einheit="Stk"
 * - Knoblauch → "Knoblauchzehe", menge=X, einheit="Stk"
 * - Tomatenmark/Soße → clean name, menge in EL (≤2) or g (>2)
 * - Generisch: menge + einheit, no units in name
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface Zutat {
  name: string | null;
  menge: number | null;
  einheit: string | null;
  hinweis: string | null;
}

// Rules for specific ingredients
const INGREDIENT_RULES: Record<
  string,
  (zutat: Zutat) => Zutat | null
> = {
  // Zwiebeln
  zwiebel: (z) => {
    if (!z.name) return null;
    const name = z.name.toLowerCase();

    // "1 rote" + "Zwiebel" → merge to "Rote Zwiebel"
    if (name.includes('rote') || name.includes('zwiebel')) {
      return {
        name: extractOnionType(z.name) || 'Zwiebel',
        menge: 1,
        einheit: 'Stk',
        hinweis: z.hinweis,
      };
    }
    return null;
  },

  // Knoblauch
  knoblauch: (z) => {
    if (!z.name) return null;
    const name = z.name.toLowerCase();

    if (name.includes('knoblauch') || name.includes('zehe')) {
      // Extract number if present (e.g., "3 Knoblauchzehen")
      const match = z.name.match(/(\d+)/);
      const count = match ? parseInt(match[1]) : (z.menge || 1);

      return {
        name: 'Knoblauchzehe',
        menge: count,
        einheit: 'Stk',
        hinweis: z.hinweis,
      };
    }
    return null;
  },

  // Tomatenmark
  tomatenmark: (z) => {
    if (!z.name) return null;
    const name = z.name.toLowerCase();

    if (name.includes('tomat')) {
      // Try to extract EL or g amount
      let menge = z.menge;
      let einheit = z.einheit;

      // If we have "1EL" in name, extract it
      const elMatch = z.name.match(/(\d+)\s*EL/i);
      const gMatch = z.name.match(/(\d+)\s*g/i);

      if (elMatch) {
        menge = parseInt(elMatch[1]);
        einheit = 'EL';
      } else if (gMatch) {
        menge = parseInt(gMatch[1]);
        einheit = 'g';
      } else if (z.menge && z.einheit === 'g') {
        // Already has g, convert to EL if ≤ 2
        const gramsPerEl = 15; // Approximate
        if (z.menge <= gramsPerEl * 2) {
          menge = Math.round(z.menge / gramsPerEl);
          einheit = 'EL';
        }
      }

      return {
        name: 'Tomatenmark',
        menge: menge || 1,
        einheit: einheit || 'EL',
        hinweis: z.hinweis,
      };
    }
    return null;
  },
};

function extractOnionType(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('rot')) return 'Rote Zwiebel';
  if (lower.includes('gemüse') || lower.includes('gemuesezwiebel')) return 'Gemüsezwiebel';
  if (lower.includes('weiß') || lower.includes('weiss')) return 'Weiße Zwiebel';
  return 'Zwiebel';
}

function cleanZutat(zutat: Zutat): Zutat {
  if (!zutat.name) return zutat;

  const name = zutat.name.toLowerCase();

  // Try to match rules
  for (const [key, rule] of Object.entries(INGREDIENT_RULES)) {
    if (name.includes(key)) {
      const result = rule(zutat);
      if (result) return result;
    }
  }

  // Fallback: clean up obvious issues
  // Remove trailing units from name
  let cleanedName = zutat.name
    .replace(/\s*\(\s*\d+\s*EL\s*\)\s*$/, '')
    .replace(/\s*\(\s*\d+\s*g\s*\)\s*$/, '')
    .trim();

  return {
    name: cleanedName,
    menge: zutat.menge,
    einheit: zutat.einheit,
    hinweis: zutat.hinweis,
  };
}

async function fixSanaManaRecipes() {
  console.log('🔧 Starting SanaMana ingredient cleanup...\n');

  try {
    // Fetch all SanaMana recipes
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('id, titel, zutaten')
      .eq('source', 'sanamana');

    if (error) throw error;
    if (!recipes || recipes.length === 0) {
      console.log('No SanaMana recipes found');
      return;
    }

    console.log(`📋 Found ${recipes.length} SanaMana recipes\n`);

    let fixed = 0;
    let unchanged = 0;

    for (const recipe of recipes) {
      const originalZutaten = recipe.zutaten as Zutat[];
      const cleanedZutaten = originalZutaten.map(cleanZutat);

      // Check if anything changed
      const hasChanged = JSON.stringify(originalZutaten) !== JSON.stringify(cleanedZutaten);

      if (hasChanged) {
        fixed++;
        console.log(`✏️  ${recipe.titel}`);
        console.log('   Before:');
        originalZutaten.forEach((z) => {
          console.log(`     - ${z.name} (${z.menge} ${z.einheit})`);
        });
        console.log('   After:');
        cleanedZutaten.forEach((z) => {
          console.log(`     - ${z.name} (${z.menge} ${z.einheit})`);
        });
        console.log('');

        // Update recipe
        const { error: updateError } = await supabase
          .from('recipes')
          .update({ zutaten: cleanedZutaten })
          .eq('id', recipe.id);

        if (updateError) {
          console.error(`❌ Failed to update ${recipe.titel}:`, updateError.message);
        } else {
          console.log(`   ✅ Updated\n`);
        }
      } else {
        unchanged++;
      }
    }

    console.log(`\n✅ Complete!`);
    console.log(`   Fixed: ${fixed}`);
    console.log(`   Unchanged: ${unchanged}`);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

fixSanaManaRecipes();
