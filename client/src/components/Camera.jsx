import { useEffect, useRef, useState } from 'react';
import { FILTERS } from '../constants';
import FilterPicker from './FilterPicker';
import Timer, { Countdown } from './Timer';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Short synthesized click, so no audio file is needed.
function shutterSound() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'square';
    o.frequency.value = 1200;
    g.gain.setValueAtTime(0.15, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
    o.connect(g); g.connect(ac.destination);
    o.start(); o.stop(ac.currentTime + 0.09);
  } catch { /* sound is optional */ }
}

export default function Camera({ template, timer, setTimer, filterId, setFilterId, onDone, onBack }) {
  const video = useRef(null);
  const alive = useRef(true);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(null);
  const [shot, setShot] = useState(0);
  const [flash, setFlash] = useState(false);
  const [sound, setSound] = useState(true);
  const filter = FILTERS.find((f) => f.id === filterId);
  const [, , w, h] = template.slots[0];

  // Start the webcam; always release it on unmount.
  useEffect(() => {
    alive.current = true;
    let stream;
    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('This page can\u2019t use the camera. Open the app on localhost or over HTTPS.');
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false,
        });
        if (!alive.current) { stream.getTracks().forEach((t) => t.stop()); return; }
        video.current.srcObject = stream;
        setReady(true);
      } catch (e) {
        setError(
          e.name === 'NotAllowedError' ? 'Camera access is blocked. Allow it in your browser\u2019s address bar, then reload.'
          : e.name === 'NotFoundError' ? 'No camera found. Plug one in and try again.'
          : 'The camera couldn\u2019t start. Close other apps using it and try again.');
      }
    })();
    return () => { alive.current = false; stream?.getTracks().forEach((t) => t.stop()); };
  }, []);

  // Copy the current video frame into a mirrored canvas (matches the selfie preview).
  const grab = () => {
    const v = video.current;
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext('2d');
    ctx.translate(c.width, 0); ctx.scale(-1, 1);
    ctx.drawImage(v, 0, 0);
    return c;
  };

  // Runs the whole sequence: countdown -> flash -> grab, repeated for each shot.
  async function run() {
    if (running) return;
    setRunning(true);
    const frames = [];
    for (let i = 0; i < template.shots; i++) {
      setShot(i + 1);
      for (let s = timer; s > 0; s--) { setCount(s); await sleep(1000); if (!alive.current) return; }
      setCount(null);
      if (sound) shutterSound();
      frames.push(grab());
      setFlash(true); setTimeout(() => setFlash(false), 250);
      if (i < template.shots - 1) await sleep(1400); // pause so people can re-pose
      if (!alive.current) return;
    }
    setRunning(false);
    onDone(frames);
  }

  if (error) {
    return (
      <section className="err">
        <h2>Camera unavailable</h2>
        <p>{error}</p>
        <button className="btn" onClick={onBack}>Back</button>
      </section>
    );
  }

  return (
    <section className="cam">
      <div className="bar">
        <button className="ghost" onClick={onBack} disabled={running}>Back</button>
        <Timer value={timer} onChange={setTimer} disabled={running} />
        <button className="ghost" aria-pressed={sound} onClick={() => setSound((s) => !s)}>
          Sound {sound ? 'on' : 'off'}
        </button>
      </div>
      <div className="viewfinder" style={{ '--ar': w / h, aspectRatio: w / h }}>
        <video ref={video} autoPlay playsInline muted style={{ filter: filter.css }} />
        <Countdown n={count} />
        {running && <div className="badge">Photo {shot} of {template.shots}</div>}
        {flash && <div className="flash" />}
      </div>
      <FilterPicker value={filterId} onChange={setFilterId} />
      <button className="shutter" onClick={run} disabled={!ready || running}>Capture</button>
    </section>
  );
}
