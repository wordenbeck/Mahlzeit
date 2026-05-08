import './BoardB.css';
import { ProtoChrome } from './ProtoChrome';
import { RecipeCard } from '../../components/RecipeCard';
import { DaySlot, AddSlotButton } from '../../components/DaySlot';
import {
  RECIPES,
  DAY_LABELS_LONG,
  WEEK_NUMBER,
  WEEK_RANGE_LABEL,
  TODAY_INDEX,
  slotsForDay,
} from '../../mocks/recipes';
import { ProfileDot } from '../../components/ProfileDot';

const dates = ['4.5', '5.5', '6.5', '7.5', '8.5', '9.5', '10.5'];

export function BoardB() {
  return (
    <>
      <ProtoChrome current="/proto/board-b" />
      <div className="board-b">
        <header className="board-b__hero">
          <div className="board-b__hero-inner">
            <div>
              <span className="board-b__eyebrow">Wochenplan · Familie Wordenbeck</span>
              <h1 className="board-b__title">Woche {WEEK_NUMBER}</h1>
              <p className="board-b__subtitle">{WEEK_RANGE_LABEL}</p>
            </div>
            <div className="board-b__hero-actions">
              <button className="board-b__pill">◀ Vorherige</button>
              <button className="board-b__pill">Nächste ▶</button>
              <button className="board-b__cta">✨ Magic Fill</button>
              <ProfileDot profileId="p_thomas" size={32} />
            </div>
          </div>
        </header>

        <div className="board-b__split">
          <aside className="board-b__days">
            {DAY_LABELS_LONG.map((label, i) => {
              const isToday = i === TODAY_INDEX;
              const slots = slotsForDay(i);
              return (
                <section
                  key={label}
                  className={`board-b__day ${isToday ? 'is-today' : ''}`}
                >
                  <header className="board-b__day-header">
                    <span className="board-b__day-name">{label}</span>
                    <span className="board-b__day-date">{dates[i]}</span>
                    {isToday && <span className="board-b__today-pill">Heute</span>}
                  </header>
                  <div className="board-b__day-slots">
                    {slots.map(s => <DaySlot key={s.id} slot={s} />)}
                    <AddSlotButton />
                  </div>
                </section>
              );
            })}
          </aside>

          <main className="board-b__grid-area">
            <div className="board-b__toolbar">
              <h2 className="board-b__section">Rezepte</h2>
              <div className="board-b__toolbar-spacer" />
              <input className="board-b__search" placeholder="🔍 Suchen…" />
              <button className="board-b__filter-pill is-active">Alle</button>
              <button className="board-b__filter-pill">Vegan</button>
              <button className="board-b__filter-pill">Schnell</button>
              <button className="board-b__cta board-b__cta--small">＋ Neu</button>
            </div>
            <div className="board-b__grid">
              {RECIPES.map(r => (
                <RecipeCard key={r.id} recipe={r} variant="image-heavy" />
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
