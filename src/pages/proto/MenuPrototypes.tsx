import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, ChefHat, ShoppingBag, ListChecks, Sparkles,
  Home, ArrowLeft, ArrowRight, Settings, ChevronRight,
} from 'lucide-react';
import './MenuPrototypes.css';

// Hook: schrumpfendes Menü beim Scrollen
function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

// ---------------------------------------------------------------------------
// Geteilte Daten — gleiche Items für alle 4 Vorschläge
// ---------------------------------------------------------------------------

type MenuItem = {
  id: string;
  label: string;
  iconCmp: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  flowStep?: number;
};

const items: MenuItem[] = [
  { id: 'heute',    label: 'Heute',    iconCmp: Home },
  { id: 'plan',     label: 'Plan',     iconCmp: Calendar,    flowStep: 1 },
  { id: 'einkauf',  label: 'Einkauf',  iconCmp: ShoppingBag, flowStep: 2 },
  { id: 'liste',    label: 'Liste',    iconCmp: ListChecks,  flowStep: 3 },
  { id: 'rezepte',  label: 'Rezepte',  iconCmp: ChefHat },
];

// Naming-Variante 2 (verbal) zum direkten Vergleich
const itemsVerbal: MenuItem[] = [
  { id: 'heute',    label: 'Heute kochen',     iconCmp: Home },
  { id: 'plan',     label: 'Woche planen',     iconCmp: Calendar,    flowStep: 1 },
  { id: 'einkauf',  label: 'Einkauf prüfen',   iconCmp: ShoppingBag, flowStep: 2 },
  { id: 'liste',    label: 'Einkaufen',        iconCmp: ListChecks,  flowStep: 3 },
  { id: 'rezepte',  label: 'Rezepte',          iconCmp: ChefHat },
];

const flowItems = items.filter(i => i.flowStep);

// ---------------------------------------------------------------------------
// Geteilter Mock-Content (damit man den Menu-Effekt im Kontext sieht)
// ---------------------------------------------------------------------------

function MockContent({ activeId, label }: { activeId: string; label: string }) {
  void activeId;
  return (
    <div className="menu-mock">
      <div className="menu-mock__header">
        <div>
          <span className="menu-mock__eyebrow">Aktuelle View</span>
          <h2>{label}</h2>
        </div>
        <Link to="/proto/menu" className="menu-mock__close">← Zurück zu Menü-Auswahl</Link>
      </div>
      <div className="menu-mock__body">
        <p className="menu-mock__note">
          Mock-Content — Klick durch die Items oben um Active-State zu sehen. Scrolle nach unten
          um den Shrink-Effekt vom Menü zu beobachten.
        </p>
        <div className="menu-mock__grid">
          {Array.from({ length: 18 }).map((_, n) => (
            <div key={n} className="menu-mock__tile">Mock-Card {n + 1}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VARIANTE A — Pill-Bar oben mit Flow-Connectoren
// ---------------------------------------------------------------------------

export function MenuPills() {
  const [active, setActive] = useState('plan');
  const activeItem = items.find(i => i.id === active)!;

  return (
    <div className="menu-page menu-page--pills">
      <header className="menu-pills">
        <div className="menu-pills__brand">
          <Sparkles size={20} strokeWidth={2} />
          <span>MealPlanner</span>
        </div>

        <nav className="menu-pills__nav">
          {items.map((item, idx) => {
            const Icon = item.iconCmp;
            const isFlow = !!item.flowStep;
            const isActive = item.id === active;
            const showConnector = isFlow && idx < items.length - 1 && items[idx + 1].flowStep;
            return (
              <span key={item.id} className="menu-pills__item-wrap">
                <button
                  className={`menu-pills__item ${isActive ? 'is-active' : ''} ${isFlow ? 'is-flow' : ''}`}
                  onClick={() => setActive(item.id)}
                >
                  <Icon size={14} strokeWidth={2} />
                  {item.label}
                </button>
                {showConnector && <span className="menu-pills__connector"><ChevronRight size={14} strokeWidth={2} /></span>}
              </span>
            );
          })}
        </nav>

        <button className="menu-pills__profile">T</button>
      </header>

      <MockContent activeId={active} label={activeItem.label} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// VARIANTE B — Sidebar links (Stitch-Style)
// ---------------------------------------------------------------------------

export function MenuSidebar() {
  const [active, setActive] = useState('plan');
  const activeItem = items.find(i => i.id === active)!;

  return (
    <div className="menu-page menu-page--sidebar">
      <aside className="menu-sidebar">
        <div className="menu-sidebar__brand">
          <span className="menu-sidebar__logo"><Sparkles size={18} strokeWidth={2.5} /></span>
          <div>
            <strong>MealPlanner</strong>
            <small>Familie Wordenbeck</small>
          </div>
        </div>

        <nav className="menu-sidebar__nav">
          {items.map(item => {
            const Icon = item.iconCmp;
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                className={`menu-sidebar__item ${isActive ? 'is-active' : ''}`}
                onClick={() => setActive(item.id)}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
                {isActive && <span className="menu-sidebar__indicator" />}
              </button>
            );
          })}
        </nav>

        <div className="menu-sidebar__bottom">
          <button className="menu-sidebar__settings">
            <Settings size={16} strokeWidth={2} />
            Einstellungen
          </button>
          <div className="menu-sidebar__profile">
            <span>T</span>
            <div>
              <strong>Thomas</strong>
              <small>KOCH-42</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="menu-page__main">
        <MockContent activeId={active} label={activeItem.label} />
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// VARIANTE C — Step-Flow mit numbered linear path
// ---------------------------------------------------------------------------

export function MenuFlow() {
  const [active, setActive] = useState('plan');
  const activeItem = items.find(i => i.id === active)!;

  return (
    <div className="menu-page menu-page--flow">
      <header className="menu-flow">
        <button
          className={`menu-flow__heute ${active === 'heute' ? 'is-active' : ''}`}
          onClick={() => setActive('heute')}
        >
          <Home size={14} strokeWidth={2} />
          Heute
        </button>

        <div className="menu-flow__sep" />

        <div className="menu-flow__steps">
          {flowItems.map((item, idx) => {
            const Icon = item.iconCmp;
            const isActive = item.id === active;
            const passedActive = flowItems.findIndex(i => i.id === active);
            const isPassed = passedActive > idx;
            return (
              <span key={item.id} className="menu-flow__step-wrap">
                <button
                  className={`menu-flow__step ${isActive ? 'is-active' : ''} ${isPassed ? 'is-done' : ''}`}
                  onClick={() => setActive(item.id)}
                >
                  <span className="menu-flow__num">{isPassed ? '✓' : item.flowStep}</span>
                  <Icon size={13} strokeWidth={2} />
                  <span>{item.label}</span>
                </button>
                {idx < flowItems.length - 1 && (
                  <span className={`menu-flow__line ${passedActive > idx ? 'is-passed' : ''}`} />
                )}
              </span>
            );
          })}
        </div>

        <div className="menu-flow__sep" />

        <button
          className={`menu-flow__rezepte ${active === 'rezepte' ? 'is-active' : ''}`}
          onClick={() => setActive('rezepte')}
        >
          <ChefHat size={14} strokeWidth={2} />
          Rezepte
        </button>
      </header>

      <MockContent activeId={active} label={activeItem.label} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// VARIANTE D — Floating Pill-Bar oben (zentriert, schwebend, transparent)
// ---------------------------------------------------------------------------

export function MenuFloating() {
  const [active, setActive] = useState('plan');
  const activeItem = items.find(i => i.id === active)!;

  return (
    <div className="menu-page menu-page--floating">
      <div className="menu-floating-bg" />

      <nav className="menu-floating">
        {items.map(item => {
          const Icon = item.iconCmp;
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              className={`menu-floating__item ${isActive ? 'is-active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              <Icon size={16} strokeWidth={2} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <span className="menu-floating__sep" />
        <button className="menu-floating__profile">
          <span>T</span>
        </button>
      </nav>

      <MockContent activeId={active} label={activeItem.label} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// VARIANTE E — Verbal Naming (gleicher Pill-Stil aber lange Labels)
// ---------------------------------------------------------------------------

export function MenuVerbal() {
  const [active, setActive] = useState('plan');
  const scrolled = useScrolled(40);
  const activeItem = itemsVerbal.find(i => i.id === active)!;

  return (
    <div className="menu-page menu-page--verbal">
      <header className={`menu-verbal ${scrolled ? 'is-compact' : ''}`}>
        <div className="menu-verbal__brand">
          <span className="menu-verbal__logo"><Sparkles size={18} strokeWidth={2.5} /></span>
          <span className="menu-verbal__brand-name">Mahlzeit</span>
        </div>

        <nav className="menu-verbal__nav">
          {itemsVerbal.map((item, idx) => {
            const Icon = item.iconCmp;
            const isFlow = !!item.flowStep;
            const isActive = item.id === active;
            const showConnector = isFlow && idx < itemsVerbal.length - 1 && itemsVerbal[idx + 1].flowStep;
            return (
              <span key={item.id} className="menu-verbal__item-wrap">
                <button
                  className={`menu-verbal__item ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActive(item.id)}
                >
                  <Icon size={14} strokeWidth={2} />
                  <span className="menu-verbal__label">{item.label}</span>
                </button>
                {showConnector && (
                  <span className="menu-verbal__connector">
                    <ChevronRight size={14} strokeWidth={2} />
                  </span>
                )}
              </span>
            );
          })}
        </nav>

        <button className="menu-verbal__profile">T</button>
      </header>

      <MockContent activeId={active} label={activeItem.label} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// VARIANTE FINAL — E (verbal) + C (Process-Chain) + Logo "Mahlzeit"
// ---------------------------------------------------------------------------

const itemsFinal = [
  { id: 'heute',    label: 'Heute kochen',     iconCmp: Home,        flowStep: undefined as number | undefined },
  { id: 'plan',     label: 'Woche planen',     iconCmp: Calendar,    flowStep: 1 },
  { id: 'einkauf',  label: 'Einkauf prüfen',   iconCmp: ShoppingBag, flowStep: 2 },
  { id: 'liste',    label: 'Einkaufen',        iconCmp: ListChecks,  flowStep: 3 },
  { id: 'rezepte',  label: 'Rezepte',          iconCmp: ChefHat,     flowStep: undefined },
];

const flowFinal = itemsFinal.filter(i => i.flowStep);
const findFlowIdx = (id: string) => flowFinal.findIndex(i => i.id === id);

export function MenuFinal() {
  const [active, setActive] = useState('plan');
  const activeItem = itemsFinal.find(i => i.id === active)!;
  const activeFlowIdx = findFlowIdx(active);

  return (
    <div className="menu-page menu-page--final">
      <header className="menu-final">
        <div className="menu-final__brand">
          <span className="menu-final__logo"><Sparkles size={18} strokeWidth={2.5} /></span>
          <span className="menu-final__brand-name">Mahlzeit</span>
        </div>

        <span className="menu-final__divider" />

        {/* Heute kochen — abgesetzter Anker */}
        <button
          className={`menu-final__item ${active === 'heute' ? 'is-active' : ''}`}
          onClick={() => setActive('heute')}
        >
          <Home size={14} strokeWidth={2} />
          Heute kochen
        </button>

        <span className="menu-final__divider" />

        {/* Process-Chain: Plan → Einkauf → Liste mit Done-State */}
        <nav className="menu-final__chain">
          {flowFinal.map((item, idx) => {
            const Icon = item.iconCmp;
            const isActive = item.id === active;
            const isPassed = activeFlowIdx > idx;
            return (
              <span key={item.id} className="menu-final__chain-wrap">
                <button
                  className={`menu-final__item menu-final__chain-item ${isActive ? 'is-active' : ''} ${isPassed ? 'is-done' : ''}`}
                  onClick={() => setActive(item.id)}
                >
                  <span className="menu-final__chain-num">
                    {isPassed ? '✓' : item.flowStep}
                  </span>
                  <Icon size={14} strokeWidth={2} />
                  {item.label}
                </button>
                {idx < flowFinal.length - 1 && (
                  <span className={`menu-final__chain-line ${activeFlowIdx > idx ? 'is-passed' : ''}`}>
                    <ChevronRight size={14} strokeWidth={2} />
                  </span>
                )}
              </span>
            );
          })}
        </nav>

        <span className="menu-final__divider" />

        {/* Rezepte — abgesetzter Endpunkt */}
        <button
          className={`menu-final__item ${active === 'rezepte' ? 'is-active' : ''}`}
          onClick={() => setActive('rezepte')}
        >
          <ChefHat size={14} strokeWidth={2} />
          Rezepte
        </button>

        <span className="menu-final__spacer" />

        <button className="menu-final__profile">T</button>
      </header>

      <MockContent activeId={active} label={activeItem.label} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// MENU INDEX — Übersicht der Vorschläge mit Live-Preview-Tiles
// ---------------------------------------------------------------------------

const menuVariants = [
  {
    to: '/proto/menu/final',
    title: '★ Final · E + C Kombi',
    subtitle: 'Empfohlen',
    desc: 'Logo „Mahlzeit" links. Heute kochen + Rezepte als abgesetzte Anker. Prozesskette in der Mitte: Woche planen → Einkauf prüfen → Einkaufen mit Done-Häkchen.',
    pros: ['hochwertig', 'klare Aufgaben-Verbalisierung', 'Wochenflow + Status sichtbar'],
    cons: ['braucht horizontalen Platz (iPad ≥ 1024px)'],
  },
  {
    to: '/proto/menu/pills',
    title: 'A · Pill-Bar oben',
    subtitle: 'Empfohlen',
    desc: 'Horizontale Pills mit Flow-Connectoren (Plan ▸ Einkauf ▸ Liste). Heute links als Anker, Rezepte rechts. Modern, ein-Ebene, scanbar.',
    pros: ['Wochenflow visuell links→rechts', 'kompakt', 'gut auf iPad-Landscape'],
    cons: ['eng auf iPhone', 'Connectoren wackelig wenn Labels lang'],
  },
  {
    to: '/proto/menu/sidebar',
    title: 'B · Sidebar links',
    subtitle: 'Stitch-Stil',
    desc: 'Schmale linke Sidebar mit Icon + Label. Klassisches iPad-Pattern (Things 3, Notes). Viel Mainspace nach rechts.',
    pros: ['viel Mainspace', 'iPad-nativ', 'Profile + Settings finden Platz unten'],
    cons: ['kein Flow-Gefühl von links→rechts', 'frisst 200px Breite'],
  },
  {
    to: '/proto/menu/flow',
    title: 'C · Step-Flow',
    subtitle: 'Wizard-Style',
    desc: 'Linearer Flow mit Nummern + Verbindungslinien. Erzählt die Story der Woche: Plan → Einkauf → Liste. Heute + Rezepte als Trenn-Buttons seitlich.',
    pros: ['storytelling, klare Reihenfolge', 'Progress-Gefühl'],
    cons: ['kann starr wirken', 'out-of-order-Navigation fühlt sich „falsch" an'],
  },
  {
    to: '/proto/menu/floating',
    title: 'D · Floating Pill-Bar',
    subtitle: 'Mit Backdrop-Blur',
    desc: 'Wie A, aber als schwebende halbtransparente Pill-Bar (vgl. iOS Glass-UI). Inhalt scrollt darunter durch, Bar bleibt sichtbar.',
    pros: ['premium-feel', 'nimmt minimal Platz', 'Content-Hintergrund kann grünstichig sein'],
    cons: ['weniger gut über bunten Inhalten', 'Backdrop-Filter braucht moderne Browser'],
  },
  {
    to: '/proto/menu/verbal',
    title: 'E · Verbale Labels',
    subtitle: 'Naming-Vergleich',
    desc: 'Gleiche Pill-Bar wie A, aber mit langen verbalen Labels („Woche planen", „Einkauf prüfen", „Einkaufen"). Direkter Naming-Vergleich.',
    pros: ['Aktion klar erkennbar', 'für Erstnutzer freundlicher'],
    cons: ['frisst horizontalen Platz', 'auf iPhone definitiv zu lang'],
  },
];

export function MenuIndex() {
  return (
    <div className="menu-index">
      <header className="menu-index__header">
        <Link to="/" className="menu-index__back">
          <ArrowLeft size={14} strokeWidth={2} /> Zurück
        </Link>
        <h1>Menü-Vorschläge</h1>
        <p>
          Fünf klickbare Demos. Pro Variante: einfache Mock-Content-Page rechts/unten,
          interaktives Menü oben/links. Klick die Items durch um die Active-States zu fühlen.
        </p>
      </header>

      <ul className="menu-index__grid">
        {menuVariants.map(v => (
          <li key={v.to}>
            <Link to={v.to} className="menu-index__tile">
              <div className="menu-index__tile-head">
                <span className="menu-index__tile-eyebrow">{v.subtitle}</span>
                <h3>{v.title}</h3>
              </div>
              <p className="menu-index__tile-desc">{v.desc}</p>
              <div className="menu-index__tile-pros-cons">
                <div>
                  <strong>+</strong>
                  <ul>{v.pros.map(p => <li key={p}>{p}</li>)}</ul>
                </div>
                <div>
                  <strong>−</strong>
                  <ul>{v.cons.map(c => <li key={c}>{c}</li>)}</ul>
                </div>
              </div>
              <span className="menu-index__tile-cta">Demo öffnen <ArrowRight size={14} strokeWidth={2} /></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
