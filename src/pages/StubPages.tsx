// Platzhalter-Seiten für die App-Routes. Bekommen in Sprint 2-5 echte Inhalte.
// Aktuell zeigen sie nur die App-Shell + Hinweis dass Feature noch nicht da ist.

import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './StubPages.css';

type StubProps = {
  title: string;
  eyebrow: string;
  description: string;
  comingIn: string;
  protoLink?: string;
};

function Stub({ title, eyebrow, description, comingIn, protoLink }: StubProps) {
  return (
    <div className="stub">
      <div className="stub__inner">
        <span className="stub__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="stub__desc">{description}</p>
        <div className="stub__meta">
          <span className="stub__sprint">Geplant in: {comingIn}</span>
          {protoLink && (
            <Link to={protoLink} className="stub__proto-link">
              Sprint-0-Prototyp ansehen <ArrowRight size={14} strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export const HeuteStub = () => (
  <Stub
    title="Heute kochen"
    eyebrow="Mahlzeit · Heute"
    description="Was steht heute auf dem Plan? Diese View zeigt das aktuelle Tagesgericht mit Zutaten und Zubereitung."
    comingIn="Sprint 5"
  />
);

export const PlanStub = () => (
  <Stub
    title="Woche planen"
    eyebrow="Mahlzeit · Plan"
    description="Wochenplan zusammenstellen — links die Tage, rechts deine Rezeptsammlung. Drag & Drop von Rezepten in Tage."
    comingIn="Sprint 4"
    protoLink="/proto/board-a"
  />
);

export const EinkaufPruefenStub = () => (
  <Stub
    title="Einkauf prüfen"
    eyebrow="Mahlzeit · Übersicht"
    description="Wochenübersicht: Mengen pro Rezept anpassen, Zutaten editieren, dann zur Einkaufsliste."
    comingIn="Sprint 4"
    protoLink="/proto/woche-z"
  />
);

export const EinkaufenStub = () => (
  <Stub
    title="Einkaufen"
    eyebrow="Mahlzeit · Liste"
    description="Konsolidierte Einkaufsliste mit Day-Pills, Extras, abhakbar. Export an Bring."
    comingIn="Sprint 4 (UI) · Sprint 6 (Bring-Echtintegration)"
    protoLink="/proto/woche-z/einkaufen"
  />
);

export const RezepteStub = () => (
  <Stub
    title="Rezepte"
    eyebrow="Mahlzeit · Sammlung"
    description="Grid mit allen Rezepten, Suche, Filter, Favoriten. Neue Rezepte importieren oder generieren."
    comingIn="Sprint 2 (Import) · Sprint 3 (Grid)"
  />
);
