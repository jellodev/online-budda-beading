const W = 420;
const H = 820;
const TOTAL = 108;
const ANCHOR = { x: W / 2, y: 54 };
const SEGMENTS = 36;
const NEEDLE_LEN = 34;
const BEAD_R = 4;
const SPACING = 6;
const TARGET_R = 13;
const BASE_LEN = 430;
const LEN_PER_BEAD = 6;
const EASY_UNTIL = 10;
const SAFE_DEPTH = 0.6;
const SAFE_DEPTH_LATE = 0.72;
const TIMED_FRAMES = 8 * 60;
const WARN_FRAMES = 2 * 60;
const FADE_FRAMES = 20;
const HOLD_DIST = 40;
const ROPE_G = 0.32;
const BEAD_G = 0.22;
const MU_S = 0.29;
const MU_K = 0.14;
const BEAD_DAMP = 0.96;
const BEAD_VMAX = 4;
const STEP = 1 / 60;
const SAVE_KEY = 'yeomju108.save';
const BEST_KEY = 'yeomju108.best';
const MUTE_KEY = 'yeomju108.muted';
const TOLD_KEY = 'yeomju108.told';

const MODES = {
  easy: { label: '쉬움', base: 0, weight: 1, grip: 1, timedFrom: 90, darkFrom: Infinity, oneWay: 0, decoy: 0, roam: 0, cat: false },
  normal: { label: '보통', base: 0.35, weight: 1, grip: 1, timedFrom: 90, darkFrom: Infinity, oneWay: 0, decoy: 0, roam: 0, cat: true },
  hard: { label: '어려움', base: 0.6, weight: 1.5, grip: 0.75, timedFrom: 54, darkFrom: 54, oneWay: 0.5, decoy: 0.4, roam: 0.4, cat: true },
};
const MODE_KEYS = Object.keys(MODES);

const CHAPTERS = [
  { at: 0, top: '#141a2e', bottom: '#3a2e45' },
  { at: 27, top: '#1f2d2e', bottom: '#5c5b48' },
  { at: 54, top: '#2e1820', bottom: '#94493a' },
  { at: 81, top: '#07080d', bottom: '#1d1830' },
];

const MILESTONES = {
  10: '열 알. 이제 알이 돌기 시작합니다. 세상도 원래 돌고 있었습니다.',
  20: '스무 알. 어디선가 염불 소리가 들려옵니다.',
  27: '사분의 일. 아직 81번뇌가 남았습니다.',
  40: '마흔 알. 친구는 몇 알이었을까요. 방금 그 생각이 번뇌 하나입니다.',
  54: '반. 여기서 그만두는 것도 깨달음일 수 있습니다.',
  70: '일흔 알. 남보다 빨리 꿰려는 마음이 바늘을 가장 많이 흔듭니다.',
  81: '사분의 삼. 실이 무거워졌다면, 그건 기분 탓이 아닙니다.',
  90: '아흔 알. 열여덟 번뇌 남았습니다.',
  100: '여덟 알. 지금 떨구면 정말 웃길 것 같습니다.',
};

const TIMED_QUOTE = '이제 알도 오래 기다려 주지 않습니다.';
const DARK_QUOTE = '이제 촛불 하나에 의지할 시간입니다.';
const CANDLE_R = 120;
const REVEAL_FRAMES = 60;
const WIND_WARN = 90;
const WIND_GUST = 150;
const WIND_FORCE = 0.2;
const WIND_TELL = '산바람이 붑니다. 나뭇잎이 날리면 바늘을 단단히 잡으세요.';
const CAT_FRAMES = 100;
const CAT_HIT = 45;
const CAT_PUSH = 5;
const CAT_TELL = '절 고양이가 놀러 왔습니다. 실을 아주 좋아합니다.';
const ONE_WAY_TELL = '화살표가 있는 알은 그 방향으로만 꿰어집니다.';
const DECOY_TELL = '붉은 알은 번뇌 알입니다. 꿰면 꿴 알이 빠집니다.';
const DECOY_COST = 5;
const DECOY_QUOTES = [
  '번뇌를 꿰었습니다. 번뇌가 번뇌를 밀어냈습니다.',
  '붉은 건 피하라고 했잖아요. 마음속으로.',
  '욕심도 알처럼 생겼습니다.',
];
const BEAD_COLORS = ['#c98a52', '#7a4523', '#2c160a'];
const DECOY_COLORS = ['#e0604a', '#8a1c16', '#2a0606'];
const IDLE_FRAMES = 60 * 60;
const IDLE_QUOTE = '명상 중이신가요? 번뇌도 얌전히 기다리고 있습니다.';
const DROPS_EGG = '떨군 알도 108개. 바닥에 염주가 하나 더 생겼습니다.';
const KNOCK_R = 12;
const KNOCKS = [
  '그건 그냥 고리입니다. 깨달음은 거기 없습니다.',
  '두드린다고 열리지 않습니다. 문이 아니라서.',
  '고리도 번뇌가 있습니다. 방금 하나 늘었고요.',
];
const FLAWLESS = {
  easy: '한 알도 안 떨구다니. 다음엔 보통으로 오세요. 부처님도 그러셨을 겁니다.',
  normal: '한 알도 안 떨구다니. 혹시 전생에 염주 장인이셨나요?',
  hard: '어려움에서 한 알도 안 떨구다니. 이건 수행이 아니라 기적입니다.',
};

const LAMENT_SMALL = [
  '번뇌가 하나 늘었습니다.',
  '떨어진 알도 다 인연입니다.',
  '중력은 자비가 없습니다.',
  '집착을 내려놓으라 했지, 염주를 내려놓으란 말은 아니었는데.',
  '지금 이 순간에 집중하세요. 방금 그 순간 말고.',
  '참는 것도 수행입니다.',
  '남의 염주 알은 세지 마세요. 내 것도 벅찹니다.',
  '1등도 결국 한 알씩 꿰었습니다.',
];
const LAMENT_MID = [
  '괜찮습니다. 모든 것은 공(空)입니다. 특히 당신의 실.',
  '부처님도 처음엔 이랬을까요. 아니겠죠.',
  '퇴근은 108알 뒤에.',
  '순위표는 없습니다. 이기고 싶은 마음만 있을 뿐.',
  '비교는 109번째 번뇌입니다.',
  '바늘 끝은 하늘을 향해야 합니다. 마음도요.',
];
const LAMENT_BIG = [
  '다시 꿰면 됩니다. 처음부터.',
  '색즉시공. 방금 그 알들이 공이 되었습니다.',
  '이것이 무상(無常)입니다. 교과서에 실릴 만한.',
  '숨을 들이쉬고… 내쉬고… 화면을 닫지 마세요.',
  '이긴 사람도 진 사람도 없습니다. 떨어진 알만 있을 뿐.',
];

const BEAT_SEC = 0.8;
const CHANT_FROM = 20;

const $ = (id) => document.getElementById(id);
const canvas = $('game');
const ctx = canvas.getContext('2d');
const shade = document.createElement('canvas');
const view = { scale: 1, ox: 0, oy: 0, dpr: 1, cw: 0, ch: 0 };
const input = { lastX: 0, lastY: 0, down: false };

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const rand = (lo, hi) => lo + Math.random() * (hi - lo);

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function store(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { return; }
}
function forget(key) {
  try { localStorage.removeItem(key); } catch { return; }
}

const TRACKS = {
  start: 'audio/moktak-start.m4a',
  finish: 'audio/moktak-finish.m4a',
  chant: 'audio/yeombul.m4a',
};
const audio = { ctx: null, out: null, muted: load(MUTE_KEY) === true, buffers: {}, chant: null, roll: null, rollUntil: 0 };

function audioCtx() {
  if (!audio.ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    audio.ctx = new C();
    audio.out = audio.ctx.createGain();
    audio.out.connect(audio.ctx.destination);
    syncMute();
  }
  if (audio.ctx.state === 'suspended') audio.ctx.resume();
  return audio.ctx;
}

function syncMute() {
  if (audio.out) audio.out.gain.value = audio.muted ? 0 : 1;
}

async function loadTracks() {
  const a = audioCtx();
  if (!a) return;
  await Promise.all(Object.entries(TRACKS).map(async ([name, url]) => {
    try {
      const res = await fetch(url);
      const data = await res.arrayBuffer();
      audio.buffers[name] = await new Promise((ok, fail) => a.decodeAudioData(data, ok, fail));
    } catch {
      return;
    }
  }));
}

function playTrack(name, gain, loop = false) {
  const a = audioCtx();
  const buffer = audio.buffers[name];
  if (!a || !buffer) return null;
  const src = a.createBufferSource();
  const g = a.createGain();
  src.buffer = buffer;
  src.loop = loop;
  g.gain.value = gain;
  src.connect(g).connect(audio.out);
  src.start();
  return { src, g };
}

function fadeOut(track) {
  const now = audio.ctx.currentTime;
  track.g.gain.setTargetAtTime(0, now, 0.3);
  track.src.stop(now + 1.5);
}

function roll(name, fallback) {
  if (audio.roll) fadeOut(audio.roll);
  audio.roll = playTrack(name, 0.8);
  audio.rollUntil = audio.roll ? audio.ctx.currentTime + audio.roll.src.buffer.duration : 0;
  if (!audio.roll) fallback();
}

function tone(freq, dur, type, gain, slideTo, delay = 0) {
  const a = audioCtx();
  if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(audio.out);
  o.start(t);
  o.stop(t + dur + 0.02);
}

const sfx = {
  thread() { tone(1250, 0.07, 'triangle', 0.22, 900); tone(2500, 0.04, 'sine', 0.06); },
  hit() { tone(190, 0.1, 'sine', 0.3, 90); },
  drop() { tone(2100 + Math.random() * 900, 0.18, 'sine', 0.05, 1500); },
  vanish() { tone(700, 0.18, 'sine', 0.12, 2600); },
  meow() { tone(700, 0.12, 'sine', 0.1, 950); tone(950, 0.35, 'sine', 0.09, 520, 0.1); },
  wind() { tone(220, 2.4, 'sine', 0.05, 90); },
  moktak(times = 1) {
    for (let i = 0; i < times; i++) {
      tone(520, 0.32, 'sine', 0.45, 360, i * 0.42);
      tone(1050, 0.06, 'triangle', 0.12, null, i * 0.42);
    }
  },
};

function track(name, params) {
  if (typeof window.gtag === 'function') window.gtag('event', name, params);
}

function vibrate(ms) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

const beadSprite = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  paintBead(g, 32, 32, 30);
  return c;
})();

function paintBead(g, x, y, r, colors = BEAD_COLORS) {
  const grad = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(0.45, colors[1]);
  grad.addColorStop(1, colors[2]);
  g.fillStyle = grad;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

let S = freshState('intro', 'easy', 0, 0, 0, 0);

function freshState(phase, mode, n0, elapsed, drops, peak) {
  const eye = { x: ANCHOR.x + 80, y: ANCHOR.y + 90 };
  const tip = { x: eye.x, y: eye.y - NEEDLE_LEN };
  const top = Math.max(peak, n0);
  const len = BASE_LEN + LEN_PER_BEAD * top;
  const rope = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const x = ANCHOR.x + (eye.x - ANCHOR.x) * t;
    const y = ANCHOR.y + (eye.y - ANCHOR.y) * t + Math.sin(t * Math.PI) * 110;
    rope.push({ x, y, px: x, py: y });
  }
  return {
    phase, mode, strung: [], elapsed, drops, peak: top,
    falling: [], floats: [],
    frame: 0, tip, tipPrev: { ...tip }, tipVel: { x: 0, y: 0 }, eye, target: { ...tip },
    len, rope, poly: null, bead: null, decoy: null, spawnIn: 40,
    idle: 0, knocks: 0, tells: [],
    dark: 0, wind: 0, gust: null, windIn: rand(900, 1500), leaves: [], cat: null, catIn: rand(2400, 4200),
    lossCount: 0, lossTimer: 0, lossFloat: null, flash: 0, finishT: 0, ringFrom: null, resultShown: false,
  };
}

function difficulty() {
  const { base } = MODES[S.mode];
  return base + (1 - base) * Math.sqrt(clamp(S.strung.length / (TOTAL - 1), 0, 1));
}
function ease() {
  return clamp(1 - S.strung.length / EASY_UNTIL, 0, 1);
}
const holeTol = (k) => 10 - 5 * k + 3 * ease();
const alignCos = (k) => 0.82 + 0.13 * k - 0.2 * ease();

function resize() {
  view.dpr = Math.min(window.devicePixelRatio || 1, 2);
  view.cw = window.innerWidth;
  view.ch = window.innerHeight;
  canvas.width = Math.round(view.cw * view.dpr);
  canvas.height = Math.round(view.ch * view.dpr);
  shade.width = Math.ceil(canvas.width / 2);
  shade.height = Math.ceil(canvas.height / 2);
  view.scale = Math.min(view.cw / W, view.ch / H);
  view.ox = (view.cw - W * view.scale) / 2;
  view.oy = (view.ch - H * view.scale) / 2;
}

function toWorld(e) {
  return { x: (e.clientX - view.ox) / view.scale, y: (e.clientY - view.oy) / view.scale };
}

function setTarget(x, y) {
  S.target.x = clamp(x, 0, W);
  S.target.y = clamp(y, 0, H);
}

canvas.addEventListener('pointerdown', (e) => {
  audioCtx();
  input.down = true;
  input.lastX = e.clientX;
  input.lastY = e.clientY;
  if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
  if (S.phase !== 'play') return;
  S.idle = 0;
  const p = toWorld(e);
  if (Math.hypot(p.x - ANCHOR.x, p.y - ANCHOR.y) < KNOCK_R) knock();
  if (e.pointerType !== 'touch') setTarget(p.x, p.y);
});

window.addEventListener('pointermove', (e) => {
  if (S.phase !== 'play' || e.target.closest('button, a')) return;
  S.idle = 0;
  if (e.pointerType === 'touch') {
    if (!input.down) return;
    const gain = 1.25 / view.scale;
    setTarget(S.target.x + (e.clientX - input.lastX) * gain, S.target.y + (e.clientY - input.lastY) * gain);
    input.lastX = e.clientX;
    input.lastY = e.clientY;
    return;
  }
  const p = toWorld(e);
  setTarget(p.x, p.y);
});

for (const type of ['pointerup', 'pointercancel']) {
  window.addEventListener(type, () => { input.down = false; });
}

function update() {
  S.frame++;
  const k = difficulty();
  updateEvents();
  updateNeedle(k);
  updateRope();
  buildPoly();
  if (S.phase === 'done') {
    updateFinish();
  } else {
    for (const b of [S.bead, S.decoy]) if (b) updateBead(b, k);
    checkThread(k);
    updateStrung();
  }
  updateFalling();
  updateFloats();
  if (S.lossTimer > 0 && --S.lossTimer === 0) {
    lament(S.lossCount);
    S.lossCount = 0;
  }
  if (S.phase !== 'play') return;
  if (++S.idle === IDLE_FRAMES) sayQuote(IDLE_QUOTE, 4200);
  if (!S.bead && S.strung.length < TOTAL && --S.spawnIn <= 0) spawnBead(k);
  const last = S.strung[S.strung.length - 1];
  if (S.strung.length === TOTAL && last.s < S.poly.eyeS - BEAD_R) finish();
  if (S.frame % 120 === 0) save();
}

function updateEvents() {
  const m = MODES[S.mode];
  const live = S.phase === 'play';
  S.dark += ((live && S.strung.length >= m.darkFrom ? 1 : 0) - S.dark) * 0.02;
  S.wind = 0;
  updateLeaves();
  if (S.tells.length && !$('quote').classList.contains('on')) showTell();
  if (!live || S.strung.length < EASY_UNTIL) {
    S.gust = null;
    S.cat = null;
    return;
  }
  updateGust();
  if (m.cat) updateCat();
}

function tell(key, text) {
  if ((load(TOLD_KEY) || {})[key] || S.tells.some((t) => t.key === key)) return;
  S.tells.push({ key, text });
}

function showTell() {
  const { key, text } = S.tells.shift();
  store(TOLD_KEY, { ...load(TOLD_KEY), [key]: true });
  sayQuote(text, 4200);
}

function updateGust() {
  if (!S.gust) {
    if (--S.windIn > 0) return;
    S.gust = { t: 0, dir: Math.random() < 0.5 ? -1 : 1 };
    tell('wind', WIND_TELL);
    sfx.wind();
  }
  const g = S.gust;
  g.t++;
  if (g.t % 4 === 0) {
    S.leaves.push({ x: g.dir > 0 ? -10 : W + 10, y: rand(80, H - 120), vx: g.dir * rand(2.5, 5), vy: rand(-0.6, 0.6), rot: rand(0, 6.28), spin: rand(-0.15, 0.15) });
  }
  if (g.t > WIND_WARN) S.wind = g.dir * WIND_FORCE * Math.sin(Math.PI * (g.t - WIND_WARN) / WIND_GUST);
  if (g.t >= WIND_WARN + WIND_GUST) {
    S.gust = null;
    S.windIn = rand(900, 1500);
  }
}

function updateLeaves() {
  for (const l of S.leaves) {
    l.x += l.vx + S.wind * 20;
    l.y += l.vy + Math.sin(S.frame * 0.1 + l.rot) * 0.6;
    l.rot += l.spin;
  }
  S.leaves = S.leaves.filter((l) => l.x > -20 && l.x < W + 20);
}

function updateCat() {
  if (!S.cat) {
    if (--S.catIn > 0) return;
    S.cat = { t: 0, dir: Math.random() < 0.5 ? 1 : -1, i: Math.floor(rand(10, SEGMENTS - 4)) };
    tell('cat', CAT_TELL);
  }
  const c = S.cat;
  if (++c.t === CAT_HIT) swat(c);
  if (c.t >= CAT_FRAMES) {
    S.cat = null;
    S.catIn = rand(2400, 4200);
  }
}

function swat(c) {
  for (let j = Math.max(1, c.i - 4); j <= Math.min(SEGMENTS - 1, c.i + 4); j++) {
    S.rope[j].px -= c.dir * (CAT_PUSH - Math.abs(j - c.i));
  }
  const p = S.rope[c.i];
  S.floats.push({ x: p.x, y: p.y - 24, text: '냥', life: 50, color: '#f0c48a', size: 22 });
  sfx.meow();
}

function catPaw(c) {
  const p = S.rope[c.i];
  const edge = c.dir > 0 ? -40 : W + 40;
  const reach = c.t <= CAT_HIT ? c.t / CAT_HIT : 1 - (c.t - CAT_HIT) / (CAT_FRAMES - CAT_HIT);
  const e = reach * reach * (3 - 2 * reach);
  return { x: edge + (p.x - c.dir * 12 - edge) * e, y: p.y + 4 };
}

function updateNeedle(k) {
  const f = S.frame;
  const amp = S.phase === 'play' ? 0.3 + 2.3 * k : 0;
  const maxR = S.len * 0.96;
  const tdx = S.target.x - ANCHOR.x;
  const tdy = S.target.y - ANCHOR.y;
  const tr = Math.hypot(tdx, tdy);
  if (tr > maxR + NEEDLE_LEN) setTarget(ANCHOR.x + tdx * (maxR + NEEDLE_LEN) / tr, ANCHOR.y + tdy * (maxR + NEEDLE_LEN) / tr);
  const tx = S.target.x + S.wind * 60 + amp * (Math.sin(f * 0.21) + 0.6 * Math.sin(f * 0.57 + 1.3));
  const ty = S.target.y + amp * (Math.cos(f * 0.17) + 0.6 * Math.sin(f * 0.49 + 0.4));
  S.tipPrev.x = S.tip.x;
  S.tipPrev.y = S.tip.y;
  S.tipVel.x = (S.tipVel.x + (tx - S.tip.x) * 0.24) * 0.66;
  S.tipVel.y = (S.tipVel.y + (ty - S.tip.y) * 0.24) * 0.66;
  S.tip.x += S.tipVel.x;
  S.tip.y += S.tipVel.y;
  S.eye.y += 0.35;
  const dx = S.tip.x - S.eye.x;
  const dy = S.tip.y - S.eye.y;
  const d = Math.hypot(dx, dy) || 1;
  S.eye.x = S.tip.x - (dx / d) * NEEDLE_LEN;
  S.eye.y = S.tip.y - (dy / d) * NEEDLE_LEN;
  const ax = S.eye.x - ANCHOR.x;
  const ay = S.eye.y - ANCHOR.y;
  const r = Math.hypot(ax, ay);
  if (r > maxR) {
    const sh = (r - maxR) / r;
    S.eye.x -= ax * sh;
    S.eye.y -= ay * sh;
    S.tip.x -= ax * sh;
    S.tip.y -= ay * sh;
    S.tipVel.x *= 0.5;
    S.tipVel.y *= 0.5;
  }
}

function updateRope() {
  S.len += (BASE_LEN + LEN_PER_BEAD * S.peak - S.len) * 0.05;
  const rope = S.rope;
  const seg = S.len / SEGMENTS;
  for (let i = 1; i < SEGMENTS; i++) {
    const p = rope[i];
    const vx = (p.x - p.px) * 0.985;
    const vy = (p.y - p.py) * 0.985;
    p.px = p.x;
    p.py = p.y;
    p.x += vx + S.wind;
    p.y += vy + ROPE_G;
  }
  const end = rope[SEGMENTS];
  end.x = end.px = S.eye.x;
  end.y = end.py = S.eye.y;
  for (let it = 0; it < 26; it++) {
    for (let i = 0; i < SEGMENTS; i++) {
      const a = rope[i];
      const b = rope[i + 1];
      const wa = i === 0 ? 0 : 1;
      const wb = i + 1 === SEGMENTS ? 0 : 1;
      if (!wa && !wb) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy) || 0.0001;
      const diff = (d - seg) / d / (wa + wb);
      a.x += dx * diff * wa;
      a.y += dy * diff * wa;
      b.x -= dx * diff * wb;
      b.y -= dy * diff * wb;
    }
  }
}

function buildPoly() {
  if (!S.poly) {
    S.poly = { xs: new Float32Array(SEGMENTS + 2), ys: new Float32Array(SEGMENTS + 2), cum: new Float32Array(SEGMENTS + 2), total: 0, eyeS: 0 };
  }
  const { xs, ys, cum } = S.poly;
  for (let i = 0; i <= SEGMENTS; i++) {
    xs[i] = S.rope[i].x;
    ys[i] = S.rope[i].y;
  }
  xs[SEGMENTS + 1] = S.tip.x;
  ys[SEGMENTS + 1] = S.tip.y;
  cum[0] = 0;
  for (let i = 1; i < xs.length; i++) cum[i] = cum[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]);
  S.poly.total = cum[SEGMENTS + 1];
  S.poly.eyeS = cum[SEGMENTS];
}

function sampleAt(s) {
  const { xs, ys, cum } = S.poly;
  const last = cum.length - 1;
  const q = clamp(s, 0, cum[last]);
  let lo = 0;
  let hi = last - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (cum[mid] <= q) lo = mid;
    else hi = mid - 1;
  }
  const L = cum[lo + 1] - cum[lo] || 0.0001;
  const t = (q - cum[lo]) / L;
  const dx = xs[lo + 1] - xs[lo];
  const dy = ys[lo + 1] - ys[lo];
  return { x: xs[lo] + dx * t, y: ys[lo] + dy * t, tx: dx / L, ty: dy / L };
}

function updateStrung() {
  const B = S.strung;
  const { weight, grip } = MODES[S.mode];
  const grav = BEAD_G * weight;
  const groups = [];
  B.forEach((b, i) => {
    const p = sampleAt(b.s);
    const resting = Math.abs(b.v) < 0.03 && Math.abs(p.ty) < MU_S * grip;
    const u = resting ? 0 : (b.v + grav * p.ty - Math.sign(b.v || p.ty) * grav * MU_K * grip * Math.abs(p.tx)) * BEAD_DAMP;
    if (b.grow < 1) b.grow = Math.min(1, b.grow + 0.06);
    let g = { first: i, n: 1, sum: u };
    while (groups.length) {
      const top = groups[groups.length - 1];
      if (B[g.first].s - B[g.first - 1].s > SPACING + 0.5) break;
      if (top.sum / top.n < g.sum / g.n) break;
      groups.pop();
      g = { first: top.first, n: top.n + g.n, sum: top.sum + g.sum };
    }
    groups.push(g);
  });
  for (const g of groups) {
    const v = clamp(g.sum / g.n, -BEAD_VMAX, BEAD_VMAX);
    for (let i = g.first; i < g.first + g.n; i++) {
      B[i].v = v;
      B[i].s += v;
    }
  }
  for (let it = 0; it < 6; it++) {
    for (let i = 1; i < B.length; i++) {
      const overlap = SPACING - (B[i].s - B[i - 1].s);
      if (overlap <= 0) continue;
      B[i - 1].s -= overlap / 2;
      B[i].s += overlap / 2;
    }
  }
  if (B.length && B[0].s < BEAD_R + 3) {
    B[0].s = BEAD_R + 3;
    B[0].v = Math.max(0, B[0].v);
  }
  for (let i = 1; i < B.length; i++) B[i].s = Math.max(B[i].s, B[i - 1].s + SPACING);
  const tipUp = needleDir().y < -0.3;
  while (B.length && B[B.length - 1].s > S.poly.total) {
    const last = B[B.length - 1];
    if (last.v <= 0 || tipUp) {
      last.s = S.poly.total;
      last.v = Math.min(last.v, 0);
      break;
    }
    dropLast();
  }
}

function dropLast() {
  const b = S.strung.pop();
  const p = sampleAt(S.poly.total);
  S.falling.push({ x: p.x, y: p.y, vx: p.tx * b.v + S.tipVel.x * 0.5, vy: p.ty * b.v + S.tipVel.y * 0.5 });
  S.drops++;
  S.lossCount++;
  S.lossTimer = 70;
  sfx.drop();
  showLoss();
}

function placeStack(n) {
  for (let i = 0; i < 300; i++) updateRope();
  buildPoly();
  let low = 0;
  let deepest = -Infinity;
  for (let i = 0; i <= SEGMENTS; i++) {
    if (S.poly.ys[i] <= deepest) continue;
    deepest = S.poly.ys[i];
    low = S.poly.cum[i];
  }
  const start = clamp(low - ((n - 1) / 2) * SPACING, BEAD_R + 3, S.poly.eyeS - n * SPACING);
  S.strung = Array.from({ length: n }, (_, i) => ({ s: start + i * SPACING, v: 0, grow: 1 }));
}

function safeEyeY() {
  const freeRope = BASE_LEN + LEN_PER_BEAD * S.peak - S.strung.length * SPACING;
  return ANCHOR.y + (SAFE_DEPTH + (SAFE_DEPTH_LATE - SAFE_DEPTH) * difficulty()) * freeRope;
}

function spawnBead(k) {
  const m = MODES[S.mode];
  const tricky = S.strung.length >= EASY_UNTIL;
  S.bead = makeBead(k, [S.tip]);
  if (tricky && Math.random() < m.oneWay) {
    S.bead.oneWay = Math.random() < 0.5 ? -1 : 1;
    tell('oneWay', ONE_WAY_TELL);
  }
  S.decoy = null;
  if (tricky && Math.random() < m.decoy) {
    S.decoy = { ...makeBead(k, [S.tip, S.bead]), decoy: true };
    tell('decoy', DECOY_TELL);
  }
}

function pickSpot(k, lift, avoid) {
  const reach = S.len * (0.8 - 0.3 * ease());
  const maxY = Math.max(150, Math.min(H - 110, safeEyeY() - (3 + 22 * k) - lift - 6));
  let x = W / 2;
  let y = H / 2;
  for (let i = 0; i < 60; i++) {
    x = 40 + Math.random() * (W - 80);
    y = 150 + Math.random() * (maxY - 150);
    if (Math.hypot(x - ANCHOR.x, y - ANCHOR.y) < reach && avoid.every((p) => Math.hypot(x - p.x, y - p.y) > 90)) break;
  }
  const r = Math.hypot(x - ANCHOR.x, y - ANCHOR.y);
  if (r > reach) {
    x = ANCHOR.x + (x - ANCHOR.x) * reach / r;
    y = ANCHOR.y + (y - ANCHOR.y) * reach / r;
  }
  return { x, y };
}

function makeBead(k, avoid) {
  const spin = S.strung.length < 10 ? 0 : (0.004 + 0.024 * k) * (Math.random() < 0.5 ? -1 : 1);
  const theta = Math.random() * Math.PI;
  const lift = spin ? 0 : (NEEDLE_LEN + 24) * Math.abs(Math.sin(theta));
  const { x: hx, y: hy } = pickSpot(k, lift, avoid);
  return {
    hx, hy, wx: hx, wy: hy, x: hx, y: hy, px: hx, py: hy,
    theta, spin, oneWay: 0, decoy: false,
    ph1: Math.random() * 6.28, ph2: Math.random() * 6.28,
    kx: 0, ky: 0, kvx: 0, kvy: 0, life: 0,
  };
}

function updateBead(b, k) {
  b.life++;
  b.px = b.x;
  b.py = b.y;
  b.theta += b.spin;
  if (k > 0.5 && Math.random() < 0.004) b.spin *= -1;
  b.kvx = (b.kvx - b.kx * 0.04) * 0.9;
  b.kvy = (b.kvy - b.ky * 0.04) * 0.9;
  b.kx += b.kvx;
  b.ky += b.kvy;
  if (b === S.bead && b.spin && !S.decoy) roamBead(b, k);
  b.x = b.hx + Math.sin(S.frame * 0.017 + b.ph2) * 34 * k + b.kx;
  b.y = b.hy + Math.sin(S.frame * 0.031 + b.ph1) * (3 + 22 * k) + b.ky;
  const near = Math.hypot(S.tip.x - b.x, S.tip.y - b.y) < HOLD_DIST;
  if (b === S.bead && S.phase === 'play' && timeLeft(b) <= 0 && !near) teleportBead(b, k);
}

function roamBead(b, k) {
  const speed = MODES[S.mode].roam;
  const dx = b.wx - b.hx;
  const dy = b.wy - b.hy;
  const d = Math.hypot(dx, dy);
  if (d > speed) {
    b.hx += (dx / d) * speed;
    b.hy += (dy / d) * speed;
  } else if (speed) {
    const spot = pickSpot(k, 0, []);
    b.wx = spot.x;
    b.wy = spot.y;
  }
}

function timeLeft(b) {
  if (S.strung.length < MODES[S.mode].timedFrom) return Infinity;
  return TIMED_FRAMES - (b.life - FADE_FRAMES);
}

function teleportBead(b, k) {
  S.floats.push({ x: b.x, y: b.y - 18, text: '휙', life: 45, color: '#e8b85c', size: 22 });
  sfx.vanish();
  spawnBead(k);
}

function needleDir() {
  return { x: (S.tip.x - S.eye.x) / NEEDLE_LEN, y: (S.tip.y - S.eye.y) / NEEDLE_LEN };
}

function isAligned(b, k) {
  const d = needleDir();
  const dot = d.x * Math.cos(b.theta) + d.y * Math.sin(b.theta);
  return (b.oneWay ? dot * b.oneWay : Math.abs(dot)) >= alignCos(k);
}

function checkThread(k) {
  if (S.phase !== 'play') return;
  for (const b of [S.decoy, S.bead]) {
    const hit = b && b.life >= FADE_FRAMES && crossing(b);
    if (!hit) continue;
    if (hit.perp <= holeTol(k) && isAligned(b, k) && (!b.oneWay || hit.dir === b.oneWay)) {
      if (b.decoy) threadDecoy();
      else threadBead();
    } else {
      hitBead(b);
    }
    return;
  }
}

function crossing(b) {
  const ax = Math.cos(b.theta);
  const ay = Math.sin(b.theta);
  const r0x = S.tipPrev.x - b.px;
  const r0y = S.tipPrev.y - b.py;
  const r1x = S.tip.x - b.x;
  const r1y = S.tip.y - b.y;
  const a0 = r0x * ax + r0y * ay;
  const a1 = r1x * ax + r1y * ay;
  if (a0 === 0 || Math.sign(a0) === Math.sign(a1)) return null;
  const t = a0 / (a0 - a1);
  const cx = r0x + (r1x - r0x) * t;
  const cy = r0y + (r1y - r0y) * t;
  const perp = Math.abs(-cx * ay + cy * ax);
  if (perp > TARGET_R) return null;
  return { perp, dir: Math.sign(a1 - a0) };
}

function threadDecoy() {
  const { x, y } = S.decoy;
  const before = S.drops;
  S.decoy = null;
  for (let i = 0; i < DECOY_COST && S.strung.length; i++) dropLast();
  S.lossTimer = 0;
  S.lossCount = 0;
  S.floats.push({ x, y: y - 22, text: '번뇌', life: 60, color: '#ff4d3d', size: 24 });
  if (before < TOTAL && S.drops >= TOTAL) dropsEgg();
  else sayQuote(pick(DECOY_QUOTES), 3600);
}

function threadBead() {
  S.strung.push({ s: S.poly.total - NEEDLE_LEN * 0.35, v: -0.6, grow: 0 });
  S.floats.push({ x: S.bead.x, y: S.bead.y - 22, text: `${S.strung.length}`, life: 60, color: '#e8b85c', size: 24 });
  S.bead = null;
  S.decoy = null;
  S.spawnIn = 45;
  sfx.thread();
  vibrate(12);
  const n = S.strung.length;
  if (n > S.peak) {
    S.peak = n;
    const text = milestoneText(n);
    if (text) {
      track('milestone', { beads: n });
      sayQuote(text, 2000 + text.length * 60);
      sfx.moktak(CHAPTERS.some((c) => c.at === n) ? 3 : 1);
    }
  }
}

function milestoneText(n) {
  const m = MODES[S.mode];
  return [MILESTONES[n], n === m.timedFrom && TIMED_QUOTE, n === m.darkFrom && DARK_QUOTE].filter(Boolean).join(' ');
}

function hitBead(b) {
  b.kvx += S.tipVel.x * 0.35;
  b.kvy += S.tipVel.y * 0.35;
  S.tip.x = S.tipPrev.x;
  S.tip.y = S.tipPrev.y;
  S.tipVel.x *= -0.35;
  S.tipVel.y *= -0.35;
  sfx.hit();
  vibrate(25);
}

function updateFalling() {
  for (const p of S.falling) {
    p.vy += 0.35;
    p.x += p.vx;
    p.y += p.vy;
  }
  S.falling = S.falling.filter((p) => p.y < H + 80);
}

function updateFloats() {
  for (const f of S.floats) {
    f.life--;
    f.y -= f.rise ?? 0.5;
    if (f.pop) f.pop--;
  }
  S.floats = S.floats.filter((f) => f.life > 0);
  if (S.flash > 0) S.flash = Math.max(0, S.flash - 0.05);
}

function showLoss() {
  const x = clamp(S.tip.x, 40, W - 40);
  const y = clamp(S.tip.y - 26, 60, H - 40);
  const size = Math.min(34 + S.lossCount * 3, 72);
  if (S.lossFloat && S.lossFloat.life > 0) {
    Object.assign(S.lossFloat, { x, y, text: `-${S.lossCount}`, size, life: 80, pop: 8 });
  } else {
    S.lossFloat = { x, y, text: `-${S.lossCount}`, size, life: 80, pop: 8, rise: 0.2, color: '#ff4d3d' };
    S.floats.push(S.lossFloat);
  }
  S.flash = 1;
  vibrate(30);
  const el = hudEls.drops;
  el.classList.remove('hit');
  void el.offsetWidth;
  el.classList.add('hit');
}

function lament(k) {
  if (S.phase !== 'play' || k <= 0) return;
  if (S.drops >= TOTAL && S.drops - k < TOTAL) dropsEgg();
  else if (k >= 15) sayQuote(pick(LAMENT_BIG), 4200);
  else if (k >= 4) sayQuote(pick(LAMENT_MID), 3600);
  else if (Math.random() < 0.6) sayQuote(pick(LAMENT_SMALL), 3000);
}

function dropsEgg() {
  sayQuote(DROPS_EGG, 5000);
  sfx.moktak(3);
}

function knock() {
  sfx.hit();
  if (++S.knocks % 3 === 0) sayQuote(KNOCKS[(S.knocks / 3 - 1) % KNOCKS.length], 3200);
}

function ringPoint(i, t) {
  const a = -Math.PI / 2 + (i / TOTAL) * Math.PI * 2;
  return { x: W / 2 + Math.cos(a) * 125 * t, y: 330 + Math.sin(a) * 125 * t };
}

function finish() {
  S.phase = 'done';
  S.bead = null;
  S.decoy = null;
  S.finishT = 0;
  S.ringFrom = S.strung.map((b) => sampleAt(b.s));
  forget(SAVE_KEY);
  track('game_complete', { difficulty: S.mode, seconds: Math.round(S.elapsed), drops: S.drops });
  const best = load(bestKey(S.mode));
  if (!best || S.elapsed < best.time) store(bestKey(S.mode), { time: S.elapsed, drops: S.drops });
  roll('finish', () => sfx.moktak(3));
  vibrate([30, 60, 30, 60, 120]);
}

function bestKey(mode) {
  return mode === 'easy' ? BEST_KEY : `${BEST_KEY}.${mode}`;
}

function updateFinish() {
  S.finishT = Math.min(1, S.finishT + 1 / 150);
  if (S.finishT === 1 && !S.resultShown) {
    S.resultShown = true;
    showResult();
  }
}

function save() {
  if (S.phase !== 'play') return;
  store(SAVE_KEY, { mode: S.mode, n: S.strung.length, elapsed: S.elapsed, drops: S.drops, peak: S.peak });
}

function chapterOf(n) {
  let c = CHAPTERS[0];
  for (const ch of CHAPTERS) if (n >= ch.at) c = ch;
  return c;
}

function render() {
  const { dpr, scale, ox, oy, cw, ch } = view;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const chap = chapterOf(S.phase === 'done' ? TOTAL : S.peak);
  const bg = ctx.createLinearGradient(0, 0, 0, ch);
  bg.addColorStop(0, chap.top);
  bg.addColorStop(1, chap.bottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, cw, ch);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
  drawAnchor();
  if (S.phase === 'done') {
    drawRing();
  } else {
    drawRope();
    drawStrung();
    drawNeedle();
    for (const b of [S.decoy, S.bead]) if (b) drawTarget(b);
  }
  for (const p of S.falling) ctx.drawImage(beadSprite, p.x - BEAD_R, p.y - BEAD_R, BEAD_R * 2, BEAD_R * 2);
  if (S.dark > 0.01) drawShade();
  drawLeaves();
  if (S.cat) drawCat();
  drawFloats();
  if (S.flash > 0) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = `rgba(255, 60, 50, ${0.22 * S.flash})`;
    ctx.fillRect(0, 0, cw, ch);
  }
}

function drawAnchor() {
  ctx.fillStyle = '#8a5a2b';
  ctx.beginPath();
  ctx.arc(ANCHOR.x, ANCHOR.y - 4, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c8323a';
  ctx.beginPath();
  ctx.arc(ANCHOR.x, ANCHOR.y, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawRope() {
  const r = S.rope;
  ctx.strokeStyle = '#c8323a';
  ctx.lineWidth = 1.6;
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(r[0].x, r[0].y);
  for (let i = 1; i < SEGMENTS; i++) {
    ctx.quadraticCurveTo(r[i].x, r[i].y, (r[i].x + r[i + 1].x) / 2, (r[i].y + r[i + 1].y) / 2);
  }
  ctx.lineTo(r[SEGMENTS].x, r[SEGMENTS].y);
  ctx.stroke();
}

function drawStrung() {
  for (const b of S.strung) {
    const p = sampleAt(b.s);
    const r = BEAD_R + (TARGET_R - BEAD_R) * (1 - b.grow) * (1 - b.grow);
    ctx.drawImage(beadSprite, p.x - r, p.y - r, r * 2, r * 2);
  }
}

function drawNeedle() {
  ctx.strokeStyle = '#dfe3ea';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(S.eye.x, S.eye.y);
  ctx.lineTo(S.tip.x, S.tip.y);
  ctx.stroke();
  const d = needleDir();
  ctx.save();
  ctx.translate(S.eye.x + d.x * 3, S.eye.y + d.y * 3);
  ctx.rotate(Math.atan2(d.y, d.x));
  ctx.strokeStyle = '#dfe3ea';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(0, 0, 2.6, 1.3, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawShade() {
  const { dpr, scale, ox, oy } = view;
  const r = dpr * shade.width / canvas.width;
  const g = shade.getContext('2d');
  g.globalCompositeOperation = 'source-over';
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, shade.width, shade.height);
  g.fillStyle = `rgba(3, 3, 6, ${0.95 * S.dark})`;
  g.fillRect(0, 0, shade.width, shade.height);
  g.setTransform(r * scale, 0, 0, r * scale, r * ox, r * oy);
  g.globalCompositeOperation = 'destination-out';
  light(g, S.tip.x, S.tip.y, CANDLE_R * (1 + 0.05 * Math.sin(S.frame * 0.3) + 0.03 * Math.sin(S.frame * 0.77)));
  for (const b of [S.bead, S.decoy]) if (b && b.life < REVEAL_FRAMES) light(g, b.x, b.y, 100 * (1 - b.life / REVEAL_FRAMES));
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.drawImage(shade, 0, 0, canvas.width, canvas.height);
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
}

function light(g, x, y, r) {
  const grad = g.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
  grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.85)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  g.fillStyle = grad;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

function drawLeaves() {
  ctx.fillStyle = 'rgba(201, 160, 74, 0.85)';
  for (const l of S.leaves) {
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawCat() {
  const { x, y } = catPaw(S.cat);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(S.cat.dir, 1);
  ctx.fillStyle = '#d98b3a';
  ctx.fillRect(-460, -7, 460, 14);
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#b06a28';
  for (let i = 1; i <= 4; i++) ctx.fillRect(-14 - i * 16, -7, 6, 14);
  ctx.fillStyle = '#f2b9a6';
  for (const dy of [-7, 0, 7]) {
    ctx.beginPath();
    ctx.arc(9, dy, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(1, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTarget(b) {
  const k = difficulty();
  const fade = Math.min(1, b.life / FADE_FRAMES);
  const left = b.decoy ? Infinity : timeLeft(b);
  const near = Math.hypot(S.tip.x - b.x, S.tip.y - b.y) < 140;
  const aligned = near && isAligned(b, k);
  const hole = Math.max(2.2, holeTol(k) * 0.55);
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.translate(b.x, b.y);
  if (Number.isFinite(left)) {
    const warn = left < WARN_FRAMES;
    ctx.lineWidth = 3;
    ctx.strokeStyle = warn ? '#ff5a4a' : 'rgba(232, 184, 92, 0.8)';
    ctx.beginPath();
    ctx.arc(0, 0, TARGET_R + 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(left / TIMED_FRAMES, 0, 1));
    ctx.stroke();
    if (warn) ctx.globalAlpha = fade * (0.4 + 0.6 * Math.abs(Math.sin(S.frame * 0.3)));
  }
  ctx.rotate(b.theta);
  ctx.setLineDash([3, 6]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = aligned ? 'rgba(255, 214, 120, 0.85)' : 'rgba(255, 255, 255, 0.14)';
  ctx.beginPath();
  ctx.moveTo(-80, 0);
  ctx.lineTo(80, 0);
  ctx.stroke();
  ctx.setLineDash([]);
  if (aligned || b.decoy) {
    ctx.fillStyle = b.decoy ? `rgba(255, 60, 50, ${0.16 + 0.1 * Math.sin(S.frame * 0.15)})` : 'rgba(255, 214, 120, 0.12)';
    ctx.beginPath();
    ctx.arc(0, 0, TARGET_R + 7, 0, Math.PI * 2);
    ctx.fill();
  }
  paintBead(ctx, 0, 0, TARGET_R, b.decoy ? DECOY_COLORS : BEAD_COLORS);
  ctx.fillStyle = 'rgba(20, 8, 3, 0.35)';
  ctx.fillRect(-TARGET_R + 1, -hole * 0.5, TARGET_R * 2 - 2, hole);
  ctx.fillStyle = '#140803';
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * (TARGET_R - 1.5), 0, 1.8, hole, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (b.oneWay) drawArrow(b.oneWay);
  ctx.restore();
}

function drawArrow(dir) {
  ctx.strokeStyle = '#ffd678';
  ctx.lineWidth = 2;
  ctx.lineJoin = ctx.lineCap = 'round';
  for (const off of [TARGET_R + 6, TARGET_R + 13]) {
    ctx.beginPath();
    ctx.moveTo(dir * off, -5);
    ctx.lineTo(dir * (off + 5), 0);
    ctx.lineTo(dir * off, 5);
    ctx.stroke();
  }
}

function drawRing() {
  const t = S.finishT;
  const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
  if (e > 0.85) {
    ctx.globalAlpha = (e - 0.85) / 0.15;
    ctx.strokeStyle = '#c8323a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(W / 2, 330, 125, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(W / 2, 455);
    ctx.lineTo(W / 2, 500);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
  const r = BEAD_R * (1 + 0.3 * e);
  S.strung.forEach((b, i) => {
    const from = S.ringFrom[i];
    const to = ringPoint(i, 1);
    const x = from.x + (to.x - from.x) * e;
    const y = from.y + (to.y - from.y) * e;
    ctx.drawImage(beadSprite, x - r, y - r, r * 2, r * 2);
  });
}

function drawFloats() {
  ctx.textAlign = 'center';
  for (const f of S.floats) {
    ctx.globalAlpha = Math.min(1, f.life / 30);
    ctx.fillStyle = f.color;
    ctx.font = `${f.size * (1 + (f.pop || 0) * 0.05)}px "ChosunGs", serif`;
    ctx.fillText(f.text, f.x, f.y);
  }
  ctx.globalAlpha = 1;
}

function formatTime(sec) {
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(r).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

function formatTimeKo(sec) {
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return [h && `${h}시간`, m && `${m}분`, `${r}초`].filter(Boolean).join(' ');
}

const hudEls = { count: $('count'), time: $('time'), drops: $('drops') };
function hud() {
  hudEls.count.textContent = S.strung.length;
  hudEls.time.textContent = formatTime(S.elapsed);
  hudEls.drops.textContent = S.drops;
}

let quoteTimer = 0;
function sayQuote(text, ms) {
  const el = $('quote');
  el.textContent = text;
  el.classList.add('on');
  clearTimeout(quoteTimer);
  quoteTimer = setTimeout(() => el.classList.remove('on'), ms);
}

let toastTimer = 0;
function toast(text) {
  const el = $('toast');
  el.textContent = text;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 1800);
}

const RECORD_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const RECORD_WIDTHS = [1, 2, 4, 5];
const RECORD_CHECK_WIDTH = 3;
const RECORD_LENGTH = RECORD_CHECK_WIDTH + RECORD_WIDTHS.reduce((a, b) => a + b, 0);

function recordCheck(body) {
  let h = 0x811c9dc5;
  for (const ch of `yeomju108:${body}`) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193) >>> 0;
  return (h % 36 ** RECORD_CHECK_WIDTH).toString(36).padStart(RECORD_CHECK_WIDTH, '0');
}

function scramble(text, dir) {
  return [...text].map((c, i) => RECORD_ALPHABET[(RECORD_ALPHABET.indexOf(c) + dir * (i * 7 + 13) + 36 * 36) % 36]).join('');
}

function encodeRecord(m, n, d, t) {
  const body = [m, n, d, t].map((v, i) => clamp(Math.round(v), 0, 36 ** RECORD_WIDTHS[i] - 1).toString(36).padStart(RECORD_WIDTHS[i], '0')).join('');
  return scramble(recordCheck(body) + body, 1);
}

function decodeRecord(token) {
  if (!token || !new RegExp(`^[0-9a-z]{${RECORD_LENGTH}}$`).test(token)) return null;
  const plain = scramble(token, -1);
  const body = plain.slice(RECORD_CHECK_WIDTH);
  if (plain.slice(0, RECORD_CHECK_WIDTH) !== recordCheck(body)) return null;
  let at = 0;
  const [m, n, d, t] = RECORD_WIDTHS.map((w) => Number.parseInt(body.slice(at, (at += w)), 36));
  if (n > TOTAL || !MODE_KEYS[m]) return null;
  return { mode: MODE_KEYS[m], n, d, t: n === TOTAL ? t : 0 };
}

function shareUrl() {
  const u = new URL(location.pathname, location.origin);
  const done = S.phase === 'done';
  u.searchParams.set('r', encodeRecord(MODE_KEYS.indexOf(S.mode), done ? TOTAL : S.strung.length, S.drops, done ? S.elapsed : 0));
  return u.toString();
}

function readChallenge() {
  return decodeRecord(new URLSearchParams(location.search).get('r'));
}

function shareText() {
  const mode = MODES[S.mode].label;
  if (S.phase === 'done') return `[${mode}] 108번뇌를 ${formatTimeKo(S.elapsed)} 만에 꿰었다. 떨군 알 ${S.drops}개. 너도 성불해 봐 🙏`;
  return `[${mode}] 염주 ${S.strung.length}/108알 꿰는 중… 떨군 알 ${S.drops}개. 넌 108개 다 꿸 수 있을까? 🙏`;
}

async function share() {
  const text = shareText();
  track('share', { phase: S.phase, beads: S.strung.length });
  const url = shareUrl();
  if (navigator.share) {
    try {
      await navigator.share({ title: '108번뇌 꿰기', url });
      return;
    } catch (e) {
      if (e && e.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    toast('자랑 문구를 복사했어요');
  } catch {
    toast(url);
  }
}

function makeCard() {
  const c = document.createElement('canvas');
  c.width = 1080;
  c.height = 1350;
  const g = c.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, 1350);
  bg.addColorStop(0, '#07080d');
  bg.addColorStop(1, '#2a1f3d');
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1350);
  g.strokeStyle = '#c8323a';
  g.lineWidth = 4;
  g.beginPath();
  g.arc(540, 620, 330, 0, Math.PI * 2);
  g.stroke();
  for (let i = 0; i < TOTAL; i++) {
    const a = -Math.PI / 2 + (i / TOTAL) * Math.PI * 2;
    g.drawImage(beadSprite, 540 + Math.cos(a) * 330 - 11, 620 + Math.sin(a) * 330 - 11, 22, 22);
  }
  g.textAlign = 'center';
  g.fillStyle = '#e8b85c';
  g.font = '700 30px "Noto Sans KR", sans-serif';
  g.fillText(`${MODES[S.mode].label} · 수행 완료`, 540, 150);
  g.fillStyle = '#f4ead8';
  g.font = '80px "ChosunGs", serif';
  g.fillText('108번뇌 꿰기', 540, 240);
  g.font = '92px "ChosunGs", serif';
  g.fillText(formatTime(S.elapsed), 540, 640);
  g.fillStyle = 'rgba(244,234,216,0.7)';
  g.font = '400 34px "Noto Sans KR", sans-serif';
  g.fillText(`떨군 알 ${S.drops}개`, 540, 710);
  g.fillStyle = 'rgba(244,234,216,0.5)';
  g.font = '400 28px "Noto Sans KR", sans-serif';
  g.fillText(location.host || '108번뇌 꿰기', 540, 1250);
  return c;
}

async function saveCard() {
  track('card_save');
  await document.fonts.ready;
  const blob = await new Promise((resolve) => makeCard().toBlob(resolve, 'image/png'));
  if (!blob) return;
  const file = new File([blob], '108-beads.png', { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text: shareText() });
      return;
    } catch (e) {
      if (e && e.name === 'AbortError') return;
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '108-beads.png';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function showResult() {
  const best = load(bestKey(S.mode));
  const flawless = S.drops === 0;
  $('r-eyebrow').textContent = flawless ? '무낙(無落) 성불' : '성불(?) 완료';
  $('r-congrats').textContent = flawless ? FLAWLESS[S.mode] : '축하합니다. 그 많은 알을 떨구고도 끝내 다 꿴 당신, 이미 반쯤은 부처입니다.';
  $('r-mode').textContent = MODES[S.mode].label;
  $('r-time').textContent = formatTime(S.elapsed);
  $('r-drops').textContent = `${S.drops}개`;
  $('r-best').textContent = best ? formatTime(best.time) : '-';
  $('result').hidden = false;
}

function syncModeBadge() {
  const el = $('mode-badge');
  el.dataset.mode = S.mode;
  el.textContent = MODES[S.mode].label;
}

function begin(mode, saved) {
  S = saved ? freshState('play', mode, saved.n, saved.elapsed, saved.drops, saved.peak || saved.n) : freshState('play', mode, 0, 0, 0, 0);
  placeStack(saved ? saved.n : 0);
  syncModeBadge();
  $('intro').hidden = true;
  $('result').hidden = true;
  audioCtx();
  roll('start', () => sfx.moktak(1));
  track('game_start', { mode: saved ? 'continue' : 'new', difficulty: mode, beads: S.strung.length });
  const hello = saved ? '다시 오셨군요. 번뇌는 그대로 기다리고 있었습니다.' : '바늘 끝이 가는 곳으로, 마음도 갑니다.';
  sayQuote(mode === 'hard' ? `${hello} 오늘따라 실이 무겁습니다.` : hello, 3600);
}

const bgm = { nextBeat: 0 };

function bgmOn() {
  return !audio.muted && S.phase === 'play' && !document.hidden;
}

function scheduleMoktak() {
  const a = audio.ctx;
  if (!a || !bgmOn() || audio.chant || a.currentTime < audio.rollUntil) {
    bgm.nextBeat = 0;
    return;
  }
  if (bgm.nextBeat < a.currentTime) bgm.nextBeat = a.currentTime + 0.05;
  while (bgm.nextBeat < a.currentTime + 0.3) {
    const delay = bgm.nextBeat - a.currentTime;
    tone(560, 0.18, 'sine', 0.14, 420, delay);
    tone(1100, 0.04, 'triangle', 0.04, null, delay);
    bgm.nextBeat += BEAT_SEC;
  }
}

function updateChant() {
  if (!audio.ctx) return;
  const want = bgmOn() && S.strung.length >= CHANT_FROM && audio.ctx.currentTime >= audio.rollUntil;
  if (want === Boolean(audio.chant)) return;
  if (want) {
    audio.chant = playTrack('chant', 0.6, true);
    return;
  }
  fadeOut(audio.chant);
  audio.chant = null;
}

function syncSoundButton() {
  $('btn-sound').textContent = audio.muted ? '소리 끔' : '소리 켬';
}

function initIntro() {
  const challenge = readChallenge();
  if (challenge) {
    const el = $('challenge');
    const mode = MODES[challenge.mode].label;
    el.textContent = challenge.t
      ? `친구가 [${mode}] 108알을 ${formatTimeKo(challenge.t)} 만에 다 꿰었습니다. 떨군 알 ${challenge.d}개. 당신은?`
      : `친구가 [${mode}] ${challenge.n}알까지 꿰었습니다. 떨군 알 ${challenge.d}개. 당신은?`;
    el.hidden = false;
  }
  const btn = $('btn-continue');
  btn.addEventListener('click', () => {
    const save = load(SAVE_KEY);
    begin(savedMode(save), save);
  });
  for (const el of document.querySelectorAll('button[data-mode]')) {
    el.addEventListener('click', () => {
      forget(SAVE_KEY);
      begin(el.dataset.mode, null);
    });
  }
  showIntro();
}

function savedMode(save) {
  return save && MODE_KEYS.includes(save.mode) ? save.mode : 'easy';
}

function showIntro() {
  const saved = load(SAVE_KEY);
  const resumable = Boolean(saved && saved.n > 0);
  const btn = $('btn-continue');
  btn.hidden = !resumable;
  if (resumable) btn.textContent = `이어하기 (${MODES[savedMode(saved)].label} · ${saved.n}/108)`;
  for (const el of document.querySelectorAll('button[data-mode]')) el.classList.toggle('primary', !resumable);
  $('result').hidden = true;
  $('intro').hidden = false;
}

function goMain() {
  save();
  S = freshState('intro', S.mode, 0, 0, 0, 0);
  $('quote').classList.remove('on');
  showIntro();
}

$('btn-sound').addEventListener('click', () => {
  audio.muted = !audio.muted;
  store(MUTE_KEY, audio.muted);
  syncMute();
  syncSoundButton();
});
$('btn-share').addEventListener('click', share);
document.querySelector('.promo').addEventListener('click', () => track('promo_click'));
$('btn-share-result').addEventListener('click', share);
$('btn-card').addEventListener('click', saveCard);
$('btn-again').addEventListener('click', () => begin(S.mode, null));
$('btn-main').addEventListener('click', goMain);
$('btn-main-result').addEventListener('click', goMain);
$('btn-restart').addEventListener('click', () => {
  if (S.phase === 'play' && S.strung.length > 0 && !confirm(`${S.strung.length}알을 전부 내려놓고 처음부터 할까요?`)) return;
  forget(SAVE_KEY);
  begin(S.mode, null);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) save();
});
window.addEventListener('pagehide', save);
window.addEventListener('resize', resize);

let last = performance.now();
let acc = 0;
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  acc += dt;
  while (acc >= STEP) {
    update();
    acc -= STEP;
  }
  if (S.phase === 'play' && !document.hidden) S.elapsed += dt;
  render();
  hud();
  requestAnimationFrame(loop);
}

resize();
syncSoundButton();
setInterval(() => {
  scheduleMoktak();
  updateChant();
}, 100);
loadTracks();
initIntro();
requestAnimationFrame(loop);
