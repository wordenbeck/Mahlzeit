// Weekplan + Slot CRUD + ISO-Wochen-Logik
//
// Konvention: week_start ist der Montag der ISO-Woche (00:00 UTC).
// day_of_week: 0 = Mo, 6 = So.

import {
  startOfISOWeek, addDays, format, getISOWeek, parseISO,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { supabase } from './supabase';
import type { WeekplanSlot, MealType, Zutat } from './types/recipe';

// =====================================================================
// ISO-Wochen-Helpers
// =====================================================================

export function isoWeekStart(date: Date): string {
  // YYYY-MM-DD vom Montag der Woche
  return format(startOfISOWeek(date), 'yyyy-MM-dd');
}

export function isoWeekNumber(date: Date): number {
  return getISOWeek(date);
}

export function isoWeekRangeLabel(weekStart: string): string {
  // weekStart = YYYY-MM-DD (Mo); Output: "4. – 10. Mai 2026"
  const mo = parseISO(weekStart);
  const so = addDays(mo, 6);
  const sameMonth = format(mo, 'M') === format(so, 'M');
  if (sameMonth) {
    return `${format(mo, 'd.')} – ${format(so, 'd. MMMM yyyy', { locale: de })}`;
  }
  return `${format(mo, 'd. MMM', { locale: de })} – ${format(so, 'd. MMM yyyy', { locale: de })}`;
}

export function dayLabelLong(weekStart: string, dayOfWeek: number): string {
  return format(addDays(parseISO(weekStart), dayOfWeek), 'EEEE', { locale: de });
}

export function dayLabelShort(weekStart: string, dayOfWeek: number): string {
  return format(addDays(parseISO(weekStart), dayOfWeek), 'EEEEEE', { locale: de }); // "Mo", "Di"
}

export function dayDateLong(weekStart: string, dayOfWeek: number): string {
  return format(addDays(parseISO(weekStart), dayOfWeek), 'd. MMMM', { locale: de });
}

export function shiftWeek(weekStart: string, deltaWeeks: number): string {
  return format(addDays(parseISO(weekStart), deltaWeeks * 7), 'yyyy-MM-dd');
}

export function isToday(weekStart: string, dayOfWeek: number): boolean {
  const target = format(addDays(parseISO(weekStart), dayOfWeek), 'yyyy-MM-dd');
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  return target === todayStr;
}

// =====================================================================
// CRUD: Weekplan + Slots
// =====================================================================

export type Slot = WeekplanSlot;

export type WeekplanWithSlots = {
  id: string;
  workspace_id: string;
  week_start: string;
  slots: Slot[];
};

async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Nicht eingeloggt.');
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, workspace_id')
    .eq('id', user.id)
    .single();
  if (!profile) throw new Error('Kein Profil.');
  return profile;
}

/** Holt (oder legt an) den Weekplan einer ISO-Woche und alle Slots */
export async function getOrCreateWeekplan(weekStart: string): Promise<WeekplanWithSlots> {
  const profile = await getCurrentProfile();

  // 1. existing
  const { data: existing } = await supabase
    .from('weekplans')
    .select('id, workspace_id, week_start')
    .eq('workspace_id', profile.workspace_id)
    .eq('week_start', weekStart)
    .maybeSingle();

  let weekplan = existing;
  if (!weekplan) {
    const { data: created, error } = await supabase
      .from('weekplans')
      .insert({ workspace_id: profile.workspace_id, week_start: weekStart })
      .select('id, workspace_id, week_start')
      .single();
    if (error) throw error;
    weekplan = created;
  }

  const { data: slots, error: slotsErr } = await supabase
    .from('weekplan_slots')
    .select('*')
    .eq('weekplan_id', weekplan.id)
    .order('day_of_week', { ascending: true })
    .order('position', { ascending: true });
  if (slotsErr) throw slotsErr;

  return {
    ...weekplan,
    slots: (slots ?? []) as unknown as Slot[],
  };
}

export async function addSlot(input: {
  weekplan_id: string;
  day_of_week: number;
  meal_type: MealType;
  recipe_id: string;
  notes?: string;
}): Promise<Slot> {
  const profile = await getCurrentProfile();
  const { data, error } = await supabase
    .from('weekplan_slots')
    .insert({
      weekplan_id: input.weekplan_id,
      day_of_week: input.day_of_week,
      meal_type: input.meal_type,
      recipe_id: input.recipe_id,
      added_by: profile.id,
      notes: input.notes ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as unknown as Slot;
}

export async function moveSlot(slotId: string, newDayOfWeek: number, newMealType?: MealType): Promise<void> {
  const patch: Record<string, unknown> = { day_of_week: newDayOfWeek };
  if (newMealType) patch.meal_type = newMealType;
  const { error } = await supabase
    .from('weekplan_slots')
    .update(patch as never)
    .eq('id', slotId);
  if (error) throw error;
}

export async function deleteSlot(slotId: string): Promise<void> {
  const { error } = await supabase.from('weekplan_slots').delete().eq('id', slotId);
  if (error) throw error;
}

export async function setPortionenOverride(slotId: string, portionen: number | null): Promise<void> {
  const { error } = await supabase
    .from('weekplan_slots')
    .update({ portionen_override: portionen } as never)
    .eq('id', slotId);
  if (error) throw error;
}

export async function setZutatenOverride(slotId: string, override: Record<string, number>): Promise<void> {
  const { error } = await supabase
    .from('weekplan_slots')
    .update({ zutaten_override: override as never } as never)
    .eq('id', slotId);
  if (error) throw error;
}

// =====================================================================
// Shopping-List-Konsolidierung über Slots + Recipes
// =====================================================================

import { recipeById as mockRecipeById } from '../mocks/recipes';
import { getRecipe } from './recipes';
void mockRecipeById; // mocks bleibt für /proto/*

export type ShoppingSource = {
  recipeTitle: string;
  dayOfWeek: number;
};

export type ShoppingItem = {
  key: string;
  name: string;
  menge: number;
  einheit: string;
  sources: ShoppingSource[];
  isExtra?: boolean;
  checked?: boolean;
};

/** Lädt alle Recipes für die Slots in einem Mal */
export async function consolidateFromSlots(slots: Slot[]): Promise<ShoppingItem[]> {
  const recipeIds = Array.from(new Set(slots.map(s => s.recipe_id).filter(Boolean) as string[]));
  if (recipeIds.length === 0) return [];

  const recipes = await Promise.all(recipeIds.map(id => getRecipe(id)));
  const byId = new Map(recipes.filter(Boolean).map(r => [r!.id, r!]));

  const map = new Map<string, ShoppingItem>();

  for (const slot of slots) {
    if (!slot.recipe_id) continue;
    const recipe = byId.get(slot.recipe_id);
    if (!recipe) continue;

    const targetPortionen = slot.portionen_override ?? recipe.portionen;
    const factor = recipe.portionen > 0 ? targetPortionen / recipe.portionen : 1;
    const overrides = (slot.zutaten_override ?? {}) as Record<string, number>;

    for (const z of recipe.zutaten as Zutat[]) {
      if (z.menge == null) continue; // "nach Geschmack" überspringen
      const overrideKey = z.name.toLowerCase();
      const skaliert = overrides[overrideKey] ?? Math.round(z.menge * factor * 10) / 10;

      const groupKey = `${overrideKey}__${z.einheit}`;
      const newSource: ShoppingSource = {
        recipeTitle: recipe.titel,
        dayOfWeek: slot.day_of_week,
      };
      const existing = map.get(groupKey);
      if (existing) {
        existing.menge = Math.round((existing.menge + skaliert) * 10) / 10;
        const dup = existing.sources.find(
          s => s.recipeTitle === newSource.recipeTitle && s.dayOfWeek === newSource.dayOfWeek
        );
        if (!dup) existing.sources.push(newSource);
      } else {
        map.set(groupKey, {
          key: groupKey,
          name: z.name,
          menge: skaliert,
          einheit: z.einheit,
          sources: [newSource],
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

export function formatMenge(menge: number, einheit: string): string {
  const m = Number.isInteger(menge) ? menge.toString() : menge.toFixed(1);
  return `${m}${einheit ? ' ' + einheit : ''}`;
}
