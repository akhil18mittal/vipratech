// The homepage's moving parts: the headline typing itself in, the review queue cycling through sample rows, and the
// leakage calculator. All three start from complete HTML, so the page works the same with JavaScript off.

import {QUEUE_ROWS, type QueueRow} from '../data/home';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DIGITS = '0123456789';

/** Types the headline in, one character at a time, with a digit flickering just ahead. Space is kept for every
 * character from the start, so the layout does not move. */
function typeHeadline() {
  const headline = document.querySelector<HTMLElement>('[data-typed-headline]');
  if (!headline || reducedMotion) return;
  const lines = [...headline.querySelectorAll<HTMLElement>('[data-typed-line]')];
  headline.setAttribute('aria-label', lines.map((line) => line.textContent?.trim()).join(' '));
  const chars: HTMLSpanElement[] = [];
  for (const line of lines) {
    const text = line.textContent?.trim() ?? '';
    line.textContent = '';
    line.setAttribute('aria-hidden', 'true');
    for (const char of text) {
      const span = document.createElement('span');
      span.className = 'vt-char';
      span.textContent = char;
      span.dataset.char = char;
      line.append(span);
      chars.push(span);
    }
  }
  headline.dataset.typing = '';
  const cursor = document.createElement('span');
  cursor.className = 'vt-cursor inline-block ml-1 font-mono font-bold text-lime-400';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = '█';
  let index = 0;
  const step = () => {
    if (index > 0) {
      const previous = chars[index - 1];
      previous.textContent = previous.dataset.char ?? '';
    }
    if (index >= chars.length) {
      setTimeout(() => cursor.remove(), 1600);
      return;
    }
    const current = chars[index];
    current.classList.add('vt-shown');
    if (current.dataset.char !== ' ') current.textContent = DIGITS[Math.floor(Math.random() * DIGITS.length)];
    current.after(cursor);
    index += 1;
    setTimeout(step, 26 + Math.random() * 14);
  };
  step();
}

const TONE: Record<QueueRow['tone'], string> = {held: 'text-amber-300', dispute: 'text-sky-300', ok: 'text-lime-400'};

function rowElement(row: QueueRow) {
  const li = document.createElement('li');
  li.className = 'vt-row-in p-3 bg-zinc-950/90 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-3';
  li.innerHTML = `
    <span class="min-w-0">
      <span class="text-[10px] text-zinc-500 font-bold block"></span>
      <span class="text-xs text-white font-medium block truncate"></span>
    </span>
    <span class="text-right flex-shrink-0">
      <span class="text-[10px] font-bold block ${TONE[row.tone]}"></span>
      <span class="text-[9px] text-zinc-500 block"></span>
    </span>`;
  const [type, text, status, confidence] = li.querySelectorAll('span span');
  type.textContent = `[${row.type}]`;
  text.textContent = row.text;
  status.textContent = row.status;
  confidence.textContent = row.confidence;
  return li;
}

/** Adds the next sample row at the top of the queue every three seconds and drops the oldest. */
function cycleQueue() {
  const list = document.querySelector<HTMLElement>('[data-queue]');
  if (!list || reducedMotion) return;
  let next = list.children.length;
  setInterval(() => {
    if (document.hidden) return;
    list.prepend(rowElement(QUEUE_ROWS[next % QUEUE_ROWS.length]));
    next += 1;
    while (list.children.length > 4) list.lastElementChild?.remove();
  }, 3000);
}

/** Recalculates the leakage figures whenever an input changes. */
function calculator() {
  const root = document.querySelector<HTMLElement>('[data-calculator]');
  if (!root) return;
  const value = (name: string) => {
    const input = root.querySelector<HTMLInputElement>(`input[name="${name}"]`);
    const number = Number(input?.value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  };
  const atRisk = root.querySelector('[data-out="atRisk"]');
  const hours = root.querySelector('[data-out="hours"]');
  const update = () => {
    const year = value('monthlyLakh') * 100000 * (value('invalidPct') / 100) * 12;
    const hoursPerMonth = (value('lines') * value('minutesPerLine')) / 60;
    if (atRisk) atRisk.textContent = `₹${Math.round(year).toLocaleString('en-IN')}`;
    if (hours) hours.textContent = `${Math.round(hoursPerMonth).toLocaleString('en-IN')} hours`;
  };
  root.addEventListener('input', update);
  update();
}

typeHeadline();
cycleQueue();
calculator();
