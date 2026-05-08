import './DayPill.css';

const dayShort = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const dayLong = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const dayBgVar = ['--day-mo-bg', '--day-di-bg', '--day-mi-bg', '--day-do-bg', '--day-fr-bg', '--day-sa-bg', '--day-so-bg'];
const dayFgVar = ['--day-mo-fg', '--day-di-fg', '--day-mi-fg', '--day-do-fg', '--day-fr-fg', '--day-sa-fg', '--day-so-fg'];

type Props = {
  dayOfWeek: number;     // 0–6 (Mo=0)
  size?: 'sm' | 'md';
};

export function DayPill({ dayOfWeek, size = 'sm' }: Props) {
  const i = Math.max(0, Math.min(6, dayOfWeek));
  return (
    <span
      className={`day-pill day-pill--${size}`}
      style={{
        background: `var(${dayBgVar[i]})`,
        color: `var(${dayFgVar[i]})`,
      }}
      title={dayLong[i]}
    >
      {dayShort[i]}
    </span>
  );
}
