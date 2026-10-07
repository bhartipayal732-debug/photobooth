const OPTIONS = [{ v: 0, l: 'Off' }, { v: 3, l: '3s' }, { v: 5, l: '5s' }, { v: 10, l: '10s' }];

// Countdown length selector.
export default function Timer({ value, onChange, disabled }) {
  return (
    <div className="chips" role="radiogroup" aria-label="Timer">
      <span>Timer</span>
      {OPTIONS.map((o) => (
        <button key={o.v} role="radio" aria-checked={value === o.v} disabled={disabled}
          onClick={() => onChange(o.v)}>{o.l}</button>
      ))}
    </div>
  );
}

// Big number over the viewfinder. `key` restarts the CSS animation on every tick.
export function Countdown({ n }) {
  return n ? <div className="count" key={n} aria-live="assertive">{n}</div> : null;
}
