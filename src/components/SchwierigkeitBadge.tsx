import { ChefHat } from 'lucide-react';
import type { Schwierigkeit } from '../mocks/recipes';
import './SchwierigkeitBadge.css';

const labels: Record<Schwierigkeit, string> = {
  einfach: 'einfach',
  mittel: 'mittel',
  aufwendig: 'aufwendig',
};

type Props = {
  schwierigkeit: Schwierigkeit;
  size?: number;
  showLabel?: boolean;
};

export function SchwierigkeitBadge({ schwierigkeit, size = 14, showLabel = true }: Props) {
  return (
    <span className="schwierigkeit-badge" aria-label={`Schwierigkeit ${labels[schwierigkeit]}`}>
      <ChefHat size={size} strokeWidth={1.75} />
      {showLabel && <span className="schwierigkeit-badge__label">{labels[schwierigkeit]}</span>}
    </span>
  );
}
