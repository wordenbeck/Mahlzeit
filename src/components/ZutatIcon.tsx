// Zutaten-Icon-Set basierend auf Lucide-Line-Icons.
// Symbolisch (nicht fotorealistisch), passt zum Design der App.
//
// Mapping: Keyword in Zutat-Name → Lucide-Icon.
// Wenn nichts matched → UtensilsCrossed (Standard-Koch-Symbol).
//
// Custom-SVG-Inlines für Sachen die Lucide nicht hat (Käse, Knoblauch, Pilz, Kartoffel).

import type { LucideIcon } from 'lucide-react';
import {
  Beef, Drumstick, Fish, Egg, Milk, Apple, Banana, Cherry, Grape, Citrus,
  Carrot, Salad, Wheat, Sandwich, Pizza, Croissant, Soup, Cookie, Donut,
  Leaf, Flame, Droplet, Nut, Sprout, UtensilsCrossed, IceCream,
} from 'lucide-react';
import './ZutatIcon.css';

// Custom-SVG-Components für fehlende Lucide-Icons (im selben Stil: 24x24, stroke=2, line-icon)
type SVGProps = { size?: number; strokeWidth?: number };

const CheeseIcon: LucideIcon = ((props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? 24} height={props.size ?? 24}
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={(props.strokeWidth as number) ?? 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17 L21 17 L17 7 L3 17 Z" />
    <circle cx="8" cy="14" r="0.8" />
    <circle cx="12" cy="12" r="0.8" />
    <circle cx="15" cy="14" r="0.8" />
  </svg>
)) as unknown as LucideIcon;

const GarlicIcon: LucideIcon = ((props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? 24} height={props.size ?? 24}
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={(props.strokeWidth as number) ?? 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4 L12 7 M8 6 L10 8 M16 6 L14 8" />
    <path d="M6 14 a6 6 0 0 0 12 0 c0 -3 -2 -6 -6 -6 s-6 3 -6 6 z" />
    <path d="M10 11 v8 M14 11 v8" />
  </svg>
)) as unknown as LucideIcon;

const MushroomIcon: LucideIcon = ((props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? 24} height={props.size ?? 24}
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={(props.strokeWidth as number) ?? 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12 a8 6 0 0 1 16 0 H4 z" />
    <path d="M9 12 v6 a3 2 0 0 0 6 0 v-6" />
  </svg>
)) as unknown as LucideIcon;

const PotatoIcon: LucideIcon = ((props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? 24} height={props.size ?? 24}
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={(props.strokeWidth as number) ?? 2} strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(-15 12 12)" />
    <circle cx="9" cy="11" r="0.6" />
    <circle cx="14" cy="13" r="0.6" />
  </svg>
)) as unknown as LucideIcon;

const TomatoIcon: LucideIcon = ((props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? 24} height={props.size ?? 24}
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={(props.strokeWidth as number) ?? 2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="14" r="7" />
    <path d="M9 7 L12 4 L15 7 M12 4 v3" />
  </svg>
)) as unknown as LucideIcon;

const PepperIcon: LucideIcon = ((props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? 24} height={props.size ?? 24}
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={(props.strokeWidth as number) ?? 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 5 v3 a5 5 0 1 1 -8 6 c0 -5 5 -9 8 -9 z" />
    <path d="M14 5 L17 3" />
  </svg>
)) as unknown as LucideIcon;

const OnionIcon: LucideIcon = ((props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? 24} height={props.size ?? 24}
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={(props.strokeWidth as number) ?? 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 14 c0 -4 3 -8 7 -8 s7 4 7 8 a7 6 0 0 1 -14 0 z" />
    <path d="M10 5 L12 2 L14 5" />
    <path d="M9 8 v8 M15 8 v8" />
  </svg>
)) as unknown as LucideIcon;

const PastaIcon: LucideIcon = ((props: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size ?? 24} height={props.size ?? 24}
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={(props.strokeWidth as number) ?? 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17 c2 -3 4 -3 6 0 s4 3 6 0 s4 -3 6 0" />
    <path d="M3 12 c2 -3 4 -3 6 0 s4 3 6 0 s4 -3 6 0" />
  </svg>
)) as unknown as LucideIcon;

type MapEntry = { keyword: string; Icon: LucideIcon };

const MAP: MapEntry[] = [
  // Proteine
  { keyword: 'hackfleisch',  Icon: Beef },
  { keyword: 'rind',         Icon: Beef },
  { keyword: 'schwein',      Icon: Beef },
  { keyword: 'lamm',         Icon: Beef },
  { keyword: 'schnitzel',    Icon: Beef },
  { keyword: 'speck',        Icon: Beef },
  { keyword: 'schinken',     Icon: Beef },
  { keyword: 'hähnchen',     Icon: Drumstick },
  { keyword: 'haehnchen',    Icon: Drumstick },
  { keyword: 'huhn',         Icon: Drumstick },
  { keyword: 'pute',         Icon: Drumstick },
  { keyword: 'fisch',        Icon: Fish },
  { keyword: 'lachs',        Icon: Fish },
  { keyword: 'thunfisch',    Icon: Fish },
  { keyword: 'garnele',      Icon: Fish },
  { keyword: 'shrimp',       Icon: Fish },
  { keyword: 'wurst',        Icon: Beef },
  { keyword: 'salami',       Icon: Beef },
  { keyword: 'ei',           Icon: Egg },
  { keyword: 'tofu',         Icon: Sandwich },

  // Milchprodukte
  { keyword: 'milch',        Icon: Milk },
  { keyword: 'sahne',        Icon: Milk },
  { keyword: 'joghurt',      Icon: Milk },
  { keyword: 'quark',        Icon: Milk },
  { keyword: 'butter',       Icon: Milk },
  { keyword: 'käse',         Icon: CheeseIcon },
  { keyword: 'kaese',        Icon: CheeseIcon },
  { keyword: 'mozzarella',   Icon: CheeseIcon },
  { keyword: 'parmesan',     Icon: CheeseIcon },
  { keyword: 'feta',         Icon: CheeseIcon },
  { keyword: 'gouda',        Icon: CheeseIcon },
  { keyword: 'frischkäse',   Icon: CheeseIcon },

  // Gemüse
  { keyword: 'tomate',       Icon: TomatoIcon },
  { keyword: 'cherrytomate', Icon: TomatoIcon },
  { keyword: 'gurke',        Icon: Salad },
  { keyword: 'paprika',      Icon: PepperIcon },
  { keyword: 'karotte',      Icon: Carrot },
  { keyword: 'möhre',        Icon: Carrot },
  { keyword: 'kartoffel',    Icon: PotatoIcon },
  { keyword: 'süßkartoffel', Icon: PotatoIcon },
  { keyword: 'zwiebel',      Icon: OnionIcon },
  { keyword: 'lauch',        Icon: OnionIcon },
  { keyword: 'knoblauch',    Icon: GarlicIcon },
  { keyword: 'sellerie',     Icon: Leaf },
  { keyword: 'spinat',       Icon: Leaf },
  { keyword: 'salat',        Icon: Salad },
  { keyword: 'rucola',       Icon: Leaf },
  { keyword: 'kohl',         Icon: Salad },
  { keyword: 'brokkoli',     Icon: Sprout },
  { keyword: 'blumenkohl',   Icon: Sprout },
  { keyword: 'aubergine',    Icon: Sprout },
  { keyword: 'zucchini',     Icon: Sprout },
  { keyword: 'champignon',   Icon: MushroomIcon },
  { keyword: 'pilz',         Icon: MushroomIcon },
  { keyword: 'mais',         Icon: Wheat },
  { keyword: 'erbse',        Icon: Sprout },
  { keyword: 'kichererbse',  Icon: Sprout },
  { keyword: 'bohne',        Icon: Sprout },
  { keyword: 'linse',        Icon: Sprout },
  { keyword: 'avocado',      Icon: Apple },
  { keyword: 'oliven',       Icon: Cherry },
  { keyword: 'ingwer',       Icon: Sprout },
  { keyword: 'chili',        Icon: Flame },

  // Obst
  { keyword: 'apfel',        Icon: Apple },
  { keyword: 'banane',       Icon: Banana },
  { keyword: 'orange',       Icon: Citrus },
  { keyword: 'zitrone',      Icon: Citrus },
  { keyword: 'limette',      Icon: Citrus },
  { keyword: 'erdbeere',     Icon: Cherry },
  { keyword: 'himbeere',     Icon: Cherry },
  { keyword: 'beere',        Icon: Cherry },
  { keyword: 'kirsche',      Icon: Cherry },
  { keyword: 'mango',        Icon: Apple },
  { keyword: 'ananas',       Icon: Apple },
  { keyword: 'traube',       Icon: Grape },
  { keyword: 'birne',        Icon: Apple },
  { keyword: 'pfirsich',     Icon: Apple },

  // Kohlenhydrate
  { keyword: 'brot',         Icon: Sandwich },
  { keyword: 'baguette',     Icon: Croissant },
  { keyword: 'brötchen',     Icon: Croissant },
  { keyword: 'toast',        Icon: Sandwich },
  { keyword: 'reis',         Icon: Wheat },
  { keyword: 'basmati',      Icon: Wheat },
  { keyword: 'nudeln',       Icon: PastaIcon },
  { keyword: 'pasta',        Icon: PastaIcon },
  { keyword: 'spaghetti',    Icon: PastaIcon },
  { keyword: 'lasagne',      Icon: PastaIcon },
  { keyword: 'quinoa',       Icon: Wheat },
  { keyword: 'couscous',     Icon: Wheat },
  { keyword: 'haferflocken', Icon: Wheat },
  { keyword: 'mehl',         Icon: Wheat },
  { keyword: 'pizzateig',    Icon: Pizza },
  { keyword: 'pizza',        Icon: Pizza },

  // Sonstiges
  { keyword: 'suppe',        Icon: Soup },
  { keyword: 'brühe',        Icon: Soup },
  { keyword: 'salz',         Icon: Droplet },
  { keyword: 'pfeffer',      Icon: Flame },
  { keyword: 'zucker',       Icon: Cookie },
  { keyword: 'honig',        Icon: Droplet },
  { keyword: 'öl',           Icon: Droplet },
  { keyword: 'oel',          Icon: Droplet },
  { keyword: 'olivenöl',     Icon: Droplet },
  { keyword: 'essig',        Icon: Droplet },
  { keyword: 'sojasauce',    Icon: Droplet },
  { keyword: 'soja',         Icon: Droplet },
  { keyword: 'tomatensoße',  Icon: TomatoIcon },
  { keyword: 'currypaste',   Icon: Flame },
  { keyword: 'curry',        Icon: Flame },
  { keyword: 'kokosmilch',   Icon: Milk },
  { keyword: 'kokos',        Icon: Nut },
  { keyword: 'nuss',         Icon: Nut },
  { keyword: 'mandel',       Icon: Nut },
  { keyword: 'schokolade',   Icon: Cookie },
  { keyword: 'kakao',        Icon: Cookie },
  { keyword: 'eis',          Icon: IceCream },
  { keyword: 'donut',        Icon: Donut },

  // Kräuter
  { keyword: 'basilikum',    Icon: Leaf },
  { keyword: 'petersilie',   Icon: Leaf },
  { keyword: 'koriander',    Icon: Leaf },
  { keyword: 'minze',        Icon: Leaf },
  { keyword: 'thymian',      Icon: Leaf },
  { keyword: 'rosmarin',     Icon: Leaf },
  { keyword: 'oregano',      Icon: Leaf },
  { keyword: 'kräuter',      Icon: Leaf },
  { keyword: 'chiliflocken', Icon: Flame },
  { keyword: 'paniermehl',   Icon: Wheat },
];

function pickIcon(name: string): LucideIcon {
  const lower = name.toLowerCase();
  for (const { keyword, Icon } of MAP) {
    if (lower.includes(keyword)) return Icon;
  }
  return UtensilsCrossed;
}

type Props = {
  name: string;
  size?: number;
};

export function ZutatIcon({ name, size = 18 }: Props) {
  const Icon = pickIcon(name);
  return (
    <span className="zutat-icon" aria-hidden>
      <Icon size={size} strokeWidth={1.75} />
    </span>
  );
}
