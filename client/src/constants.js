// Layouts. slots = [x, y, w, h] in pixels on the final canvas (W x H).
const stripSlots = [0, 1, 2, 3].map((i) => [60, 60 + i * 390, 480, 360]);

export const TEMPLATES = [
  { id: 'single',   name: 'Framed',      shots: 1, W: 1200, H: 1200, bg: '#ff6b9a', slots: [[60, 60, 1080, 1080]] },
  { id: 'strip',    name: 'Photo strip', shots: 4, W: 600,  H: 1740, bg: '#1d1a3a', slots: stripSlots },
  { id: 'grid',     name: '2×2 grid',    shots: 4, W: 1210, H: 1210, bg: '#ffffff',
    slots: [[50, 50, 540, 540], [620, 50, 540, 540], [50, 620, 540, 540], [620, 620, 540, 540]] },
  { id: 'polaroid', name: 'Polaroid',    shots: 1, W: 1000, H: 1200, bg: '#ffffff', caption: true, slots: [[60, 60, 880, 880]] },
];

// One CSS filter string is used for the live preview AND baked in with ctx.filter.
export const FILTERS = [
  { id: 'original', name: 'Original',      css: 'none' },
  { id: 'bw',       name: 'Black & white', css: 'grayscale(1) contrast(1.1)' },
  { id: 'sepia',    name: 'Sepia',         css: 'sepia(0.9) contrast(1.05)' },
  { id: 'vintage',  name: 'Vintage',       css: 'sepia(0.35) saturate(1.3) contrast(0.9) brightness(1.08) hue-rotate(-8deg)' },
  { id: 'cool',     name: 'Cool',          css: 'saturate(1.1) hue-rotate(18deg) brightness(1.04)' },
  { id: 'glow',     name: 'Soft glow',     css: 'brightness(1.12) contrast(0.88) saturate(1.2) blur(0.8px)' },
];
