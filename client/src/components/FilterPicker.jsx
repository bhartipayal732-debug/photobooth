import { FILTERS } from '../constants';

// Each swatch is a colourful gradient with the filter applied, so the effect is visible.
export default function FilterPicker({ value, onChange }) {
  return (
    <div className="filters" role="radiogroup" aria-label="Filter">
      {FILTERS.map((f) => (
        <button key={f.id} role="radio" aria-checked={value === f.id}
          className={'flt' + (value === f.id ? ' on' : '')} onClick={() => onChange(f.id)}>
          <i style={{ filter: f.css }} />
          <span>{f.name}</span>
        </button>
      ))}
    </div>
  );
}
