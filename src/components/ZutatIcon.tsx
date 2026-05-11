// Zutat → Emoji-Mapping. Pragmatischer Ansatz à la Bring:
// statt eigenes Icon-Set bauen wir auf Emoji auf (zero Asset-Pflege,
// universell verständlich). Wenn später ein eigenes Set kommt,
// tauschen wir hier zentral aus.

import './ZutatIcon.css';

// Tabelle: Keyword → Emoji. Häufige deutsche Zutaten zuerst.
// Matching: case-insensitive substring auf zutaten-name.
const MAP: { keyword: string; emoji: string }[] = [
  // Proteine
  { keyword: 'hackfleisch',  emoji: '🥩' },
  { keyword: 'rind',         emoji: '🥩' },
  { keyword: 'schwein',      emoji: '🥩' },
  { keyword: 'lamm',         emoji: '🥩' },
  { keyword: 'schnitzel',    emoji: '🍖' },
  { keyword: 'hähnchen',     emoji: '🍗' },
  { keyword: 'huhn',         emoji: '🍗' },
  { keyword: 'pute',         emoji: '🍗' },
  { keyword: 'speck',        emoji: '🥓' },
  { keyword: 'wurst',        emoji: '🌭' },
  { keyword: 'salami',       emoji: '🍕' },
  { keyword: 'schinken',     emoji: '🥓' },
  { keyword: 'fisch',        emoji: '🐟' },
  { keyword: 'lachs',        emoji: '🐟' },
  { keyword: 'thunfisch',    emoji: '🐟' },
  { keyword: 'garnele',      emoji: '🦐' },
  { keyword: 'shrimp',       emoji: '🦐' },
  { keyword: 'ei',           emoji: '🥚' },
  { keyword: 'tofu',         emoji: '🧈' },

  // Milchprodukte
  { keyword: 'milch',        emoji: '🥛' },
  { keyword: 'butter',       emoji: '🧈' },
  { keyword: 'käse',         emoji: '🧀' },
  { keyword: 'mozzarella',   emoji: '🧀' },
  { keyword: 'parmesan',     emoji: '🧀' },
  { keyword: 'feta',         emoji: '🧀' },
  { keyword: 'gouda',        emoji: '🧀' },
  { keyword: 'frischkäse',   emoji: '🧀' },
  { keyword: 'sahne',        emoji: '🥛' },
  { keyword: 'joghurt',      emoji: '🥛' },
  { keyword: 'quark',        emoji: '🥛' },

  // Gemüse
  { keyword: 'tomate',       emoji: '🍅' },
  { keyword: 'cherrytomate', emoji: '🍅' },
  { keyword: 'gurke',        emoji: '🥒' },
  { keyword: 'paprika',      emoji: '🫑' },
  { keyword: 'karotte',      emoji: '🥕' },
  { keyword: 'möhre',        emoji: '🥕' },
  { keyword: 'kartoffel',    emoji: '🥔' },
  { keyword: 'süßkartoffel', emoji: '🍠' },
  { keyword: 'zwiebel',      emoji: '🧅' },
  { keyword: 'knoblauch',    emoji: '🧄' },
  { keyword: 'lauch',        emoji: '🧅' },
  { keyword: 'sellerie',     emoji: '🥬' },
  { keyword: 'spinat',       emoji: '🥬' },
  { keyword: 'salat',        emoji: '🥬' },
  { keyword: 'rucola',       emoji: '🥬' },
  { keyword: 'kohl',         emoji: '🥬' },
  { keyword: 'brokkoli',     emoji: '🥦' },
  { keyword: 'blumenkohl',   emoji: '🥦' },
  { keyword: 'aubergine',    emoji: '🍆' },
  { keyword: 'zucchini',     emoji: '🥒' },
  { keyword: 'champignon',   emoji: '🍄' },
  { keyword: 'pilz',         emoji: '🍄' },
  { keyword: 'mais',         emoji: '🌽' },
  { keyword: 'erbse',        emoji: '🟢' },
  { keyword: 'bohne',        emoji: '🫘' },
  { keyword: 'kichererbse',  emoji: '🫘' },
  { keyword: 'linse',        emoji: '🫘' },
  { keyword: 'avocado',      emoji: '🥑' },
  { keyword: 'oliven',       emoji: '🫒' },
  { keyword: 'ingwer',       emoji: '🫚' },
  { keyword: 'chili',        emoji: '🌶' },

  // Obst
  { keyword: 'apfel',        emoji: '🍎' },
  { keyword: 'banane',       emoji: '🍌' },
  { keyword: 'orange',       emoji: '🍊' },
  { keyword: 'zitrone',      emoji: '🍋' },
  { keyword: 'limette',      emoji: '🍋' },
  { keyword: 'erdbeere',     emoji: '🍓' },
  { keyword: 'himbeere',     emoji: '🍓' },
  { keyword: 'beere',        emoji: '🫐' },
  { keyword: 'mango',        emoji: '🥭' },
  { keyword: 'ananas',       emoji: '🍍' },
  { keyword: 'traube',       emoji: '🍇' },
  { keyword: 'birne',        emoji: '🍐' },
  { keyword: 'pfirsich',     emoji: '🍑' },
  { keyword: 'kirsche',      emoji: '🍒' },

  // Kohlenhydrate
  { keyword: 'brot',         emoji: '🍞' },
  { keyword: 'baguette',     emoji: '🥖' },
  { keyword: 'brötchen',     emoji: '🥖' },
  { keyword: 'toast',        emoji: '🍞' },
  { keyword: 'reis',         emoji: '🍚' },
  { keyword: 'nudeln',       emoji: '🍝' },
  { keyword: 'pasta',        emoji: '🍝' },
  { keyword: 'spaghetti',    emoji: '🍝' },
  { keyword: 'lasagne',      emoji: '🍝' },
  { keyword: 'quinoa',       emoji: '🌾' },
  { keyword: 'couscous',     emoji: '🌾' },
  { keyword: 'haferflocken', emoji: '🌾' },
  { keyword: 'mehl',         emoji: '🌾' },
  { keyword: 'pizzateig',    emoji: '🍕' },
  { keyword: 'teig',         emoji: '🥐' },
  { keyword: 'tortilla',     emoji: '🌯' },

  // Gewürze / Sonstiges
  { keyword: 'salz',         emoji: '🧂' },
  { keyword: 'pfeffer',      emoji: '🌶' },
  { keyword: 'zucker',       emoji: '🍬' },
  { keyword: 'honig',        emoji: '🍯' },
  { keyword: 'öl',           emoji: '🫒' },
  { keyword: 'olivenöl',     emoji: '🫒' },
  { keyword: 'essig',        emoji: '🧴' },
  { keyword: 'sojasauce',    emoji: '🧴' },
  { keyword: 'soja',         emoji: '🧴' },
  { keyword: 'currypaste',   emoji: '🍛' },
  { keyword: 'curry',        emoji: '🍛' },
  { keyword: 'kokosmilch',   emoji: '🥥' },
  { keyword: 'kokos',        emoji: '🥥' },
  { keyword: 'nuss',         emoji: '🌰' },
  { keyword: 'mandel',       emoji: '🌰' },
  { keyword: 'schokolade',   emoji: '🍫' },
  { keyword: 'kakao',        emoji: '🍫' },
  { keyword: 'kaffee',       emoji: '☕' },
  { keyword: 'tee',          emoji: '🍵' },

  // Kräuter
  { keyword: 'basilikum',    emoji: '🌿' },
  { keyword: 'petersilie',   emoji: '🌿' },
  { keyword: 'koriander',    emoji: '🌿' },
  { keyword: 'minze',        emoji: '🌿' },
  { keyword: 'thymian',      emoji: '🌿' },
  { keyword: 'rosmarin',     emoji: '🌿' },
  { keyword: 'oregano',      emoji: '🌿' },
  { keyword: 'kräuter',      emoji: '🌿' },
];

export function zutatEmoji(name: string): string {
  const lower = name.toLowerCase();
  for (const { keyword, emoji } of MAP) {
    if (lower.includes(keyword)) return emoji;
  }
  return '🥘'; // Fallback: Kochtopf
}

type Props = {
  name: string;
  size?: number;
};

export function ZutatIcon({ name, size = 24 }: Props) {
  return (
    <span
      className="zutat-icon"
      style={{ fontSize: size, lineHeight: 1 }}
      aria-hidden
    >
      {zutatEmoji(name)}
    </span>
  );
}
