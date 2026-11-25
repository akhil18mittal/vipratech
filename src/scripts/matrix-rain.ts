// The Matrix rain behind every page: falling digits and the letters of VIPRATECH in lime, with a white glowing head on
// each stream. It draws on the fixed <canvas id="matrix-rain"> from BaseLayout.astro at about 30 frames a second,
// pauses while the tab is hidden, and does nothing for visitors who ask for reduced motion.

const CHARS = '012345678901234567890123456789VIPRATECH0123456789CLAIMS0123456789'.split('');
const LIME = '#a3e635';
const HEAD = '#ffffff';
const FONT_SIZE = 13;
const FRAME_MS = 33;

function start(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) return;
  const ctx = context;
  const density = window.innerWidth < 640 ? 26 : 22;
  let drops: number[] = [];
  let frame = 0;
  let last = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const columns = Math.ceil(window.innerWidth / density) + 1;
    drops = Array.from({length: columns}, (_, i) => drops[i] ?? Math.random() * -100);
  };

  const pick = () => CHARS[Math.floor(Math.random() * CHARS.length)];

  const draw = (time: number) => {
    frame = requestAnimationFrame(draw);
    if (time - last < FRAME_MS) return;
    last = time;
    ctx.fillStyle = 'rgba(9, 9, 11, 0.1)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.font = `${FONT_SIZE}px ui-monospace, monospace`;
    for (let i = 0; i < drops.length; i++) {
      const x = i * density;
      const y = drops[i] * FONT_SIZE;
      ctx.fillStyle = HEAD;
      ctx.shadowColor = LIME;
      ctx.shadowBlur = 8;
      ctx.fillText(pick(), x, y);
      ctx.shadowBlur = 0;
      ctx.fillStyle = LIME;
      ctx.fillText(pick(), x, y - FONT_SIZE);
      if (y > window.innerHeight && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.55;
    }
  };

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frame);
    if (!document.hidden) frame = requestAnimationFrame(draw);
  });
  frame = requestAnimationFrame(draw);
}

const canvas = document.getElementById('matrix-rain');
if (canvas instanceof HTMLCanvasElement && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) start(canvas);
