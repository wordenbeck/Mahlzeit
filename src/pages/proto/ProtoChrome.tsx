import { Link } from 'react-router-dom';
import './ProtoChrome.css';

type Props = {
  current: string;
};

const groups: { label: string; links: { to: string; label: string }[] }[] = [
  {
    label: 'Index',
    links: [{ to: '/', label: 'Übersicht' }],
  },
  {
    label: 'Aktiv',
    links: [
      { to: '/proto/board-a', label: 'Plan (Board A)' },
      { to: '/proto/woche-z', label: 'Woche ⭐' },
      { to: '/proto/woche-z/einkaufen', label: 'Einkaufsliste' },
      { to: '/proto/menu', label: 'Menü-Demos' },
    ],
  },
  {
    label: 'Archiv',
    links: [
      { to: '/proto/board-b', label: 'Board B' },
      { to: '/proto/board-c', label: 'Board C' },
      { to: '/proto/woche-x', label: 'Woche X' },
      { to: '/proto/woche-y', label: 'Woche Y' },
      { to: '/proto/cards', label: 'Cards' },
      { to: '/proto/phone', label: 'Phone' },
    ],
  },
];

export function ProtoChrome({ current }: Props) {
  return (
    <nav className="proto-chrome" aria-label="Prototype Navigation">
      {groups.map((group, gi) => (
        <span key={group.label} className={`proto-chrome__group proto-chrome__group--${group.label.toLowerCase()}`}>
          {group.links.map(l => {
            const isActive = current === l.to ||
              (l.to === '/proto/woche-y' && current === '/proto/woche-y/liste') ||
              (l.to === '/proto/woche-z' && current === '/proto/woche-z');
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`proto-chrome__link ${isActive ? 'is-active' : ''}`}
              >
                {l.label}
              </Link>
            );
          })}
          {gi < groups.length - 1 && <span className="proto-chrome__divider" />}
        </span>
      ))}
    </nav>
  );
}
