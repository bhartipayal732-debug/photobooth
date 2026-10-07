// Photo booth server: stores PNGs on disk, serves them, builds QR codes.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import QRCode from 'qrcode';
import { customAlphabet } from 'nanoid';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS = path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOADS, { recursive: true });

const PORT = process.env.PORT || 3001;
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // photos expire after 24h
const newId = customAlphabet('abcdefghjkmnpqrstuvwxyz23456789', 10); // short = simpler QR

// First non-internal IPv4 address, used when PUBLIC_BASE_URL isn't set.
const lanIp = () =>
  Object.values(os.networkInterfaces()).flat()
    .find((i) => (i.family === 'IPv4' || i.family === 4) && !i.internal)?.address || 'localhost';
const BASE = (process.env.PUBLIC_BASE_URL || `http://${lanIp()}:${PORT}`).replace(/\/$/, '');

// Multer: write straight to /uploads with a unique filename; PNG only, 15 MB max.
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS,
    filename: (req, _file, cb) => { req.photoId = newId(); cb(null, `${req.photoId}.png`); },
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype === 'image/png'),
});

const app = express();
app.use(cors());

// Upload a photo -> { id, url, qr } where qr is a PNG data URL.
app.post('/api/photos', upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Send a PNG in the "photo" field.' });
    const url = `${BASE}/photos/${req.photoId}.png`;
    const qr = await QRCode.toDataURL(url, { margin: 1, width: 480 });
    res.json({ id: req.photoId, url, qr });
  } catch (e) { next(e); }
});

// Serve a photo. Add ?download=1 to force a file download.
app.get('/photos/:file', (req, res) => {
  const m = /^([a-z0-9]{10})(\.png)?$/.exec(req.params.file); // blocks path traversal
  if (!m) return res.status(404).end();
  const file = path.join(UPLOADS, `${m[1]}.png`);
  if (!fs.existsSync(file)) return res.status(404).send('This photo has expired or does not exist.');
  if (req.query.download) return res.download(file, 'photobooth.png');
  res.sendFile(file);
});

// Production: serve the built React app from the same server.
const DIST = path.join(__dirname, '../client/dist');
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));
}

app.use((err, _req, res, _next) => res.status(400).json({ error: err.message }));

// Delete photos older than 24h (on boot, then hourly).
function cleanup() {
  for (const f of fs.readdirSync(UPLOADS)) {
    const p = path.join(UPLOADS, f);
    if (f.endsWith('.png') && Date.now() - fs.statSync(p).mtimeMs > MAX_AGE_MS) fs.unlink(p, () => {});
  }
}
cleanup();
setInterval(cleanup, 60 * 60 * 1000);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Photo booth server on port ${PORT}`);
  console.log(`QR codes will point to: ${BASE}/photos/<id>.png`);
});
