import { useEffect, useState } from 'react';
import { compose } from '../compose';
import FilterPicker from './FilterPicker';

// Shows the composed result. Re-composes whenever filter or caption changes.
export default function Review({ frames, template, filter, filterId, setFilterId, caption, setCaption,
  saving, error, onRetake, onSave }) {
  const [url, setUrl] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let dead = false;
    compose(frames, template, filter.css, caption).then((c) => { if (!dead) setUrl(c.toDataURL('image/png')); });
    return () => { dead = true; };
  }, [frames, template, filter, caption]);

  return (
    <section className="rev">
      {url ? <img src={url} alt="Your photo" /> : <p>Developing…</p>}
      {template.caption && (
        <input className="cap" value={caption} maxLength={28} aria-label="Caption"
          onChange={(e) => setCaption(e.target.value)} />
      )}
      {showFilters && <FilterPicker value={filterId} onChange={setFilterId} />}
      {error && <p className="msg" role="alert">{error}</p>}
      <div className="bar">
        <button className="btn alt" onClick={onRetake} disabled={saving}>Retake</button>
        <button className="btn alt" onClick={() => setShowFilters((s) => !s)}>Change filter</button>
        <button className="btn" onClick={() => onSave(url)} disabled={!url || saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </section>
  );
}
