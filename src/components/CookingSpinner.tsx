import './CookingSpinner.css';

type Props = {
  size?: number;
  label?: string;
};

export function CookingSpinner({ size = 64, label }: Props) {
  return (
    <div className="cooking-spinner" role="status" aria-label={label ?? 'Lade'}>
      <div
        className="cooking-spinner__pot"
        style={{ width: size, height: size }}
      >
        <span className="cooking-spinner__steam cooking-spinner__steam--1">·</span>
        <span className="cooking-spinner__steam cooking-spinner__steam--2">·</span>
        <span className="cooking-spinner__steam cooking-spinner__steam--3">·</span>
        <div className="cooking-spinner__spoon" />
      </div>
      {label && <p className="cooking-spinner__label">{label}</p>}
    </div>
  );
}
