import { TEMPLATES } from '../constants';

// Tiny SVG preview drawn from the template's own slot data.
function Thumb({ t }) {
  const colors = ['#6ee7c8', '#ffcf33', '#ff6b9a', '#8fb6ff'];
  return (
    <svg className="thumb" viewBox={`0 0 ${t.W} ${t.H}`} aria-hidden="true">
      <rect width={t.W} height={t.H} rx="30" fill={t.bg} />
      {t.slots.map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="16" fill={colors[i % 4]} />
      ))}
    </svg>
  );
}

export default function TemplateSelector({ value, onChange }) {
  return (
    <div className="tpls" role="radiogroup" aria-label="Photo layout">
      {TEMPLATES.map((t) => (
        <button key={t.id} role="radio" aria-checked={value.id === t.id}
          className={'tpl' + (value.id === t.id ? ' on' : '')} onClick={() => onChange(t)}>
          <Thumb t={t} />
          <span>{t.name}</span>
          <small>{t.shots === 1 ? '1 photo' : `${t.shots} photos`}</small>
        </button>
      ))}
    </div>
  );
}
