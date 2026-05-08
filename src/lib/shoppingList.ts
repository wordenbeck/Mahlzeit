// Konsolidiert Zutaten aus geplanten Slots zu einer Einkaufsliste.
// Same name + same einheit → mengen summiert. Different einheit → separate Einträge.
// Mock-Logik für Sprint-0-Prototypen.

import { recipeById, type WeekplanSlot, type Zutat } from '../mocks/recipes';

export type ShoppingSource = {
  recipeTitle: string;
  dayOfWeek: number;     // 0=Mo .. 6=So
};

export type ShoppingItem = {
  key: string;          // unique
  name: string;
  menge: number;
  einheit: string;
  sources: ShoppingSource[];   // wo kommt die Zutat her
  isExtra?: boolean;
  checked?: boolean;
};

export function consolidateShoppingList(
  slots: WeekplanSlot[],
  portionsByRecipe: Record<string, number> = {}
): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();

  for (const slot of slots) {
    const recipe = recipeById(slot.recipeId);
    if (!recipe) continue;
    const targetPortionen = portionsByRecipe[slot.recipeId] ?? recipe.portionen;
    const factor = targetPortionen / recipe.portionen;

    for (const z of recipe.zutaten) {
      const key = `${z.name.toLowerCase()}__${z.einheit}`;
      const skaliert: Zutat = { ...z, menge: Math.round(z.menge * factor * 10) / 10 };
      const newSource: ShoppingSource = { recipeTitle: recipe.titel, dayOfWeek: slot.dayOfWeek };
      const existing = map.get(key);
      if (existing) {
        existing.menge = Math.round((existing.menge + skaliert.menge) * 10) / 10;
        const dup = existing.sources.find(s => s.recipeTitle === newSource.recipeTitle && s.dayOfWeek === newSource.dayOfWeek);
        if (!dup) existing.sources.push(newSource);
      } else {
        map.set(key, {
          key,
          name: z.name,
          menge: skaliert.menge,
          einheit: z.einheit,
          sources: [newSource],
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

export function formatMenge(menge: number, einheit: string): string {
  // Hübsche Anzeige: keine .0 wenn ganz
  const m = Number.isInteger(menge) ? menge.toString() : menge.toFixed(1);
  return `${m} ${einheit}`;
}
