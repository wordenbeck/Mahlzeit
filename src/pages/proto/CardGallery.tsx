import './CardGallery.css';
import { ProtoChrome } from './ProtoChrome';
import { RecipeCard, type RecipeCardVariant } from '../../components/RecipeCard';
import { RECIPES } from '../../mocks/recipes';

const variants: { id: RecipeCardVariant; title: string; desc: string }[] = [
  { id: 'classic',     title: 'Classic',     desc: 'Bild 4:3 oben, Titel + Meta unten, Profile-Dot rechts. Ausgewogen, gut für Grids.' },
  { id: 'minimal',     title: 'Minimal',     desc: 'Quadratisches Bild, wenig Chrome, kein Card-Background. Funktioniert in dichten Grids.' },
  { id: 'image-heavy', title: 'Image-Heavy', desc: 'Vollflächiges Bild 3:4, Titel + Meta als Overlay. Visuell stark, weniger Info.' },
  { id: 'list',        title: 'List',        desc: 'Horizontaler Layout, 64px Thumb. Dicht, gut für Suchergebnisse oder Wochenplan-Detail.' },
];

export function CardGallery() {
  const sample = RECIPES.slice(0, 6);

  return (
    <>
      <ProtoChrome current="/proto/cards" />
      <div className="card-gallery">
        <header className="card-gallery__header">
          <h1>Recipe Card · 4 Varianten</h1>
          <p>Alle teilen Tokens und Daten — Unterschied liegt nur im Layout. Welche Variante fühlt sich richtig für die Hauptansicht an?</p>
        </header>

        {variants.map(v => (
          <section key={v.id} className="card-gallery__section">
            <header className="card-gallery__section-header">
              <h2>{v.title}</h2>
              <p>{v.desc}</p>
            </header>
            <div className={`card-gallery__row card-gallery__row--${v.id}`}>
              {sample.map(r => (
                <RecipeCard key={r.id} recipe={r} variant={v.id} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
