// 3-Diamond-Mark, passt zum Favicon. Rendert nur die Diamanten in weiß —
// emerald-Hintergrund kommt vom umschließenden Container (z.B. .app-menu__logo).

type Props = { size?: number };

export function MahlzeitLogo({ size = 18 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M16 32L28 20L40 32L28 44L16 32Z" fill="currentColor" />
      <path d="M36 32L48 20L60 32L48 44L36 32Z" fill="currentColor" fillOpacity="0.3" />
      <path d="M26 32L38 20L50 32L38 44L26 32Z" fill="currentColor" fillOpacity="0.6" />
    </svg>
  );
}
