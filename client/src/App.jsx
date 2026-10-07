import { useState } from 'react';
import { TEMPLATES, FILTERS } from './constants';
import TemplateSelector from './components/TemplateSelector';
import Camera from './components/Camera';
import Review from './components/Review';
import QRResult from './components/QRResult';

const SCREENS = ['start', 'camera', 'review', 'result'];
const LABELS = ['Layout', 'Camera', 'Review', 'Share'];
const DEFAULT_CAPTION = 'Best day ever';

export default function App() {
  const [screen, setScreen] = useState('start');
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [timer, setTimer] = useState(3);
  const [filterId, setFilterId] = useState('original');
  const [frames, setFrames] = useState([]);
  const [caption, setCaption] = useState(DEFAULT_CAPTION);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const filter = FILTERS.find((f) => f.id === filterId);

  // Upload the composed PNG; the server answers with a public URL + QR code.
  async function save(dataUrl) {
    setSaving(true); setError('');
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const body = new FormData();
      body.append('photo', blob, 'photo.png');
      const res = await fetch('/api/photos', { method: 'POST', body });
      if (!res.ok) throw new Error();
      setResult({ ...(await res.json()), dataUrl });
      setScreen('result');
    } catch {
      setError('Couldn\u2019t save your photo. Check that the server is running, then try again.');
    } finally { setSaving(false); }
  }

  function restart() {
    setFrames([]); setResult(null); setFilterId('original'); setCaption(DEFAULT_CAPTION); setScreen('start');
  }

  return (
    <main className="app">
      <ol className="steps">
        {LABELS.map((l, i) => <li key={l} className={i === SCREENS.indexOf(screen) ? 'on' : ''}>{l}</li>)}
      </ol>

      {screen === 'start' && (
        <section className="start">
          <div className="hero">
            <div className="strip" aria-hidden="true"><b /><b /><b /><b /></div>
            <div>
              <h1>Say<br />cheese</h1>
              <p>Pick a layout, strike a pose, then scan the code to keep your photo.</p>
            </div>
          </div>
          <TemplateSelector value={template} onChange={setTemplate} />
          <button className="btn" onClick={() => setScreen('camera')}>Start</button>
        </section>
      )}

      {screen === 'camera' && (
        <Camera template={template} timer={timer} setTimer={setTimer} filterId={filterId} setFilterId={setFilterId}
          onBack={() => setScreen('start')}
          onDone={(f) => { setFrames(f); setScreen('review'); }} />
      )}

      {screen === 'review' && (
        <Review frames={frames} template={template} filter={filter} filterId={filterId} setFilterId={setFilterId}
          caption={caption} setCaption={setCaption} saving={saving} error={error}
          onRetake={() => { setError(''); setScreen('camera'); }} onSave={save} />
      )}

      {screen === 'result' && <QRResult result={result} onRestart={restart} />}
    </main>
  );
}
