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
const TIMED_FROM = 90;
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

const CHAPTERS = [
  { at: 0, top: '#141a2e', bottom: '#3a2e45' },
  { at: 27, top: '#1f2d2e', bottom: '#5c5b48' },
  { at: 54, top: '#2e1820', bottom: '#94493a' },
  { at: 81, top: '#07080d', bottom: '#1d1830' },
];

const MILESTONES = {
  10: '열 알. 이제 알이 돌기 시작합니다. 세상도 원래 돌고 있었습니다.',
  20: '스무 알. 어디선가 반야심경이 들려옵니다.',
  27: '사분의 일. 아직 81번뇌가 남았습니다.',
  54: '반. 여기서 그만두는 것도 깨달음일 수 있습니다.',
  81: '사분의 삼. 실이 무거워졌다면, 그건 기분 탓이 아닙니다.',
  90: '아흔 알. 이제 알도 오래 기다려 주지 않습니다.',
  100: '여덟 알. 지금 떨구면 정말 웃길 것 같습니다.',
};

const LAMENT_SMALL = [
  '번뇌가 하나 늘었습니다.',
  '떨어진 알도 다 인연입니다.',
  '중력은 자비가 없습니다.',
  '집착을 내려놓으라 했지, 염주를 내려놓으란 말은 아니었는데.',
  '지금 이 순간에 집중하세요. 방금 그 순간 말고.',
  '참는 것도 수행입니다.',
];
const LAMENT_MID = [
  '괜찮습니다. 모든 것은 공(空)입니다. 특히 당신의 실.',
  '부처님도 처음엔 이랬을까요. 아니겠죠.',
  '퇴근은 108알 뒤에.',
  '바늘 끝은 하늘을 향해야 합니다. 마음도요.',
];
const LAMENT_BIG = [
  '다시 꿰면 됩니다. 처음부터.',
  '색즉시공. 방금 그 알들이 공이 되었습니다.',
  '이것이 무상(無常)입니다. 교과서에 실릴 만한.',
  '숨을 들이쉬고… 내쉬고… 화면을 닫지 마세요.',
];

const CHANT_FROM = 20;
const BEAT_SEC = 0.8;
const SUTRA = [
  '마하반야바라밀다심경',
  '관자재보살 행심반야바라밀다시 조견오온개공 도일체고액',
  '사리자 색불이공 공불이색 색즉시공 공즉시색 수상행식 역부여시',
  '사리자 시제법공상 불생불멸 불구부정 부증불감',
  '시고 공중무색 무수상행식 무안이비설신의 무색성향미촉법 무안계 내지 무의식계',
  '무무명 역무무명진 내지 무노사 역무노사진 무고집멸도 무지역무득 이무소득고',
  '보리살타 의반야바라밀다고 심무가애 무가애고 무유공포 원리전도몽상 구경열반',
  '삼세제불 의반야바라밀다고 득아뇩다라삼먁삼보리',
  '고지반야바라밀다 시대신주 시대명주 시무상주 시무등등주 능제일체고 진실불허',
  '고설반야바라밀다주 즉설주왈',
  '아제아제 바라아제 바라승아제 모지 사바하',
  '아제아제 바라아제 바라승아제 모지 사바하',
  '아제아제 바라아제 바라승아제 모지 사바하',
];

const $ = (id) => document.getElementById(id);
const canvas = $('game');
const ctx = canvas.getContext('2d');
const view = { scale: 1, ox: 0, oy: 0, dpr: 1, cw: 0, ch: 0 };
const input = { lastX: 0, lastY: 0, down: false };

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pick = (list) => list[Math.floor(Math.random() * list.length)];

function load(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function store(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { return; }
}
function forget(key) {
  try { localStorage.removeItem(key); } catch { return; }
}

const audio = { ctx: null, muted: load(MUTE_KEY) === true };

function audioCtx() {
  if (!audio.ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    audio.ctx = new C();
  }
  if (audio.ctx.state === 'suspended') audio.ctx.resume();
  return audio.ctx;
}

function tone(freq, dur, type, gain, slideTo, delay = 0) {
  if (audio.muted) return;
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
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

const sfx = {
  thread() { tone(1250, 0.07, 'triangle', 0.22, 900); tone(2500, 0.04, 'sine', 0.06); },
  hit() { tone(190, 0.1, 'sine', 0.3, 90); },
  drop() { tone(2100 + Math.random() * 900, 0.18, 'sine', 0.05, 1500); },
  vanish() { tone(700, 0.18, 'sine', 0.12, 2600); },
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

function paintBead(g, x, y, r) {
  const grad = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  grad.addColorStop(0, '#c98a52');
  grad.addColorStop(0.45, '#7a4523');
  grad.addColorStop(1, '#2c160a');
  g.fillStyle = grad;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
}

let S = freshState('intro', 0, 0, 0, 0);

function freshState(phase, n0, elapsed, drops, peak) {
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
    phase, strung: [], elapsed, drops, peak: top,
    falling: [], floats: [],
    frame: 0, tip, tipPrev: { ...tip }, tipVel: { x: 0, y: 0 }, eye, target: { ...tip },
    len, rope, poly: null, bead: null, spawnIn: 40,
    lossCount: 0, lossTimer: 0, lossFloat: null, flash: 0, finishT: 0, ringFrom: null, resultShown: false,
  };
}

function difficulty() {
  return Math.sqrt(clamp(S.strung.length / (TOTAL - 1), 0, 1));
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
  if (e.pointerType !== 'touch' && S.phase === 'play') {
    const p = toWorld(e);
    setTarget(p.x, p.y);
  }
});

window.addEventListener('pointermove', (e) => {
  if (S.phase !== 'play' || e.target.closest('button, a')) return;
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
  updateNeedle(k);
  updateRope();
  buildPoly();
  if (S.phase === 'done') {
    updateFinish();
  } else {
    updateBead(k);
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
  if (!S.bead && S.strung.length < TOTAL && --S.spawnIn <= 0) spawnBead(k);
  const last = S.strung[S.strung.length - 1];
  if (S.strung.length === TOTAL && last.s < S.poly.eyeS - BEAD_R) finish();
  if (S.frame % 120 === 0) save();
}

function updateNeedle(k) {
  const f = S.frame;
  const amp = S.phase === 'play' ? 0.3 + 2.3 * k : 0;
  const maxR = S.len * 0.96;
  const tdx = S.target.x - ANCHOR.x;
  const tdy = S.target.y - ANCHOR.y;
  const tr = Math.hypot(tdx, tdy);
  if (tr > maxR + NEEDLE_LEN) setTarget(ANCHOR.x + tdx * (maxR + NEEDLE_LEN) / tr, ANCHOR.y + tdy * (maxR + NEEDLE_LEN) / tr);
  const tx = S.target.x + amp * (Math.sin(f * 0.21) + 0.6 * Math.sin(f * 0.57 + 1.3));
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
    p.x += vx;
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
  const groups = [];
  B.forEach((b, i) => {
    const p = sampleAt(b.s);
    const resting = Math.abs(b.v) < 0.03 && Math.abs(p.ty) < MU_S;
    const u = resting ? 0 : (b.v + BEAD_G * p.ty - Math.sign(b.v || p.ty) * BEAD_G * MU_K * Math.abs(p.tx)) * BEAD_DAMP;
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
    const b = B.pop();
    const p = sampleAt(S.poly.total);
    S.falling.push({ x: p.x, y: p.y, vx: p.tx * b.v + S.tipVel.x * 0.5, vy: p.ty * b.v + S.tipVel.y * 0.5 });
    S.drops++;
    S.lossCount++;
    S.lossTimer = 70;
    sfx.drop();
    showLoss();
  }
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
  const reach = S.len * (0.8 - 0.3 * ease());
  const spin = S.strung.length < 10 ? 0 : (0.004 + 0.024 * k) * (Math.random() < 0.5 ? -1 : 1);
  const theta = Math.random() * Math.PI;
  const lift = spin ? 0 : (NEEDLE_LEN + 24) * Math.abs(Math.sin(theta));
  const maxY = Math.max(150, Math.min(H - 110, safeEyeY() - (3 + 22 * k) - lift - 6));
  let hx = W / 2;
  let hy = H / 2;
  for (let i = 0; i < 60; i++) {
    hx = 40 + Math.random() * (W - 80);
    hy = 150 + Math.random() * (maxY - 150);
    if (Math.hypot(hx - ANCHOR.x, hy - ANCHOR.y) < reach && Math.hypot(hx - S.tip.x, hy - S.tip.y) > 90) break;
  }
  const r = Math.hypot(hx - ANCHOR.x, hy - ANCHOR.y);
  if (r > reach) {
    hx = ANCHOR.x + (hx - ANCHOR.x) * reach / r;
    hy = ANCHOR.y + (hy - ANCHOR.y) * reach / r;
  }
  S.bead = {
    hx, hy, x: hx, y: hy, px: hx, py: hy,
    theta, spin,
    ph1: Math.random() * 6.28, ph2: Math.random() * 6.28,
    kx: 0, ky: 0, kvx: 0, kvy: 0, life: 0,
  };
}

function updateBead(k) {
  const b = S.bead;
  if (!b) return;
  b.life++;
  b.px = b.x;
  b.py = b.y;
  b.theta += b.spin;
  if (k > 0.5 && Math.random() < 0.004) b.spin *= -1;
  b.kvx = (b.kvx - b.kx * 0.04) * 0.9;
  b.kvy = (b.kvy - b.ky * 0.04) * 0.9;
  b.kx += b.kvx;
  b.ky += b.kvy;
  b.x = b.hx + Math.sin(S.frame * 0.017 + b.ph2) * 34 * k + b.kx;
  b.y = b.hy + Math.sin(S.frame * 0.031 + b.ph1) * (3 + 22 * k) + b.ky;
  const near = Math.hypot(S.tip.x - b.x, S.tip.y - b.y) < HOLD_DIST;
  if (S.phase === 'play' && timeLeft(b) <= 0 && !near) teleportBead(b, k);
}

function timeLeft(b) {
  if (S.strung.length < TIMED_FROM) return Infinity;
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
  return Math.abs(d.x * Math.cos(b.theta) + d.y * Math.sin(b.theta)) >= alignCos(k);
}

function checkThread(k) {
  const b = S.bead;
  if (!b || b.life < FADE_FRAMES || S.phase !== 'play') return;
  const ax = Math.cos(b.theta);
  const ay = Math.sin(b.theta);
  const r0x = S.tipPrev.x - b.px;
  const r0y = S.tipPrev.y - b.py;
  const r1x = S.tip.x - b.x;
  const r1y = S.tip.y - b.y;
  const a0 = r0x * ax + r0y * ay;
  const a1 = r1x * ax + r1y * ay;
  if (a0 === 0 || Math.sign(a0) === Math.sign(a1)) return;
  const t = a0 / (a0 - a1);
  const cx = r0x + (r1x - r0x) * t;
  const cy = r0y + (r1y - r0y) * t;
  const perp = Math.abs(-cx * ay + cy * ax);
  if (perp > TARGET_R) return;
  if (perp <= holeTol(k) && isAligned(b, k)) threadBead();
  else hitBead(b);
}

function threadBead() {
  S.strung.push({ s: S.poly.total - NEEDLE_LEN * 0.35, v: -0.6, grow: 0 });
  S.floats.push({ x: S.bead.x, y: S.bead.y - 22, text: `${S.strung.length}`, life: 60, color: '#e8b85c', size: 24 });
  S.bead = null;
  S.spawnIn = 45;
  sfx.thread();
  vibrate(12);
  const n = S.strung.length;
  if (n > S.peak) {
    S.peak = n;
    if (MILESTONES[n]) {
      track('milestone', { beads: n });
      sayQuote(MILESTONES[n], 4200);
      sfx.moktak(CHAPTERS.some((c) => c.at === n) ? 3 : 1);
    }
  }
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
  if (k >= 15) sayQuote(pick(LAMENT_BIG), 4200);
  else if (k >= 4) sayQuote(pick(LAMENT_MID), 3600);
  else if (Math.random() < 0.6) sayQuote(pick(LAMENT_SMALL), 3000);
}

function ringPoint(i, t) {
  const a = -Math.PI / 2 + (i / TOTAL) * Math.PI * 2;
  return { x: W / 2 + Math.cos(a) * 125 * t, y: 330 + Math.sin(a) * 125 * t };
}

function finish() {
  S.phase = 'done';
  S.bead = null;
  S.finishT = 0;
  S.ringFrom = S.strung.map((b) => sampleAt(b.s));
  forget(SAVE_KEY);
  track('game_complete', { seconds: Math.round(S.elapsed), drops: S.drops });
  const best = load(BEST_KEY);
  if (!best || S.elapsed < best.time) store(BEST_KEY, { time: S.elapsed, drops: S.drops });
  sfx.moktak(3);
  vibrate([30, 60, 30, 60, 120]);
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
  store(SAVE_KEY, { n: S.strung.length, elapsed: S.elapsed, drops: S.drops, peak: S.peak });
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
    drawTarget();
  }
  for (const p of S.falling) ctx.drawImage(beadSprite, p.x - BEAD_R, p.y - BEAD_R, BEAD_R * 2, BEAD_R * 2);
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

function drawTarget() {
  const b = S.bead;
  if (!b) return;
  const k = difficulty();
  const fade = Math.min(1, b.life / FADE_FRAMES);
  const left = timeLeft(b);
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
  if (aligned) {
    ctx.fillStyle = 'rgba(255, 214, 120, 0.12)';
    ctx.beginPath();
    ctx.arc(0, 0, TARGET_R + 7, 0, Math.PI * 2);
    ctx.fill();
  }
  paintBead(ctx, 0, 0, TARGET_R);
  ctx.fillStyle = 'rgba(20, 8, 3, 0.35)';
  ctx.fillRect(-TARGET_R + 1, -hole * 0.5, TARGET_R * 2 - 2, hole);
  ctx.fillStyle = '#140803';
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * (TARGET_R - 1.5), 0, 1.8, hole, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
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
const RECORD_WIDTHS = [2, 4, 5];
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

function encodeRecord(n, d, t) {
  const body = [n, d, t].map((v, i) => clamp(Math.round(v), 0, 36 ** RECORD_WIDTHS[i] - 1).toString(36).padStart(RECORD_WIDTHS[i], '0')).join('');
  return scramble(recordCheck(body) + body, 1);
}

function decodeRecord(token) {
  if (!token || !new RegExp(`^[0-9a-z]{${RECORD_LENGTH}}$`).test(token)) return null;
  const plain = scramble(token, -1);
  const body = plain.slice(RECORD_CHECK_WIDTH);
  if (plain.slice(0, RECORD_CHECK_WIDTH) !== recordCheck(body)) return null;
  let at = 0;
  const [n, d, t] = RECORD_WIDTHS.map((w) => Number.parseInt(body.slice(at, (at += w)), 36));
  if (n > TOTAL) return null;
  return { n, d, t: n === TOTAL ? t : 0 };
}

function shareUrl() {
  const u = new URL(location.pathname, location.origin);
  const done = S.phase === 'done';
  u.searchParams.set('r', encodeRecord(done ? TOTAL : S.strung.length, S.drops, done ? S.elapsed : 0));
  return u.toString();
}

function readChallenge() {
  return decodeRecord(new URLSearchParams(location.search).get('r'));
}

function shareText() {
  if (S.phase === 'done') return `108번뇌를 ${formatTimeKo(S.elapsed)} 만에 꿰었다. 떨군 알 ${S.drops}개. 너도 성불해 봐 🙏`;
  return `염주 ${S.strung.length}/108알 꿰는 중… 떨군 알 ${S.drops}개. 넌 108개 다 꿸 수 있을까? 🙏`;
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
  g.fillText('수행 완료', 540, 150);
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
  const best = load(BEST_KEY);
  $('r-time').textContent = formatTime(S.elapsed);
  $('r-drops').textContent = `${S.drops}개`;
  $('r-best').textContent = best ? formatTime(best.time) : '-';
  $('result').hidden = false;
}

function begin(saved) {
  S = saved ? freshState('play', saved.n, saved.elapsed, saved.drops, saved.peak || saved.n) : freshState('play', 0, 0, 0, 0);
  placeStack(saved ? saved.n : 0);
  $('intro').hidden = true;
  $('result').hidden = true;
  audioCtx();
  unlockSpeech();
  sfx.moktak(1);
  track('game_start', { mode: saved ? 'continue' : 'new', beads: S.strung.length });
  sayQuote(saved ? '다시 오셨군요. 번뇌는 그대로 기다리고 있었습니다.' : '바늘 끝이 가는 곳으로, 마음도 갑니다.', 3600);
}

const bgm = { nextBeat: 0, chanting: false, session: 0, line: 0, voice: null };

function pickVoice() {
  if (!('speechSynthesis' in window)) return null;
  const voices = speechSynthesis.getVoices();
  return voices.find((v) => v.lang === 'ko-KR') || voices.find((v) => v.lang.startsWith('ko')) || null;
}

function unlockSpeech() {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(' ');
  u.volume = 0;
  speechSynthesis.speak(u);
}

function bgmOn() {
  return !audio.muted && S.phase === 'play' && !document.hidden;
}

function scheduleMoktak() {
  const a = audio.ctx;
  if (!a || !bgmOn()) {
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

function chantNext(session) {
  if (!bgm.chanting || session !== bgm.session) return;
  const u = new SpeechSynthesisUtterance(SUTRA[bgm.line]);
  u.voice = bgm.voice;
  u.lang = 'ko-KR';
  u.rate = 0.7;
  u.pitch = 0.4;
  u.volume = 0.6;
  u.onend = () => {
    bgm.line = (bgm.line + 1) % SUTRA.length;
    setTimeout(() => chantNext(session), 700);
  };
  speechSynthesis.speak(u);
}

function updateChant() {
  bgm.voice = bgm.voice || pickVoice();
  const want = Boolean(bgm.voice) && bgmOn() && S.strung.length >= CHANT_FROM;
  if (want === bgm.chanting) return;
  bgm.chanting = want;
  bgm.session++;
  if (want) chantNext(bgm.session);
  else speechSynthesis.cancel();
}

function syncSoundButton() {
  $('btn-sound').textContent = audio.muted ? '소리 끔' : '소리 켬';
}

function initIntro() {
  const challenge = readChallenge();
  if (challenge) {
    const el = $('challenge');
    el.textContent = challenge.t
      ? `친구가 108알을 ${formatTimeKo(challenge.t)} 만에 다 꿰었습니다. 떨군 알 ${challenge.d}개. 당신은?`
      : `친구가 ${challenge.n}알까지 꿰었습니다. 떨군 알 ${challenge.d}개. 당신은?`;
    el.hidden = false;
  }
  const saved = load(SAVE_KEY);
  const btn = $('btn-continue');
  if (saved && saved.n > 0) {
    btn.hidden = false;
    btn.textContent = `이어하기 (${saved.n}/108)`;
    $('btn-start').classList.remove('primary');
  }
  btn.addEventListener('click', () => begin(load(SAVE_KEY)));
  $('btn-start').addEventListener('click', () => {
    forget(SAVE_KEY);
    begin(null);
  });
}

$('btn-sound').addEventListener('click', () => {
  audio.muted = !audio.muted;
  store(MUTE_KEY, audio.muted);
  syncSoundButton();
});
$('btn-share').addEventListener('click', share);
document.querySelector('.promo').addEventListener('click', () => track('promo_click'));
$('btn-share-result').addEventListener('click', share);
$('btn-card').addEventListener('click', saveCard);
$('btn-again').addEventListener('click', () => begin(null));
$('btn-restart').addEventListener('click', () => {
  if (S.phase === 'play' && S.strung.length > 0 && !confirm(`${S.strung.length}알을 전부 내려놓고 처음부터 할까요?`)) return;
  forget(SAVE_KEY);
  begin(null);
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
initIntro();
requestAnimationFrame(loop);
