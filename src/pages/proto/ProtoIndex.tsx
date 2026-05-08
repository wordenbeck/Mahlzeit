import { Link } from 'react-router-dom';
import './ProtoIndex.css';

type Tile = { to: string; title: string; subtitle: string; desc: string; status?: string };
type Section = { title: string; subtitle: string; tone?: 'active' | 'archive'; tiles: Tile[] };

const sections: Section[] = [
  {
    title: 'Aktiv — das hier bauen wir',
    subtitle: 'Sprint-1-Kandidaten. Layout & Flow durchgewunken.',
    tone: 'active',
    tiles: [
      { to: '/proto/board-a', title: 'Plan-Board', subtitle: 'Planungsmodus', desc: '25/75 Split. Mo–Fr immer sichtbar, Wochenende per Toggle. Header ◀ Datum ▶. List-Card als Default + Classic-Toggle.', status: 'iteriert' },
      { to: '/proto/woche-z', title: 'Wochenübersicht', subtitle: 'Z = Gewinner', desc: '5 Tage horizontal nebeneinander, pro Tag 1–2 Rezepte mit Zutaten + Mengen-Edit, Day-Pills für Wiedererkennung. → Einkaufstüte.', status: 'empfohlen' },
      { to: '/proto/woche-z/einkaufen', title: 'Einkaufsliste', subtitle: 'Konsolidiert', desc: 'Zutaten zusammengeführt, Day-Pills zeigen Herkunft, Extras manuell ergänzbar, Bring-Export-Mock.' },
      { to: '/proto/menu', title: 'Menü-Demos', subtitle: '5 Vorschläge', desc: 'Klickbare App-Menü-Prototypen: Pill-Bar / Sidebar / Step-Flow / Floating / Verbal-Naming. Jede Demo mit interaktivem Active-State.', status: 'neu' },
    ],
  },
  {
    title: 'Archiv — alte Varianten',
    subtitle: 'Erreichbar zum Vergleich, fließen aber nicht in Sprint 1.',
    tone: 'archive',
    tiles: [
      { to: '/proto/board-b', title: 'Board B', subtitle: 'Magazine-bold', desc: '30/70 Split mit großem Akzent-Header und image-heavy Cards.' },
      { to: '/proto/board-c', title: 'Board C', subtitle: 'Tage horizontal', desc: 'Tage als Pill-Strip oben. Eher iPhone-feeling.' },
      { to: '/proto/woche-x', title: 'Woche X', subtitle: 'Inline-Liste', desc: 'Tag-Strip links + Tag-Detail Mitte + Einkaufsliste als Slide-Out rechts.' },
      { to: '/proto/woche-y', title: 'Woche Y', subtitle: 'Sequentiell', desc: 'Tag für Tag durchblättern → Einkaufsliste auf separater Route.' },
      { to: '/proto/cards', title: 'Card Gallery', subtitle: '4 Varianten', desc: 'Recipe-Card classic / minimal / image-heavy / list mit Chef-Hat-Schwierigkeit.' },
      { to: '/proto/phone', title: 'Phone Sketch', subtitle: 'iPhone (deprio)', desc: 'iPhone-Mock mit Tabs + Bottom-Sheet. Kommt nach iPad-MVP.' },
    ],
  },
];

export function ProtoIndex() {
  return (
    <div className="proto-index">
      <header className="proto-index__header">
        <h1>MealPlanner — Sprint 0 Prototypen</h1>
        <p>
          Statische Mockups mit Mock-Daten. „Aktiv" ist der gewählte Build-Pfad,
          „Archiv" sind ausgeschlagene Alternativen — bleibt zugreifbar, falls wir doch nochmal vergleichen wollen.
        </p>
      </header>

      {sections.map(section => (
        <section key={section.title} className={`proto-index__section proto-index__section--${section.tone}`}>
          <header className="proto-index__section-header">
            <h2>{section.title}</h2>
            <p>{section.subtitle}</p>
          </header>
          <ul className="proto-index__grid">
            {section.tiles.map(t => (
              <li key={t.to}>
                <Link to={t.to} className="proto-index__tile">
                  <span className="proto-index__tile-eyebrow">{t.subtitle}</span>
                  <span className="proto-index__tile-title">{t.title}</span>
                  <span className="proto-index__tile-desc">{t.desc}</span>
                  <span className="proto-index__tile-bottom">
                    {t.status && (
                      <span className={`proto-index__status proto-index__status--${t.status === 'empfohlen' ? 'rec' : 'iter'}`}>
                        {t.status}
                      </span>
                    )}
                    <span className="proto-index__tile-arrow">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
