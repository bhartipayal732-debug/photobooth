// Draws captured frames into the chosen template and returns a canvas.
// frames: canvases (already mirrored). Filter is applied here, so it can change after capture.
export async function compose(frames, t, filterCss = 'none', caption = '') {
  // Make sure web fonts are ready before drawing text on the canvas.
  await Promise.all([document.fonts.load('600 44px Fredoka'), document.fonts.load('88px Caveat')]);

  const c = document.createElement('canvas');
  c.width = t.W;
  c.height = t.H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = t.bg;
  ctx.fillRect(0, 0, t.W, t.H);

  t.slots.forEach(([x, y, w, h], i) => {
    const img = frames[i];
    if (!img) return;
    ctx.save();
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, 18); else ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.filter = filterCss; // ignored by browsers without ctx.filter (e.g. Safari)
    // "Cover" crop: fill the slot without stretching the photo.
    const r = Math.min(img.width / w, img.height / h);
    const sw = w * r, sh = h * r;
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
    ctx.restore(); // also resets the filter so text below isn't filtered
  });

  ctx.textAlign = 'center';
  if (t.id === 'strip') {
    ctx.fillStyle = '#ffcf33';
    ctx.font = '600 44px Fredoka, sans-serif';
    ctx.fillText(new Date().toLocaleDateString(), t.W / 2, t.H - 50);
  }
  if (t.caption) {
    ctx.fillStyle = '#2b2540';
    ctx.font = '88px Caveat, cursive';
    ctx.fillText(caption, t.W / 2, 1090, t.W - 120);
  }
  return c;
}
