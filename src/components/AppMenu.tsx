import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Calendar, ChefHat, ShoppingBag, ListChecks, Home, ChevronRight, Users,
} from 'lucide-react';
import './AppMenu.css';
import { useAuth } from '../lib/auth';
import { MahlzeitLogo } from './MahlzeitLogo';

const items: { id: string; to: string; label: string; icon: typeof Home; flowStep?: number }[] = [
  { id: 'heute',   to: '/',          label: 'Heute kochen',   icon: Home },
  { id: 'plan',    to: '/plan',      label: 'Woche planen',   icon: Calendar,    flowStep: 1 },
  { id: 'einkauf', to: '/einkauf',   label: 'Einkauf prüfen', icon: ShoppingBag, flowStep: 2 },
  { id: 'liste',   to: '/liste',     label: 'Einkaufen',      icon: ListChecks,  flowStep: 3 },
  { id: 'rezepte', to: '/rezepte',   label: 'Rezepte',        icon: ChefHat },
];

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return scrolled;
}

export function AppMenu() {
  const auth = useAuth();
  const location = useLocation();
  const compact = useScrolled(40);

  const initial = auth.profile?.display_name?.[0]?.toUpperCase() ?? '?';
  const profileColor = auth.profile?.color ?? '--profile-amber';

  return (
    <header className={`app-menu ${compact ? 'is-compact' : ''}`}>
      <Link to="/" className="app-menu__brand">
        <span className="app-menu__logo"><MahlzeitLogo size={18} /></span>
        <span className="app-menu__brand-name">Mahlzeit</span>
      </Link>

      <nav className="app-menu__nav">
        {items.map((item, idx) => {
          const isActive = location.pathname === item.to;
          const isFlow = !!item.flowStep;
          const showConnector = isFlow && idx < items.length - 1 && items[idx + 1].flowStep;
          const Icon = item.icon;
          return (
            <span key={item.id} className="app-menu__item-wrap">
              <Link
                to={item.to}
                className={`app-menu__item ${isActive ? 'is-active' : ''}`}
              >
                <Icon size={14} strokeWidth={2} />
                <span className="app-menu__label">{item.label}</span>
              </Link>
              {showConnector && (
                <span className="app-menu__connector">
                  <ChevronRight size={14} strokeWidth={2} />
                </span>
              )}
            </span>
          );
        })}
      </nav>

      <div className="app-menu__right">
        <Link
          to="/workspace"
          className="app-menu__icon-link"
          aria-label="Haushalt"
          title="Haushalt-Einstellungen"
        >
          <Users size={16} />
        </Link>
        <Link
          to="/profil"
          className="app-menu__profile"
          style={{ background: `var(${profileColor})` }}
          aria-label={auth.profile?.display_name ?? 'Profil'}
        >
          {initial}
        </Link>
      </div>
    </header>
  );
}
