// Mock-Daten für Sprint-0-Prototypen. Keine DB, keine Auth.
// Wenn Sprint 1 startet, wandern Typen nach src/lib/types/recipe.ts.

export type Schwierigkeit = 'einfach' | 'mittel' | 'aufwendig';
export type MealType = 'fruehstueck' | 'mittag' | 'abendessen' | 'snack';

export type Profile = {
  id: string;
  displayName: string;
  initial: string;
  colorVar: string; // CSS-Var-Name z.B. '--profile-amber'
};

export type Zutat = {
  name: string;
  menge: number;
  einheit: string; // 'g' | 'ml' | 'Stk' | 'EL' | 'TL' | 'Prise'
};

export type Recipe = {
  id: string;
  titel: string;
  zeitMin: number;
  schwierigkeit: Schwierigkeit;
  kategorien: string[];      // 'vegan' | 'vegetarisch' | 'fleisch' | 'pasta' | 'salat' | ...
  gradientVar: string;       // CSS-Var z.B. '--gradient-recipe-1'
  emoji: string;
  createdBy: string;         // Profile.id
  portionen: number;         // Default-Portionen, auf die sich die Mengen beziehen
  zutaten: Zutat[];
  isFavorite?: boolean;
};

export type WeekplanSlot = {
  id: string;
  dayOfWeek: number;         // 0 = Mo, 6 = So
  mealType: MealType;
  recipeId: string;
  addedBy: string;
  notes?: string;
};

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

export const PROFILES: Profile[] = [
  { id: 'p_thomas', displayName: 'Thomas', initial: 'T', colorVar: '--profile-amber' },
  { id: 'p_lisa',   displayName: 'Lisa',   initial: 'L', colorVar: '--profile-sage' },
];

export const profileById = (id: string): Profile =>
  PROFILES.find(p => p.id === id) ?? PROFILES[0];

// ---------------------------------------------------------------------------
// Rezepte (12)
// ---------------------------------------------------------------------------

export const RECIPES: Recipe[] = [
  { id: 'r1',  titel: 'Linsenbowl mit Feta',       zeitMin: 25, schwierigkeit: 'einfach', kategorien: ['vegetarisch', 'bowl'],         gradientVar: '--gradient-recipe-3', emoji: '🥗', createdBy: 'p_lisa',   isFavorite: true, portionen: 2,
    zutaten: [
      { name: 'Rote Linsen',   menge: 200, einheit: 'g' },
      { name: 'Feta',          menge: 150, einheit: 'g' },
      { name: 'Cherrytomaten', menge: 250, einheit: 'g' },
      { name: 'Rucola',        menge: 100, einheit: 'g' },
      { name: 'Olivenöl',      menge: 3,   einheit: 'EL' },
      { name: 'Zitrone',       menge: 1,   einheit: 'Stk' },
    ] },
  { id: 'r2',  titel: 'Lasagne classico',          zeitMin: 75, schwierigkeit: 'mittel',   kategorien: ['fleisch', 'pasta', 'ofen'],   gradientVar: '--gradient-recipe-2', emoji: '🍝', createdBy: 'p_thomas', portionen: 4,
    zutaten: [
      { name: 'Lasagneplatten',  menge: 250, einheit: 'g' },
      { name: 'Hackfleisch',     menge: 500, einheit: 'g' },
      { name: 'Tomatensoße',     menge: 700, einheit: 'g' },
      { name: 'Mozzarella',      menge: 250, einheit: 'g' },
      { name: 'Parmesan',        menge: 80,  einheit: 'g' },
      { name: 'Zwiebeln',        menge: 2,   einheit: 'Stk' },
    ] },
  { id: 'r3',  titel: 'Pasta Aglio e Olio',        zeitMin: 15, schwierigkeit: 'einfach',  kategorien: ['vegetarisch', 'pasta'],       gradientVar: '--gradient-recipe-6', emoji: '🍝', createdBy: 'p_thomas', isFavorite: true, portionen: 2,
    zutaten: [
      { name: 'Spaghetti',     menge: 250, einheit: 'g' },
      { name: 'Knoblauch',     menge: 4,   einheit: 'Stk' },
      { name: 'Olivenöl',      menge: 6,   einheit: 'EL' },
      { name: 'Chiliflocken',  menge: 1,   einheit: 'TL' },
      { name: 'Petersilie',    menge: 1,   einheit: 'Bund' },
    ] },
  { id: 'r4',  titel: 'Veganes Curry',             zeitMin: 30, schwierigkeit: 'einfach',  kategorien: ['vegan', 'curry'],             gradientVar: '--gradient-recipe-1', emoji: '🍛', createdBy: 'p_lisa', portionen: 2,
    zutaten: [
      { name: 'Kichererbsen',  menge: 400, einheit: 'g' },
      { name: 'Kokosmilch',    menge: 400, einheit: 'ml' },
      { name: 'Süßkartoffel',  menge: 1,   einheit: 'Stk' },
      { name: 'Spinat',        menge: 200, einheit: 'g' },
      { name: 'Currypaste',    menge: 2,   einheit: 'EL' },
      { name: 'Basmati-Reis',  menge: 200, einheit: 'g' },
    ] },
  { id: 'r5',  titel: 'Caesar Salad',              zeitMin: 20, schwierigkeit: 'einfach',  kategorien: ['salat', 'fleisch'],           gradientVar: '--gradient-recipe-3', emoji: '🥬', createdBy: 'p_thomas', portionen: 2,
    zutaten: [
      { name: 'Römersalat',     menge: 1,   einheit: 'Kopf' },
      { name: 'Hähnchenbrust',  menge: 300, einheit: 'g' },
      { name: 'Parmesan',       menge: 60,  einheit: 'g' },
      { name: 'Croutons',       menge: 80,  einheit: 'g' },
      { name: 'Caesar-Dressing',menge: 100, einheit: 'ml' },
    ] },
  { id: 'r6',  titel: 'Pizza Margherita',          zeitMin: 90, schwierigkeit: 'aufwendig',kategorien: ['vegetarisch', 'ofen'],        gradientVar: '--gradient-recipe-2', emoji: '🍕', createdBy: 'p_thomas', portionen: 2,
    zutaten: [
      { name: 'Pizzateig',     menge: 500, einheit: 'g' },
      { name: 'Tomatensoße',   menge: 200, einheit: 'g' },
      { name: 'Mozzarella',    menge: 250, einheit: 'g' },
      { name: 'Basilikum',     menge: 1,   einheit: 'Bund' },
      { name: 'Olivenöl',      menge: 2,   einheit: 'EL' },
    ] },
  { id: 'r7',  titel: 'Hähnchen Reispfanne',       zeitMin: 35, schwierigkeit: 'mittel',   kategorien: ['fleisch', 'pfanne'],          gradientVar: '--gradient-recipe-1', emoji: '🍚', createdBy: 'p_lisa', portionen: 4,
    zutaten: [
      { name: 'Hähnchenbrust', menge: 500, einheit: 'g' },
      { name: 'Reis',          menge: 300, einheit: 'g' },
      { name: 'Paprika',       menge: 2,   einheit: 'Stk' },
      { name: 'Zucchini',      menge: 1,   einheit: 'Stk' },
      { name: 'Sojasauce',     menge: 4,   einheit: 'EL' },
      { name: 'Knoblauch',     menge: 2,   einheit: 'Stk' },
    ] },
  { id: 'r8',  titel: 'Tomatensuppe',              zeitMin: 25, schwierigkeit: 'einfach',  kategorien: ['vegetarisch', 'suppe'],       gradientVar: '--gradient-recipe-2', emoji: '🍲', createdBy: 'p_thomas', portionen: 4,
    zutaten: [
      { name: 'Tomaten',       menge: 800, einheit: 'g' },
      { name: 'Zwiebel',       menge: 1,   einheit: 'Stk' },
      { name: 'Gemüsebrühe',   menge: 500, einheit: 'ml' },
      { name: 'Sahne',         menge: 100, einheit: 'ml' },
      { name: 'Basilikum',     menge: 1,   einheit: 'Bund' },
    ] },
  { id: 'r9',  titel: 'Schnitzel mit Pommes',      zeitMin: 40, schwierigkeit: 'mittel',   kategorien: ['fleisch', 'klassiker'],       gradientVar: '--gradient-recipe-6', emoji: '🍗', createdBy: 'p_lisa', portionen: 4,
    zutaten: [
      { name: 'Schweineschnitzel', menge: 600, einheit: 'g' },
      { name: 'Pommes',            menge: 1,   einheit: 'kg' },
      { name: 'Paniermehl',        menge: 200, einheit: 'g' },
      { name: 'Eier',              menge: 2,   einheit: 'Stk' },
      { name: 'Zitrone',           menge: 1,   einheit: 'Stk' },
    ] },
  { id: 'r10', titel: 'Buddha Bowl',               zeitMin: 30, schwierigkeit: 'einfach',  kategorien: ['vegan', 'bowl'],              gradientVar: '--gradient-recipe-3', emoji: '🥑', createdBy: 'p_lisa', isFavorite: true, portionen: 2,
    zutaten: [
      { name: 'Quinoa',        menge: 200, einheit: 'g' },
      { name: 'Avocado',       menge: 1,   einheit: 'Stk' },
      { name: 'Kichererbsen',  menge: 200, einheit: 'g' },
      { name: 'Rote Bete',     menge: 200, einheit: 'g' },
      { name: 'Tahini',        menge: 3,   einheit: 'EL' },
      { name: 'Spinat',        menge: 100, einheit: 'g' },
    ] },
  { id: 'r11', titel: 'Spaghetti Bolognese',       zeitMin: 45, schwierigkeit: 'mittel',   kategorien: ['fleisch', 'pasta'],           gradientVar: '--gradient-recipe-2', emoji: '🍝', createdBy: 'p_thomas', portionen: 4,
    zutaten: [
      { name: 'Spaghetti',     menge: 500, einheit: 'g' },
      { name: 'Hackfleisch',   menge: 500, einheit: 'g' },
      { name: 'Tomatensoße',   menge: 700, einheit: 'g' },
      { name: 'Zwiebeln',      menge: 2,   einheit: 'Stk' },
      { name: 'Knoblauch',     menge: 3,   einheit: 'Stk' },
      { name: 'Parmesan',      menge: 60,  einheit: 'g' },
    ] },
  { id: 'r12', titel: 'Quinoa-Salat',              zeitMin: 20, schwierigkeit: 'einfach',  kategorien: ['vegan', 'salat'],             gradientVar: '--gradient-recipe-4', emoji: '🌾', createdBy: 'p_lisa', portionen: 2,
    zutaten: [
      { name: 'Quinoa',        menge: 200, einheit: 'g' },
      { name: 'Gurke',         menge: 1,   einheit: 'Stk' },
      { name: 'Cherrytomaten', menge: 250, einheit: 'g' },
      { name: 'Petersilie',    menge: 1,   einheit: 'Bund' },
      { name: 'Zitrone',       menge: 1,   einheit: 'Stk' },
      { name: 'Olivenöl',      menge: 3,   einheit: 'EL' },
    ] },
];

export const recipeById = (id: string): Recipe | undefined =>
  RECIPES.find(r => r.id === id);

// ---------------------------------------------------------------------------
// Wochenplan (Mock — Mo–So mit ein paar leeren Tagen für "+ Hinzufügen"-State)
// ---------------------------------------------------------------------------

export const WEEKPLAN_SLOTS: WeekplanSlot[] = [
  // Mo
  { id: 's1',  dayOfWeek: 0, mealType: 'abendessen', recipeId: 'r2',  addedBy: 'p_thomas' },
  // Di
  { id: 's2',  dayOfWeek: 1, mealType: 'mittag',     recipeId: 'r3',  addedBy: 'p_thomas' },
  { id: 's3',  dayOfWeek: 1, mealType: 'abendessen', recipeId: 'r5',  addedBy: 'p_lisa' },
  // Mi
  { id: 's4',  dayOfWeek: 2, mealType: 'abendessen', recipeId: 'r4',  addedBy: 'p_lisa' },
  // Do — leer (zeigt + Hinzufügen-State)
  // Fr
  { id: 's5',  dayOfWeek: 4, mealType: 'abendessen', recipeId: 'r6',  addedBy: 'p_thomas', notes: 'doppelte Portion' },
  // Sa
  { id: 's6',  dayOfWeek: 5, mealType: 'mittag',     recipeId: 'r10', addedBy: 'p_lisa' },
  { id: 's7',  dayOfWeek: 5, mealType: 'abendessen', recipeId: 'r9',  addedBy: 'p_thomas' },
  // So — leer
];

export const DAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const;
export const DAY_LABELS_LONG = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'] as const;

// Aktuelle Mock-Woche: 4.–10. Mai 2026 (Woche 19)
export const WEEK_NUMBER = 19;
export const WEEK_RANGE_LABEL = '4. – 10. Mai 2026';
export const TODAY_INDEX = 4; // Freitag (Mock-"Heute" für Highlighting)

export const slotsForDay = (day: number): WeekplanSlot[] =>
  WEEKPLAN_SLOTS.filter(s => s.dayOfWeek === day);
