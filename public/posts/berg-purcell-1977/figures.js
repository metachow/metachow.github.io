(() => {
"use strict";
const ZH = !!(document.currentScript && document.currentScript.dataset.lang === "zh");
const tr = (en, zh) => (ZH ? zh : en);
const NS = "http://www.w3.org/2000/svg";
const $ = id => document.getElementById(id);
const tokenScope = document.querySelector(".mc-figure");
const css = n => getComputedStyle(tokenScope).getPropertyValue(n).trim();
const log10 = Math.log10;
const SUP = {"-":"⁻","0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"};
const sup = s => String(s).split("").map(c => SUP[c] ?? c).join("");

function sig(v, d = 2) {
  if (!isFinite(v)) return "–";
  if (v === 0) return "0";
  const a = Math.abs(v);
  if (a >= 1e-3 && a < 1e5) {
    const p = Math.max(0, d - 1 - Math.floor(log10(a)));
    return Number(v.toFixed(Math.min(p, 6))).toLocaleString("en-US", { maximumFractionDigits: Math.min(p, 6) });
  }
  const e = Math.floor(log10(a));
  const m = v / 10 ** e;
  const ms = Number(m.toFixed(d - 1));
  return (ms === 1 ? "" : ms + " × ") + "10" + sup(e);
}
function fmtTime(t) {
  if (!isFinite(t)) return "–";
  if (t < 1e-3) return sig(t * 1e6, 2) + " µs";
  if (t < 1) return sig(t * 1e3, 2) + " ms";
  if (t < 600) return sig(t, 2) + " s";
  if (t < 86400 * 2) return sig(t / 3600, 2) + " h";
  return sig(t / 86400, 2) + " d";
}
function fmtLen(cm) {
  if (cm < 1e-4) return sig(cm * 1e7, 2) + " nm";
  if (cm < 0.1) return sig(cm * 1e4, 2) + " µm";
  if (cm < 100) return sig(cm * 10, 2) + " mm";
  return sig(cm / 100, 2) + " m";
}
function fmtConc(M) {
  if (M >= 1) return sig(M, 2) + " M";
  if (M >= 1e-3) return sig(M * 1e3, 2) + " mM";
  if (M >= 1e-6) return sig(M * 1e6, 2) + " µM";
  if (M >= 1e-9) return sig(M * 1e9, 2) + " nM";
  return sig(M * 1e12, 2) + " pM";
}

/* range styling: --p is the filled fraction of the track, --d the tick at the default */
const rangePct = el => (100 * (+el.value - +el.min) / (+el.max - +el.min)) + "%";
const syncRange = el => el.style.setProperty("--p", rangePct(el));

/* log slider: range 0..1000 mapped to [lo, hi] on a log scale */
function logSlider(id, lo, hi, init, fmt, cb) {
  const el = $(id), out = $(id + "-o");
  const toV = r => 10 ** (log10(lo) + (log10(hi) - log10(lo)) * r / 1000);
  el.value = Math.round(1000 * (log10(init) - log10(lo)) / (log10(hi) - log10(lo)));
  const api = {
    get: () => toV(+el.value),
    set: v => { el.value = Math.round(1000 * (log10(v) - log10(lo)) / (log10(hi) - log10(lo))); upd(); }
  };
  function upd() { syncRange(el); out.textContent = fmt(api.get()); cb && cb(); }
  el.addEventListener("input", upd);
  out.textContent = fmt(api.get());
  return api;
}

/* ---------- SVG plot helper: closed frame, inward ticks on all four sides ---------- */
let clipN = 0;
function el(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function niceStep(range, n) {
  const raw = range / n, e = Math.floor(log10(raw)), m = raw / 10 ** e;
  const s = m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10;
  return s * 10 ** e;
}
function ticksFor(ax) {
  const major = [], minor = [];
  if (ax.log) {
    const e0 = Math.floor(log10(ax.min) + 1e-9), e1 = Math.ceil(log10(ax.max) - 1e-9);
    const step = ax.decadeStep || 1;
    for (let e = e0; e <= e1; e++) {
      const v = 10 ** e;
      if (v >= ax.min * 0.999 && v <= ax.max * 1.001) {
        if (((e % step) + step) % step === 0) major.push(v); else minor.push(v);
      }
      if (step === 1) for (let k = 2; k <= 9; k++) { const w = k * v; if (w > ax.min && w < ax.max) minor.push(w); }
    }
  } else {
    const st = ax.step || niceStep(ax.max - ax.min, 5);
    const lead = Math.round(st / 10 ** Math.floor(log10(st)));
    const sub = lead === 2 ? 4 : 5;
    for (let v = Math.ceil(ax.min / st - 1e-9) * st; v <= ax.max + st * 1e-6; v += st) major.push(+v.toPrecision(10));
    for (let v = Math.ceil(ax.min / (st / sub) - 1e-9) * (st / sub); v <= ax.max + 1e-12; v += st / sub) {
      const w = +v.toPrecision(10);
      if (!major.some(M => Math.abs(M - w) < st * 1e-6)) minor.push(w);
    }
  }
  return { major, minor };
}
function tickLabel(v, ax) {
  if (ax.fmt) return ax.fmt(v);
  if (ax.log) {
    if (v >= 1e-3 && v < 1e4) return String(+v.toPrecision(3));
    return "10" + sup(Math.round(log10(v)));
  }
  return String(+v.toPrecision(6));
}
function addLabel(parent, segs, x, y, rot) {
  const t = el("text", { x, y, class: "mc-plot-label", "text-anchor": "middle" }, parent);
  if (rot) t.setAttribute("transform", `rotate(-90 ${x} ${y})`);
  let shift = 0;
  for (const s of segs) {
    const ts = el("tspan", {}, t);
    if (s.m) ts.setAttribute("class", "m");
    if (s.sub) { ts.setAttribute("dy", 4); ts.setAttribute("font-size", "11"); shift += 4; }
    else if (shift) { ts.setAttribute("dy", -shift); shift = 0; }
    ts.textContent = s.t;
  }
  return t;
}
class Plot {
  constructor(host, o) {
    host.innerHTML = "";
    /* one SVG unit = one CSS pixel, so text keeps its size on a phone */
    const W = Math.round(Math.min(680, Math.max(300, host.clientWidth || 640)));
    const H = o.height || Math.round(Math.min(380, Math.max(260, W * 0.6)));
    const m = Object.assign({ l: 64, r: 18, t: 14, b: 52 }, o.m || {});
    this.x = o.x; this.y = o.y;
    this.px0 = m.l; this.px1 = W - m.r; this.py0 = H - m.b; this.py1 = m.t;
    /* thin out decade labels on a log x axis when they would collide */
    if (this.x.log && !this.x.decadeStep) {
      const dec = log10(this.x.max / this.x.min), room = (this.px1 - this.px0) / dec;
      this.x = Object.assign({}, this.x, { decadeStep: Math.max(1, Math.ceil((this.x.labelW || 44) / room)) });
    }
    const svg = this.svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": o.aria || "" }, host);
    const cid = "clip" + (++clipN);
    const defs = el("defs", {}, svg);
    el("rect", { x: m.l, y: m.t, width: this.px1 - m.l, height: this.py0 - m.t }, el("clipPath", { id: cid }, defs));
    el("rect", { x: m.l, y: m.t, width: this.px1 - m.l, height: this.py0 - m.t, class: "plot-bg" }, svg);
    this.data = el("g", { "clip-path": `url(#${cid})` }, svg);
    this.over = el("g", {}, svg);
    const fr = el("g", {}, svg);
    const T = 6, t = 3;
    const tx = ticksFor(this.x), ty = ticksFor(this.y);
    const tick = (x1, y1, x2, y2) => el("line", { x1, y1, x2, y2, class: "mc-plot-axis" }, fr);
    for (const v of tx.major) { const X = this.sx(v); tick(X, this.py0, X, this.py0 - T); tick(X, this.py1, X, this.py1 + T);
      el("text", { x: X, y: this.py0 + 17, class: "mc-plot-tick", "text-anchor": "middle" }, fr).textContent = tickLabel(v, this.x); }
    for (const v of tx.minor) { const X = this.sx(v); tick(X, this.py0, X, this.py0 - t); tick(X, this.py1, X, this.py1 + t); }
    if (o.yTicks === false) { ty.major = []; ty.minor = []; }
    for (const v of ty.major) { const Y = this.sy(v); tick(this.px0, Y, this.px0 + T, Y); tick(this.px1, Y, this.px1 - T, Y);
      el("text", { x: this.px0 - 7, y: Y + 4, class: "mc-plot-tick", "text-anchor": "end" }, fr).textContent = tickLabel(v, this.y); }
    for (const v of ty.minor) { const Y = this.sy(v); tick(this.px0, Y, this.px0 + t, Y); tick(this.px1, Y, this.px1 - t, Y); }
    el("rect", { x: m.l, y: m.t, width: this.px1 - m.l, height: this.py0 - m.t, class: "mc-plot-axis" }, fr);
    if (o.xlabel) addLabel(fr, o.xlabel, (this.px0 + this.px1) / 2, H - 12);
    if (o.ylabel) addLabel(fr, o.ylabel, 16, (this.py0 + this.py1) / 2, true);
  }
  sx(v) { const a = this.x; const t = a.log ? (log10(v) - log10(a.min)) / (log10(a.max) - log10(a.min)) : (v - a.min) / (a.max - a.min); return this.px0 + t * (this.px1 - this.px0); }
  sy(v) { const a = this.y; const t = a.log ? (log10(v) - log10(a.min)) / (log10(a.max) - log10(a.min)) : (v - a.min) / (a.max - a.min); return this.py0 - t * (this.py0 - this.py1); }
  line(pts, cls, g = this.data) {
    let d = "", pen = false;
    for (const [x, y] of pts) {
      const X = this.sx(x), Y = this.sy(y);
      if (!isFinite(X) || !isFinite(Y)) { pen = false; continue; }
      d += (pen ? "L" : "M") + X.toFixed(1) + " " + Y.toFixed(1); pen = true;
    }
    return el("path", { d, class: cls }, g);
  }
  marker(x, y, shape, cls, r = 4.5, g = this.over) {
    const X = this.sx(x), Y = this.sy(y);
    if (!isFinite(X) || !isFinite(Y)) return;
    if (X < this.px0 - 1 || X > this.px1 + 1 || Y > this.py0 + 1 || Y < this.py1 - 1) return;
    if (shape === "s") return el("rect", { x: X - r, y: Y - r, width: 2 * r, height: 2 * r, class: cls }, g);
    if (shape === "d") return el("path", { d: `M${X} ${Y - r * 1.25}L${X + r * 1.25} ${Y}L${X} ${Y + r * 1.25}L${X - r * 1.25} ${Y}Z`, class: cls }, g);
    return el("circle", { cx: X, cy: Y, r, class: cls }, g);
  }
  text(x, y, s, cls, anchor = "start", dx = 0, dy = 0) {
    const t = el("text", { x: this.sx(x) + dx, y: this.sy(y) + dy, class: "mc-plot-note " + cls, "text-anchor": anchor }, this.over);
    t.textContent = s; return t;
  }
}
const logspace = (a, b, n) => Array.from({ length: n }, (_, i) => 10 ** (log10(a) + (log10(b) - log10(a)) * i / (n - 1)));

/* ======================= Fig. 1: tries on a whole cell ======================= */
function fitCanvas(cv) {
  /* the CSS height is read once from the markup; cv.height is the backing store and changes with the pixel ratio */
  if (!cv.dataset.h) cv.dataset.h = cv.getAttribute("height");
  const r = window.devicePixelRatio || 1, w = cv.clientWidth, h = +cv.dataset.h;
  if (cv.width !== Math.round(w * r) || cv.height !== Math.round(h * r)) {
    cv.width = Math.round(w * r); cv.height = Math.round(h * r); cv.style.height = h + "px";
  }
  const ctx = cv.getContext("2d"); ctx.setTransform(r, 0, 0, r, 0, 0);
  return { ctx, w, h };
}

/* The model, in units of the patch radius s: a sphere of radius A carrying N absorbing patches
   on a spherical Fibonacci lattice, the rest of the surface reflecting. In the layer
   A < r < A + 1 the walk is stepped. On reaching r0 >= A + 1 the molecule escapes for good with
   probability 1 - A/r0 (Eq. 4), otherwise it lands on the sphere at a point drawn from the
   exterior Poisson kernel. That jump is exact for Brownian motion, so only the layer is stepped. */
const GOLD = Math.PI * (3 - Math.sqrt(5)), DELTA = 0.2;
function makeCell(A, N) {
  const P = new Float64Array(3 * N);
  for (let i = 0; i < N; i++) {
    const z = 1 - (2 * i + 1) / N, r = Math.sqrt(1 - z * z), ph = i * GOLD;
    P[3 * i] = r * Math.cos(ph); P[3 * i + 1] = r * Math.sin(ph); P[3 * i + 2] = z;
  }
  const cosA = Math.cos(1 / A);
  const g = Math.max(2 / A, Math.sqrt(4 * Math.PI / N));
  const K = Math.ceil(2 / g) + 3;
  const cellOf = v => Math.floor((v + 1) / g) + 1;
  const grid = new Map();
  for (let i = 0; i < N; i++) {
    const k = cellOf(P[3 * i]) + K * (cellOf(P[3 * i + 1]) + K * cellOf(P[3 * i + 2]));
    const l = grid.get(k); if (l) l.push(i); else grid.set(k, [i]);
  }
  function patchAt(x, y, z) {
    const ix = cellOf(x), iy = cellOf(y), iz = cellOf(z);
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) {
      const l = grid.get((ix + a) + K * ((iy + b) + K * (iz + c)));
      if (l) for (const i of l) if (x * P[3 * i] + y * P[3 * i + 1] + z * P[3 * i + 2] > cosA) return i;
    }
    return -1;
  }
  /* call f(i) for every patch whose centre lies in the cap c·p > cosLim (a superset is fine) */
  function eachNear(c, cosLim, f) {
    const chord = Math.sqrt(Math.max(0, 2 - 2 * cosLim)), n = Math.ceil(2 * chord / g) + 2;
    if (n * n * n > N) { for (let i = 0; i < N; i++) f(i); return; }
    const x0 = cellOf(c[0] - chord), y0 = cellOf(c[1] - chord), z0 = cellOf(c[2] - chord);
    for (let a = 0; a <= n; a++) for (let b = 0; b <= n; b++) for (let d = 0; d <= n; d++) {
      const l = grid.get((x0 + a) + K * ((y0 + b) + K * (z0 + d)));
      if (l) for (const i of l) f(i);
    }
  }
  return { A, N, P, patchAt, eachNear };
}
let gSpare = null;
function gauss() {
  if (gSpare !== null) { const v = gSpare; gSpare = null; return v; }
  let u = 0; while (u === 0) u = Math.random();
  const r = Math.sqrt(-2 * Math.log(u)), t = 2 * Math.PI * Math.random();
  gSpare = r * Math.sin(t); return r * Math.cos(t);
}
const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const unit = p => { const n = Math.hypot(p[0], p[1], p[2]); return [p[0] / n, p[1] / n, p[2] / n]; };
function rotate(v, k, t) { /* Rodrigues: v about the unit axis k by angle t */
  const c = Math.cos(t), s = Math.sin(t), kv = cross(k, v), d = dot(k, v) * (1 - c);
  return [v[0] * c + kv[0] * s + k[0] * d, v[1] * c + kv[1] * s + k[1] * d, v[2] * c + kv[2] * s + k[2] * d];
}
function randomUnit() {
  const z = 2 * Math.random() - 1, r = Math.sqrt(1 - z * z), p = 2 * Math.PI * Math.random();
  return [r * Math.cos(p), r * Math.sin(p), z];
}
function tilt(d, u) { /* d turned by the polar angle acos(u), random azimuth */
  const e1 = unit(cross(d, Math.abs(d[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0])), e2 = cross(d, e1);
  const s = Math.sqrt(Math.max(0, 1 - u * u)), p = 2 * Math.PI * Math.random(), c = Math.cos(p), sn = Math.sin(p);
  return [0, 1, 2].map(i => u * d[i] + s * (c * e1[i] + sn * e2[i]));
}
/* a molecule arriving from far away first touches the cell at a uniformly random point */
const newMolecule = () => ({ d: randomUnit(), tries: 0, done: false, captured: false, patch: -1 });
/* one try: from the contact point m.d through the near-surface layer to r >= A + 1, then escape or land */
function advance(m, cell, rec) {
  const A = cell.A;
  m.tries++;
  if (rec) rec.tryAt(m.d);
  let hit = cell.patchAt(m.d[0], m.d[1], m.d[2]);
  if (hit >= 0) { m.done = m.captured = true; m.patch = hit; return; }
  let x = m.d[0] * A, y = m.d[1] * A, z = m.d[2] * A, r = A;
  for (;;) {
    x += gauss() * DELTA; y += gauss() * DELTA; z += gauss() * DELTA;
    r = Math.sqrt(x * x + y * y + z * z);
    if (r <= A) {
      const rr = 2 * A - r, f = rr / r; x *= f; y *= f; z *= f;
      const ux = x / rr, uy = y / rr, uz = z / rr;
      if (rec) rec.contact(ux, uy, uz);
      hit = cell.patchAt(ux, uy, uz);
      if (hit >= 0) { m.d = [ux, uy, uz]; m.done = m.captured = true; m.patch = hit; return; }
      r = rr;
    } else if (r >= A + 1) break;
  }
  if (Math.random() > A / r) { m.d = [x / r, y / r, z / r]; m.done = true; return; }
  const w = 1 / (r + A) + Math.random() * (1 / (r - A) - 1 / (r + A));
  const u = Math.min(1, Math.max(-1, (r * r + A * A - 1 / (w * w)) / (2 * A * r)));
  m.d = tilt([x / r, y / r, z / r], u);
}

/* ---- state ---- */
const RATES = [3, 10, 30, 100, 300, 1000];
const sph = { A: 100, x: 1, cell: null, mol: null, trail: [], contacts: [], playing: true, pause: 0, acc: 0, last: 0,
  c: unit([0.36, -0.48, 0.8]), e1: null, e2: null, follow: true, onScreen: false, raf: 0 };
sph.e1 = unit(cross([0, 0, 1], sph.c)); sph.e2 = cross(sph.c, sph.e1);
const stats = new Map(); /* "A|N" -> {A, N, n, cap, tries} */
const nFor = (A, x) => Math.max(1, Math.round(x * Math.PI * A));
const rec = {
  tryAt(d) { sph.trail.push(d.slice()); if (sph.trail.length > 4000) sph.trail.splice(0, 500); },
  contact(x, y, z) { sph.contacts.push([x, y, z]); if (sph.contacts.length > 4000) sph.contacts.splice(0, 500); }
};
function tally(A, N, m) {
  const k = A + "|" + N, e = stats.get(k) || { A, N, n: 0, cap: 0, tries: 0 };
  e.n++; e.tries += m.tries; if (m.captured) e.cap++;
  stats.set(k, e);
}
function startMolecule() { sph.mol = newMolecule(); sph.trail = []; sph.contacts = []; sph.pause = 0; sph.acc = 0; }
function rebuildCell() {
  sph.cell = makeCell(sph.A, nFor(sph.A, sph.x));
  startMolecule();
  updateSphereReadouts(); drawStats(); kickSphere();
}

/* ---- controls ---- */
const spX = logSlider("sp-x", 0.01, 10, 1, x => nFor(sph.A, x).toLocaleString("en-US"), () => { sph.x = spX.get(); rebuildCell(); });
$("sp-rate").addEventListener("input", e => { $("sp-rate-o").textContent = RATES[+e.target.value] + tr(" tries/s", " 次/秒"); });
$("sp-rate-o").textContent = RATES[+$("sp-rate").value] + tr(" tries/s", " 次/秒");
const zoomMax = w => Math.max(1, (w / 24) * sph.A / (0.42 * Math.min(w, 360)));
const zoomNow = w => zoomMax(w) ** (+$("sp-zoom").value / 1000);
function showZoom() { $("sp-zoom-o").textContent = "×" + sig(zoomNow($("sp-cv").clientWidth || 640), 2); kickSphere(); }
$("sp-zoom").addEventListener("input", showZoom);
document.querySelectorAll("[data-as]").forEach(b => b.addEventListener("click", () => {
  sph.A = +b.dataset.as;
  document.querySelectorAll("[data-as]").forEach(o => o.setAttribute("aria-pressed", o === b));
  $("sp-x-o").textContent = nFor(sph.A, sph.x).toLocaleString("en-US");
  rebuildCell(); showZoom();
}));
function setSpherePlaying(on) {
  sph.playing = on;
  const b = $("sp-play"); b.textContent = on ? tr("Pause", "暂停") : tr("Play", "播放"); b.setAttribute("aria-pressed", on);
  kickSphere();
}
function setFollow(on) { sph.follow = on; $("sp-follow").setAttribute("aria-pressed", on); kickSphere(); }
$("sp-play").addEventListener("click", () => setSpherePlaying(!sph.playing));
$("sp-next").addEventListener("click", () => { startMolecule(); kickSphere(); });
$("sp-follow").addEventListener("click", () => setFollow(!sph.follow));

/* drag turns the cell (and stops following the molecule) */
{
  const cv = $("sp-cv"); let drag = null;
  cv.addEventListener("pointerdown", e => { drag = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); });
  cv.addEventListener("pointermove", e => {
    if (!drag) return;
    const w = cv.clientWidth, h = +cv.dataset.h || 360, Rpx = 0.42 * Math.min(w, h) * zoomNow(w);
    const dx = e.clientX - drag[0], dy = e.clientY - drag[1]; drag = [e.clientX, e.clientY];
    if (dx === 0 && dy === 0) return;
    if (sph.follow) setFollow(false);
    const t1 = -dx / Rpx, t2 = -dy / Rpx, a1 = sph.e2.slice(), a2 = sph.e1.slice();
    sph.c = rotate(sph.c, a1, t1); sph.e1 = rotate(sph.e1, a1, t1);
    sph.c = rotate(sph.c, a2, t2); sph.e2 = rotate(sph.e2, a2, t2);
    sph.c = unit(sph.c); sph.e1 = unit(sph.e1); sph.e2 = cross(sph.c, sph.e1);
    kickSphere();
  });
  const end = () => { drag = null; };
  cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
}

/* ---- drawing ---- */
function niceLen(px, k) { /* a 1-2-5 length in s whose bar is about px long */
  const raw = px / k, e = Math.floor(log10(raw)), m = raw / 10 ** e;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * 10 ** e;
}
function drawSphere() {
  const cv = $("sp-cv"), { ctx, w, h } = fitCanvas(cv);
  const C = { paper: css("--paper"), raised: css("--paper-raised"), ink: css("--ink"), muted: css("--ink-muted"),
    sky: css("--sky"), soft: css("--sky-soft"), ochre: css("--data-2"), ctxc: css("--data-context") };
  const fSans = css("--font-sans"), fMath = css("--font-math");
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, w, h);
  const A = sph.A, Rpx = 0.42 * Math.min(w, h) * zoomNow(w), k = Rpx / A, cx = w / 2, cy = h / 2;
  const { c, e1, e2 } = sph;
  const X = p => cx + dot(p, e1) * Rpx, Y = p => cy - dot(p, e2) * Rpx;
  /* the cell */
  if (Rpx < 4 * Math.hypot(w, h)) {
    ctx.beginPath(); ctx.arc(cx, cy, Rpx, 0, 7); ctx.fillStyle = C.raised; ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.stroke();
  } else { ctx.fillStyle = C.raised; ctx.fillRect(0, 0, w, h); }
  /* the part of the sphere in view */
  const half = Math.hypot(w, h) / 2 + 8, sinV = Math.min(1, half / Rpx);
  const cosLim = sinV < 1 ? Math.sqrt(1 - sinV * sinV) - 1e-9 : 0;
  const inView = p => dot(p, c) > cosLim;
  /* receptors: to scale, or 1.5 px dots when they would be smaller than a pixel */
  const rp = k, tiny = rp < 0.9, cell = sph.cell, P = cell.P, m = sph.mol;
  ctx.fillStyle = rp >= 2.5 ? C.soft : C.sky; ctx.strokeStyle = C.sky; ctx.lineWidth = 1;
  cell.eachNear(c, cosLim, i => {
    const p = [P[3 * i], P[3 * i + 1], P[3 * i + 2]];
    if (!inView(p)) return;
    const px = X(p), py = Y(p);
    if (px < -rp || px > w + rp || py < -rp || py > h + rp) return;
    if (tiny) ctx.fillRect(px - 0.75, py - 0.75, 1.5, 1.5);
    else { ctx.beginPath(); ctx.arc(px, py, rp, 0, 7); ctx.fill(); if (rp >= 2.5) ctx.stroke(); }
  });
  /* contacts within tries, once zoomed in far enough to tell them apart */
  if (k >= 3) {
    ctx.fillStyle = C.ctxc;
    for (const p of sph.contacts) if (inView(p)) ctx.fillRect(X(p) - 1, Y(p) - 1, 2, 2);
  }
  /* the path from try to try, along great circles */
  ctx.strokeStyle = C.ctxc; ctx.lineWidth = 1; ctx.beginPath();
  const T = sph.trail;
  for (let i = 1; i < T.length; i++) {
    const p = T[i - 1], q = T[i], ang = Math.acos(Math.min(1, dot(p, q)));
    const n = Math.min(64, Math.max(1, Math.ceil(ang / 0.02))), sa = Math.sin(ang);
    let prev = false;
    for (let j = 0; j <= n; j++) {
      const t = j / n;
      const r = ang < 1e-6 ? (j ? q : p) : [0, 1, 2].map(a => (p[a] * Math.sin((1 - t) * ang) + q[a] * Math.sin(t * ang)) / sa);
      const vis = dot(r, c) > 0;
      if (vis && prev) ctx.lineTo(X(r), Y(r)); else if (vis) ctx.moveTo(X(r), Y(r));
      prev = vis;
    }
  }
  ctx.stroke();
  ctx.fillStyle = C.muted;
  for (const p of T) if (inView(p)) { ctx.beginPath(); ctx.arc(X(p), Y(p), 2, 0, 7); ctx.fill(); }
  /* where the molecule is now */
  const cur = m.d;
  if (dot(cur, c) > 0) {
    if (m.captured) {
      const q = [P[3 * m.patch], P[3 * m.patch + 1], P[3 * m.patch + 2]];
      ctx.strokeStyle = C.ochre; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(X(q), Y(q), Math.max(rp, 3) + 4, 0, 7); ctx.stroke();
      ctx.fillStyle = C.ochre; ctx.beginPath(); ctx.arc(X(cur), Y(cur), 3, 0, 7); ctx.fill();
    } else {
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
      if (m.done) ctx.setLineDash([2, 2]);
      ctx.beginPath(); ctx.arc(X(cur), Y(cur), 5, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    }
  }
  /* scale bar, and a note while the receptors are not to scale */
  const L = niceLen(80, k), Lpx = L * k;
  ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(12, h - 14); ctx.lineTo(12 + Lpx, h - 14); ctx.stroke();
  ctx.fillStyle = C.ink; ctx.font = "12px " + fSans;
  const lab = L.toLocaleString("en-US") + " ";
  ctx.fillText(lab, 18 + Lpx, h - 10);
  ctx.font = "italic 14px " + fMath; ctx.fillText("s", 18 + Lpx + ctx.measureText(lab).width + 1, h - 10);
  if (tiny) {
    ctx.font = "12px " + fSans; ctx.fillStyle = C.muted;
    ctx.fillText(w < 520 ? tr("Receptors drawn as dots; zoom in for true size.", "受体画成小点；放大可见真实大小。") : tr("Receptors are smaller than a pixel here and drawn as dots; zoom in to see them to scale.", "此缩放下受体不到一个像素，画成小点；放大后按真实比例显示。"), 12, 20);
  }
  $("sp-status").textContent = !m.done ? tr(`Try ${m.tries} · about ${A} expected for a/s = ${A}`, `第 ${m.tries} 次尝试 · a/s = ${A} 时平均约 ${A} 次`)
    : m.captured ? tr(`Captured by a receptor on try ${m.tries}.`, `第 ${m.tries} 次尝试时被受体捕获。`)
    : tr(`Escaped for good after ${m.tries} ${m.tries === 1 ? "try" : "tries"}.`, `尝试 ${m.tries} 次后永久逃逸。`);
}
function sphereFrame(t) {
  sph.raf = 0;
  const dt = sph.last ? Math.min(0.1, (t - sph.last) / 1000) : 0; sph.last = t;
  const m = sph.mol;
  if (sph.playing) {
    if (!m.done) {
      sph.acc += RATES[+$("sp-rate").value] * dt;
      while (sph.acc >= 1 && !m.done) { advance(m, sph.cell, rec); sph.acc -= 1; }
      if (m.done) { sph.pause = 1.6; tally(sph.A, sph.cell.N, m); updateSphereReadouts(); drawStats(); }
    } else if ((sph.pause -= dt) <= 0) startMolecule();
  }
  let moving = false;
  if (sph.follow) { /* ease the view towards the molecule */
    const P = sph.cell.P, tgt = m.captured ? [P[3 * m.patch], P[3 * m.patch + 1], P[3 * m.patch + 2]] : m.d;
    const ax = cross(sph.c, tgt), s = Math.hypot(ax[0], ax[1], ax[2]), full = Math.atan2(s, dot(sph.c, tgt));
    if (full > 1e-4) {
      const ang = full * Math.min(1, 6 * dt + 0.02), k = s > 1e-9 ? [ax[0] / s, ax[1] / s, ax[2] / s] : sph.e2;
      sph.c = unit(rotate(sph.c, k, ang)); sph.e1 = unit(rotate(sph.e1, k, ang)); sph.e2 = cross(sph.c, sph.e1);
      moving = true;
    }
  }
  drawSphere();
  if (sph.onScreen && (sph.playing || moving)) sph.raf = requestAnimationFrame(sphereFrame); else sph.last = 0;
}
function kickSphere() { if (!sph.raf && sph.mol) sph.raf = requestAnimationFrame(sphereFrame); }

/* ---- panel c: fraction captured against Ns/πa ---- */
function updateSphereReadouts() {
  const A = sph.A, N = sph.cell.N, e = stats.get(A + "|" + N), x = N / (Math.PI * A);
  $("st-cov").textContent = sig(N / (4 * A * A), 2);
  $("st-n").textContent = e ? e.n.toLocaleString("en-US") : "0";
  $("st-tries").textContent = e ? (e.tries / e.n).toFixed(1) : "–";
  $("st-tries-t").textContent = `a/s = ${A}`;
  if (e) { const p = e.cap / e.n; $("st-cap").textContent = p.toFixed(3) + " ± " + Math.sqrt(p * (1 - p) / e.n).toFixed(3); }
  else $("st-cap").textContent = "–";
  $("st-eq8").textContent = (x / (1 + x)).toFixed(3);
  $("st-eq13").textContent = (Math.PI * x / (4 + Math.PI * x)).toFixed(3);
}
function drawStats() {
  const p = new Plot($("st-plot"), {
    x: { min: 0.01, max: 10, log: true }, y: { min: 0, max: 1, step: 0.2 },
    xlabel: [{ t: tr("Receptors in units of the half-intake number, ", "受体数（以摄入减半的受体数为单位）") }, { t: "Ns", m: true }, { t: "/π" }, { t: "a", m: true }],
    ylabel: [{ t: tr("Fraction captured", "被捕获的比例") }],
    aria: "Fraction of molecules captured against N s over pi a"
  });
  const xs = logspace(0.01, 10, 160);
  p.line(xs.map(x => [x, x / (1 + x)]), "mc-s1");
  p.line(xs.map(x => [x, Math.PI * x / (4 + Math.PI * x)]), "mc-s2");
  const xc = sph.cell.N / (Math.PI * sph.A);
  p.line([[xc, 0], [xc, 1]], "mc-plot-guide");
  for (const e of stats.values()) {
    const x = e.N / (Math.PI * e.A), y = e.cap / e.n, se = Math.sqrt(Math.max(y * (1 - y), 0.25 / e.n) / e.n);
    p.line([[x, Math.max(0, y - se)], [x, Math.min(1, y + se)]], "mc-d2");
    p.marker(x, y, "s", "mc-d2-mark", 4);
  }
  p.text(0.3, 0.3 / 1.3, tr("Eq. 8", "公式 8"), "t-d1", "end", -8, -4);
  p.text(2.5, Math.PI * 2.5 / (4 + Math.PI * 2.5), tr("Eq. 13", "公式 13"), "t-ink", "start", 6, 16);
  p.text(0.012, 0.93, stats.size ? tr("squares: simulation, ±1 standard error", "方块：模拟结果，误差棒为 ±1 个标准误") : tr("simulated molecules are added here", "模拟的分子会累积在这里"), "t-d2", "start");
}
$("st-run").addEventListener("click", e => {
  const btn = e.target.closest("button"); btn.disabled = true;
  const cell = sph.cell, A = sph.A, total = 400; let left = total;
  (function chunk() {
    const t0 = performance.now();
    while (left > 0 && performance.now() - t0 < 40) {
      const m = newMolecule(); while (!m.done) advance(m, cell, null);
      tally(A, cell.N, m); left--;
    }
    $("st-note").textContent = left ? tr(`simulating… ${total - left} of ${total}`, `正在模拟… ${total - left} / ${total}`) : tr(`${total} molecules added at a/s = ${A}, N = ${cell.N.toLocaleString("en-US")}`, `已加入 ${total} 个分子（a/s = ${A}，N = ${cell.N.toLocaleString("en-US")}）`);
    updateSphereReadouts(); drawStats();
    if (left > 0 && cell === sph.cell) setTimeout(chunk, 0); else btn.disabled = false;
  })();
});
$("st-clear").addEventListener("click", () => { stats.clear(); $("st-note").textContent = ""; updateSphereReadouts(); drawStats(); });

/* ---- panel a: what counts as a try (after Fig. 1 of the paper) ---- */
function drawSchematic() {
  const host = $("sc-plot"); host.innerHTML = "";
  const W = Math.round(Math.min(680, Math.max(300, host.clientWidth || 640))), H = 150, sx = W / 640;
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": tr("Side view of a molecule touching the surface at A, B, C and D before escaping", "侧视图：分子在 A、B、C、D 处接触表面，然后逃逸") }, host);
  const S = 118, Ls = 78; /* the surface, and the line at distance s from it */
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5; };
  const legs = [[[70, S], [92, 96], [118, 64], [150, 50], [182, 66], [206, 98], [226, S]],
    [[226, S], [240, 104], [256, S], [262, 108], [270, S], [298, 100], [330, 82], [362, 64], [410, 46], [470, 30], [540, 14]]];
  let d = "";
  for (const leg of legs) for (let i = 1; i < leg.length; i++) {
    const [x0, y0] = leg[i - 1], [x1, y1] = leg[i], n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / 5));
    for (let j = d ? 1 : 0; j <= n; j++) {
      const t = j / n, edge = j === 0 || j === n;
      const x = x0 + (x1 - x0) * t + (edge ? 0 : rnd() * 5), y = Math.min(S, y0 + (y1 - y0) * t + (edge ? 0 : rnd() * 6));
      d += (d ? "L" : "M") + (x * sx).toFixed(1) + " " + y.toFixed(1);
    }
  }
  el("line", { x1: 0, y1: Ls, x2: W, y2: Ls, class: "mc-plot-guide" }, svg);
  el("line", { x1: 330 * sx, y1: S + 2, x2: 410 * sx, y2: S + 2, class: "mc-d1", "stroke-width": 4 }, svg);
  el("line", { x1: 0, y1: S, x2: W, y2: S, class: "mc-plot-axis", "stroke-width": 1.5 }, svg);
  el("path", { d, class: "sc-path" }, svg);
  const ex = 540 * sx, ey = 14;
  el("path", { d: `M${ex - 9} ${ey + 1}L${ex} ${ey}L${ex - 6} ${ey + 8}`, class: "sc-path" }, svg);
  const label = (x, y, segs, cls, anchor = "middle") => {
    const t = el("text", { x, y, class: "mc-plot-note " + cls, "text-anchor": anchor }, svg);
    for (const s of segs) { const ts = el("tspan", s.m ? { class: "m" } : {}, t); ts.textContent = s.t; }
  };
  for (const x of [70, 226, 256, 270]) el("circle", { cx: x * sx, cy: S, r: 3, class: "sc-dot" }, svg);
  label(70 * sx, S + 18, [{ t: "A" }], "t-ink"); label(226 * sx, S + 18, [{ t: "B" }], "t-ink");
  label(252 * sx, S + 18, [{ t: "C" }], "t-ink"); label(276 * sx, S + 18, [{ t: "D" }], "t-ink");
  label(370 * sx, S + 22, [{ t: tr("receptor", "受体") }], "t-d1");
  label(6, Ls - 6, [{ t: "s", m: true }], "t-muted", "start");
  label(148 * sx, 40, [{ t: tr("try 1", "第 1 次尝试") }], "t-muted");
  label(292 * sx, 70, [{ t: tr("try 2", "第 2 次尝试") }], "t-muted");
  label(W - 4, 66, [{ t: W < 520 ? tr("escapes: ", "逃逸：") : tr("escapes with probability ", "逃逸概率 ") }, { t: "s", m: true }, { t: "/(" }, { t: "a", m: true }, { t: " + " }, { t: "s", m: true }, { t: ")" }], "t-muted", "end");
}

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) sph.playing = false;
drawSchematic();
rebuildCell();
setSpherePlaying(sph.playing);
showZoom();
new IntersectionObserver(es => { sph.onScreen = es[0].isIntersecting; if (sph.onScreen) kickSphere(); }).observe($("sp-cv"));

/* ======================= depletion zone and capture probability (section 1) ======================= */
if ($("dz-cv")) {
  /* lengths in units of the cell radius a; walkers are stepped in 3D out to R_OUT, where the exact
     answer takes over: return with probability 1/r (Eq. 4), landing by the exterior Poisson kernel */
  const DZ_STEP = 0.05, R_OUT = 9, D_CM = 1e-5, C_UM = 6e14; /* molecules per cm³ at 1 µM */
  const dz = { walkers: [], runs: new Map(), raf: 0, layer: document.createElement("canvas") };
  const dzA = logSlider("dz-a", 0.5, 5, 1, v => sig(v, 2) + " µm", () => { dzReadouts(); drawDZ(); });
  const dzR = logSlider("dz-r", 1.1, 8, 3, v => sig(v, 2) + " a", () => { dzReadouts(); drawDZ(); drawDZPlot(); });
  const hex2rgb = h => { h = h.replace("#", ""); if (h.length === 3) h = h.replace(/./g, "$&$&"); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  function dzGeom(w, h) { const cx = w * 0.36; return { k: Math.min(h / 2 / 4.2, (w - cx - 12) / 8.2), cx, cy: h / 2 }; } /* px per a: 4a above and below, 8a to the right */
  function dzKey() { return dzR.get().toFixed(2); }
  function dzReadouts() {
    const a = dzA.get(), r = dzR.get(), J = 4 * Math.PI * a * 1e-4 * D_CM * C_UM;
    $("dz-J").textContent = sig(J, 2) + tr(" per s", " 个/秒");
    $("dz-area").textContent = "×" + sig(a * a, 2);
    $("dz-grad").textContent = "×" + sig(1 / a, 2);
    $("dz-cur").textContent = "×" + sig(a, 2);
    $("dz-p").textContent = (1 / r).toFixed(3);
    const e = dz.runs.get(dzKey());
    $("dz-sim").textContent = e ? `${e.cap} / ${e.n}` : "–";
  }
  function drawDZ() {
    const cv = $("dz-cv"), { ctx, w, h } = fitCanvas(cv), { k, cx, cy } = dzGeom(w, h);
    const C = { paper: css("--paper"), raised: css("--paper-raised"), ink: css("--ink"), muted: css("--ink-muted"),
      sky: css("--sky"), ochre: css("--data-2"), ctxc: css("--data-context") };
    const fSans = css("--font-sans"), fMath = css("--font-math");
    /* the depletion zone: sky, stronger where the concentration is higher (c/c∞ = 1 - a/r) */
    ctx.fillStyle = C.raised; ctx.fillRect(0, 0, w, h);
    const R = Math.hypot(Math.max(cx, w - cx), cy), [sr, sg, sb] = hex2rgb(C.sky);
    const g = ctx.createRadialGradient(cx, cy, k, cx, cy, R);
    for (let i = 0; i <= 24; i++) {
      const r = 1 + (R / k - 1) * i / 24, t = (r - 1) / (R / k - 1);
      g.addColorStop(t, `rgba(${sr},${sg},${sb},${(0.42 * (1 - 1 / r)).toFixed(3)})`);
    }
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    /* contours at c/c∞ = 50% (r = 2a) and 75% (r = 4a) */
    ctx.strokeStyle = C.muted; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.font = "12px " + fSans; ctx.fillStyle = C.ink;
    for (const [r, lab] of [[2, "50%"], [4, "75%"]]) {
      ctx.beginPath(); ctx.arc(cx, cy, r * k, 0, 7); ctx.stroke();
      ctx.textAlign = "right"; ctx.fillText(lab, cx - r * k * 0.71 - 3, cy - r * k * 0.71 - 3); ctx.textAlign = "left";
    }
    ctx.setLineDash([]);
    /* trails of released molecules */
    if (dz.layer.width) ctx.drawImage(dz.layer, 0, 0, w, h);
    /* the cell */
    ctx.beginPath(); ctx.arc(cx, cy, k, 0, 7); ctx.fillStyle = C.paper; ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = C.muted; ctx.textAlign = "center"; ctx.fillText(tr("cell", "细胞"), cx, cy + 4); ctx.textAlign = "left";
    /* where molecules are released */
    const r0 = dzR.get();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx + r0 * k, cy, 5, 0, 7); ctx.stroke();
    ctx.fillStyle = C.ink; ctx.font = "italic 14px " + fMath; ctx.fillText("r", cx + r0 * k - 3, cy - 10);
    /* captured and escaped endpoints of the current batch */
    for (const m of dz.walkers) if (m.done) {
      if (m.cap) { ctx.fillStyle = C.sky; ctx.beginPath(); ctx.arc(cx + m.ex * k, cy - m.ey * k, 2.5, 0, 7); ctx.fill(); }
    }
    /* scale bar: 1 µm */
    const um = k / dzA.get();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(12, h - 14); ctx.lineTo(12 + um, h - 14); ctx.stroke();
    ctx.fillStyle = C.ink; ctx.font = "12px " + fSans; ctx.fillText("1 µm", 18 + um, h - 10);
  }
  function drawDZPlot() {
    const p = new Plot($("dz-plot"), {
      height: 260, x: { min: 1, max: 8, step: 1 }, y: { min: 0, max: 1, step: 0.2 },
      xlabel: [{ t: tr("Distance from the centre ", "到细胞中心的距离 ") }, { t: "r", m: true }, { t: "/" }, { t: "a", m: true }],
      ylabel: [{ t: tr("Fraction", "比例") }],
      aria: tr("Concentration and capture probability against distance", "浓度与捕获概率随距离的变化")
    });
    const xs = Array.from({ length: 141 }, (_, i) => 1 + 7 * i / 140);
    p.line(xs.map(r => [r, 1 - 1 / r]), "mc-s1");
    p.line(xs.map(r => [r, 1 / r]), "mc-s2");
    const r0 = dzR.get();
    p.line([[r0, 0], [r0, 1]], "mc-plot-guide");
    p.marker(r0, 1 - 1 / r0, "o", "mc-s1-mark", 4.5);
    p.marker(r0, 1 / r0, "o", "mc-s2-mark", 4.5);
    for (const [key, e] of dz.runs) {
      const r = +key, y = e.cap / e.n, se = Math.sqrt(Math.max(y * (1 - y), 0.25 / e.n) / e.n);
      p.line([[r, Math.max(0, y - se)], [r, Math.min(1, y + se)]], "mc-d2");
      p.marker(r, y, "s", "mc-d2-mark", 4);
    }
    p.text(7.8, 1 - 1 / 7.8, tr("concentration c/c∞", "浓度 c/c∞"), "t-d1", "end", 0, -8);
    p.text(7.8, 1 / 7.8, tr("capture probability a/r", "被捕获的概率 a/r"), "t-ink", "end", 0, -8);
    if (dz.runs.size) p.text(1.15, 0.06, tr("squares: released molecules", "方块：放出的分子"), "t-d2", "start");
  }
  function dzRelease() {
    const r0 = dzR.get(), cv = $("dz-cv");
    const { w, h } = fitCanvas(cv);
    if (dz.layer.width !== cv.width || dz.layer.height !== cv.height) { dz.layer.width = cv.width; dz.layer.height = cv.height; }
    const lc = dz.layer.getContext("2d"), s = cv.width / w;
    lc.setTransform(s, 0, 0, s, 0, 0); lc.clearRect(0, 0, w, h);
    dz.walkers = Array.from({ length: 40 }, () => ({ x: r0, y: 0, z: 0, done: false, cap: false, ex: 0, ey: 0, key: dzKey() }));
    if (!dz.raf) dz.raf = requestAnimationFrame(dzFrame);
  }
  function dzFinish(m, cap, x, y, z) {
    m.done = true; m.cap = cap;
    const n = Math.hypot(x, y, z); m.ex = x / n; m.ey = y / n;
    const e = dz.runs.get(m.key) || { n: 0, cap: 0 }; e.n++; if (cap) e.cap++; dz.runs.set(m.key, e);
  }
  function dzFrame() {
    dz.raf = 0;
    const cv = $("dz-cv"), w = cv.clientWidth, h = +cv.dataset.h, { k, cx, cy } = dzGeom(w, h);
    const lc = dz.layer.getContext("2d");
    lc.strokeStyle = css("--ink-muted"); lc.lineWidth = 0.6; lc.globalAlpha = 0.16;
    let live = 0;
    for (const m of dz.walkers) {
      if (m.done) continue;
      lc.beginPath(); lc.moveTo(cx + m.x * k, cy - m.y * k);
      for (let i = 0; i < 120 && !m.done; i++) {
        m.x += gauss() * DZ_STEP; m.y += gauss() * DZ_STEP; m.z += gauss() * DZ_STEP;
        const r = Math.hypot(m.x, m.y, m.z);
        if (r <= 1) { lc.lineTo(cx + m.x / r * k, cy - m.y / r * k); dzFinish(m, true, m.x, m.y, m.z); }
        else if (r >= R_OUT) {
          lc.lineTo(cx + m.x * k, cy - m.y * k);
          if (Math.random() < 1 / r) { /* it will come back: land by the exterior Poisson kernel */
            const wv = 1 / (r + 1) + Math.random() * (1 / (r - 1) - 1 / (r + 1));
            const u = Math.min(1, Math.max(-1, (r * r + 1 - 1 / (wv * wv)) / (2 * r)));
            const d = tilt([m.x / r, m.y / r, m.z / r], u);
            dzFinish(m, true, d[0], d[1], d[2]);
          } else dzFinish(m, false, m.x, m.y, m.z);
        } else lc.lineTo(cx + m.x * k, cy - m.y * k);
      }
      lc.stroke();
      if (!m.done) live++;
    }
    lc.globalAlpha = 1;
    drawDZ(); dzReadouts();
    if (live) dz.raf = requestAnimationFrame(dzFrame); else drawDZPlot();
  }
  $("dz-run").addEventListener("click", dzRelease);
  $("dz-clear").addEventListener("click", () => { dz.runs.clear(); dz.walkers = []; const c = dz.layer.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, dz.layer.width, dz.layer.height); dzReadouts(); drawDZ(); drawDZPlot(); });
  window.drawDZAll = () => { dz.layer.width = 0; drawDZ(); drawDZPlot(); };
  dzReadouts(); drawDZ(); drawDZPlot();
}

/* ======================= counting noise (opening) ======================= */
if ($("cn-plot")) {
  const M0 = 2500, M1 = 2525; /* molecules in a 1 µm sphere at 1 µM, and 1% more */
  const Phi = z => 0.5 * (1 + Math.tanh(0.7978845608 * (z + 0.044715 * z * z * z))); /* normal CDF, to ~1e-3 */
  const cnN = logSlider("cn-n", 1, 1e4, 1, v => Math.round(v).toLocaleString("en-US"), drawCN);
  function drawCN() {
    const n = Math.round(cnN.get()), s0 = Math.sqrt(M0 / n), s1 = Math.sqrt(M1 / n);
    const p = new Plot($("cn-plot"), {
      height: 240, x: { min: 2350, max: 2675, step: 50 }, y: { min: 0, max: 1.15, step: 0.5 }, yTicks: false,
      m: { l: 24, r: 18, t: 14, b: 52 },
      xlabel: [{ t: tr("Molecules counted in the sphere, averaged over ", "球内分子数，取 ") }, { t: "n", m: true }, { t: tr(" counts", " 次计数的平均") }],
      aria: tr("Distributions of the averaged count at two concentrations", "两种浓度下平均计数的分布")
    });
    const g = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) ** 2);
    const xs = Array.from({ length: 400 }, (_, i) => 2350 + 325 * i / 399);
    /* overlap: where the two can be mistaken for each other */
    let d = "";
    xs.forEach((x, i) => { d += (i ? "L" : "M") + p.sx(x).toFixed(1) + " " + p.sy(Math.min(g(x, M0, s0), g(x, M1, s1))).toFixed(1); });
    d += `L${p.sx(2675).toFixed(1)} ${p.sy(0)}L${p.sx(2350).toFixed(1)} ${p.sy(0)}Z`;
    el("path", { d, class: "cn-overlap" }, p.data);
    p.line(xs.map(x => [x, g(x, M0, s0)]), "mc-s1");
    p.line(xs.map(x => [x, g(x, M1, s1)]), "mc-d2 mc-dash");
    p.text(M0, 1.07, "1 µM", "t-d1", "end", -4);
    p.text(M1, 1.07, "1.01 µM", "t-d2", "start", 4);
    const dprime = (M1 - M0) / s0;
    $("cn-sd").textContent = sig(s0, 2);
    $("cn-ok").textContent = (100 * Phi(dprime / 2)).toFixed(0) + "%";
    $("cn-t").textContent = fmtTime(n * 1e-3);
  }
  drawCN();
}

/* ======================= cost of stirring against swimming (section 3) ======================= */
if ($("sk-plot")) {
  const ETA = 0.01, V_SWIM = 30e-4; /* water, 30 µm/s */
  const skD = logSlider("sk-d", 1e-8, 1e-5, 1e-5, v => sig(v, 2) + " cm²/s", drawSK);
  function drawSK() {
    const D = skD.get();
    const stir = a => 96 * ETA * D * D / a ** 4 * 1e-7, swim = a => 4.5 * ETA * V_SWIM ** 2 / (a * a) * 1e-7; /* W/cm³, a in cm */
    const as = logspace(0.3, 300, 120);
    const p = new Plot($("sk-plot"), {
      x: { min: 0.3, max: 300, log: true }, y: { min: 1e-12, max: 10, log: true, decadeStep: 2 },
      xlabel: [{ t: tr("Cell radius ", "细胞半径 ") }, { t: "a", m: true }, { t: " [µm]" }],
      ylabel: [{ t: tr("Power per volume [W/cm³]", "单位体积功率 [W/cm³]") }],
      aria: tr("Power to stir against power to swim", "搅动与游泳所需功率")
    });
    p.line(as.map(a => [a, stir(a * 1e-4)]), "mc-d2 mc-dash");
    p.line(as.map(a => [a, swim(a * 1e-4)]), "mc-s1");
    p.line([[1, 1e-12], [1, 10]], "mc-plot-guide");
    p.text(1, 3e-12, tr("bacterium", "细菌"), "t-muted", "start", 5);
    const across = Math.sqrt(96 * D * D / (4.5 * V_SWIM ** 2)) * 1e4; /* µm */
    if (across > 0.3 && across < 300) { p.line([[across, 1e-12], [across, 10]], "mc-plot-guide"); p.marker(across, swim(across * 1e-4), "s", "mc-d2-mark", 4); }
    p.text(0.35, stir(0.35e-4) > 10 ? 2 : stir(0.35e-4), tr("stirring, at least", "搅动，至少"), "t-d2", "start", 4, 14);
    p.text(250, swim(250e-4), tr("swimming at 30 µm/s", "以 30 µm/s 游泳"), "t-d1", "end", 0, -8);
    $("sk-1").textContent = sig(stir(1e-4), 2) + " W/cm³";
    $("sk-r").textContent = "×" + sig(stir(1e-4) / swim(1e-4), 2);
    $("sk-x").textContent = across < 1e4 ? sig(across, 2) + " µm" : "–";
  }
  drawSK();
}

/* ======================= run and tumble: the window for a measurement (section 5) ======================= */
if ($("rt-plot")) {
  /* Toy model, 2D: speed V, tumbles at rate LAMBDA0 that randomise the heading, rotational diffusion
     DR. The cell compares the concentration averaged over the last T with the T before that and,
     while the comparison says "up", tumbles at LAMBDA0·e^-K instead of LAMBDA0·e^K. The comparison
     itself is noise-free here: its only cost is that it is out of date. */
  const V = 20, LAMBDA0 = 1, DR = 0.1, K = 0.7, DT = 0.02;
  const TS = [0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1, 1.5, 2, 3, 5, 8]; /* values of 2T [s] */
  const curve = new Map();
  function runCells(T2, cells, seconds, keep) {
    const T = T2 / 2, w = Math.max(1, Math.round(T / DT)), steps = Math.round(seconds / DT), tracks = [];
    let sum = 0;
    for (let c = 0; c < cells; c++) {
      let x = 0, y = 0, th = 2 * Math.PI * Math.random();
      /* running sums of x over the last T (rec) and the T before it (old) */
      const L = 2 * w, buf = new Float64Array(L); let n = 0, rec = 0, old = 0;
      const tr_ = keep ? [[0, 0]] : null;
      for (let i = 0; i < steps; i++) {
        const mid = n >= w ? buf[(n - w) % L] : 0, gone = n >= L ? buf[n % L] : 0;
        rec += x - mid; old += mid - gone; buf[n % L] = x; n++;
        const up = n >= L && rec > old;
        if (Math.random() < LAMBDA0 * Math.exp(up ? -K : K) * DT) th = 2 * Math.PI * Math.random();
        th += gauss() * Math.sqrt(2 * DR * DT);
        x += V * Math.cos(th) * DT; y += V * Math.sin(th) * DT;
        if (keep && i % 5 === 4) tr_.push([x, y]);
      }
      sum += x;
      if (keep) tracks.push(tr_);
    }
    return { drift: sum / cells / seconds, tracks };
  }
  const rtT = logSlider("rt-T", 0.05, 8, 1, v => sig(v, 2) + " s", () => { drawRTTracks(); drawRT(); });
  const rtG = logSlider("rt-g", 0.01, 10, 0.7, v => sig(v, 2) + " cm⁻¹", drawRT);
  /* shortest usable 2T from Eq. 58, for an E. coli-sized cell at c = c1/2 = 1 mM */
  function tmin2(g) {
    const a = 0.8e-4, D = 1e-5, f = 0.5, h = 0.5e-3 * 6e20, gt = V * 1e-4 * g;
    return 2 * (Math.PI * a * D * f * h * gt * gt) ** (-1 / 3);
  }
  let tracks = null;
  function drawRTTracks() {
    const T2 = rtT.get(), r = runCells(T2, 24, 60, true); tracks = r;
    const cv = $("rt-cv"), { ctx, w, h } = fitCanvas(cv);
    const C = { raised: css("--paper-raised"), ink: css("--ink"), muted: css("--ink-muted"), sky: css("--sky"), ctxc: css("--data-context") };
    const fSans = css("--font-sans");
    /* concentration rises to the right: sky, stronger to the right */
    const gr = ctx.createLinearGradient(0, 0, w, 0);
    const [sr, sg, sb] = (c => { c = c.replace("#", ""); const n = parseInt(c.length === 3 ? c.replace(/./g, "$&$&") : c, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; })(C.sky);
    gr.addColorStop(0, `rgba(${sr},${sg},${sb},0.02)`); gr.addColorStop(1, `rgba(${sr},${sg},${sb},0.35)`);
    ctx.fillStyle = C.raised; ctx.fillRect(0, 0, w, h); ctx.fillStyle = gr; ctx.fillRect(0, 0, w, h);
    const span = 1300, k = w / span, x0 = w * 0.3, y0 = h / 2; /* µm across the view */
    ctx.strokeStyle = C.ctxc; ctx.lineWidth = 1;
    for (const t of r.tracks) {
      ctx.beginPath(); t.forEach(([x, y], i) => { const X = x0 + x * k, Y = y0 - y * k; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
    }
    ctx.fillStyle = C.ink;
    for (const t of r.tracks) { const [x, y] = t[t.length - 1]; ctx.beginPath(); ctx.arc(x0 + x * k, y0 - y * k, 2.5, 0, 7); ctx.fill(); }
    const mx = r.tracks.reduce((s, t) => s + t[t.length - 1][0], 0) / r.tracks.length;
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(x0, 8); ctx.lineTo(x0, h - 8); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = C.sky; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 + mx * k, 8); ctx.lineTo(x0 + mx * k, h - 8); ctx.stroke();
    ctx.font = "12px " + fSans; ctx.fillStyle = C.muted;
    ctx.fillText(tr("start", "起点"), x0 + 4, h - 12);
    ctx.fillStyle = C.sky; ctx.fillText(tr("mean after 60 s", "60 秒后的平均位置"), x0 + mx * k + 4, 20);
    ctx.fillStyle = C.muted; ctx.textAlign = "right"; ctx.fillText(tr("more attractant →", "引诱剂更多 →"), w - 8, h - 12); ctx.textAlign = "left";
    const bar = 200 * k; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(10, 14); ctx.lineTo(10 + bar, 14); ctx.stroke();
    ctx.fillStyle = C.ink; ctx.fillText("200 µm", 14 + bar, 18);
  }
  function drawRT() {
    const T2 = rtT.get(), g = rtG.get(), tm = tmin2(g);
    const p = new Plot($("rt-plot"), {
      height: 280, x: { min: 0.05, max: 8, log: true }, y: { min: 0, max: 0.4, step: 0.1 },
      xlabel: [{ t: tr("Time for one comparison, 2", "完成一次比较的时间 2") }, { t: "T", m: true }, { t: " [s]" }],
      ylabel: [{ t: tr("Drift up the gradient / speed", "沿梯度的漂移 / 游速") }],
      aria: tr("Drift against measurement time", "漂移速度与测量时间")
    });
    if (tm > 0.05) {
      const x1 = Math.min(8, tm);
      el("rect", { x: p.px0, y: p.py1, width: p.sx(x1) - p.px0, height: p.py0 - p.py1, class: "rt-band" }, p.data);
      p.line([[x1, 0], [x1, 0.4]], "mc-plot-guide");
      p.text(Math.sqrt(0.05 * x1), 0.37, tr("too noisy (Eq. 58)", "噪声太大（公式 58）"), "t-muted", "middle");
    }
    const pts = TS.filter(t => curve.has(t)).map(t => [t, curve.get(t)]);
    if (pts.length) p.line(pts, "mc-s1");
    for (const [t, v] of pts) p.marker(t, v, "o", "mc-s1-mark", 3.5);
    if (tracks) p.marker(T2, Math.max(0, tracks.drift / V), "s", "mc-d2-mark", 4.5);
    p.text(7.5, pts.length ? pts[pts.length - 1][1] : 0.02, tr("stale information", "信息已过时"), "t-d1", "end", 0, -10);
    $("rt-drift").textContent = tracks ? sig(tracks.drift, 2) + " µm/s" : "–";
    $("rt-tmin").textContent = fmtTime(tm);
    $("rt-win").textContent = tm < 8 ? tr(`${fmtTime(tm)} to a few seconds`, `${fmtTime(tm)} 到几秒`) : tr("none", "没有");
  }
  /* the curve: 160 cells over 150 s per point, computed in the background */
  let ti = 0;
  (function next() {
    if (ti >= TS.length) return;
    const t = TS[ti++]; curve.set(t, Math.max(0, runCells(t, 160, 150, false).drift / V)); drawRT();
    setTimeout(next, 0);
  })();
  $("rt-again").addEventListener("click", () => { drawRTTracks(); drawRT(); });
  window.drawRTAll = () => { drawRTTracks(); drawRT(); };
  drawRTTracks(); drawRT();
}

/* ======================= Fig. 2: J/Jmax versus N ======================= */
let jAS, jN;
function drawJ() {
  const A = jAS.get(), N = jN.get();
  const p = new Plot($("j-plot"), {
    x: { min: 1, max: 1e6, log: true }, y: { min: 0, max: 1, step: 0.2 },
    xlabel: [{ t: tr("Number of receptors ", "受体数 ") }, { t: "N", m: true }],
    ylabel: [{ t: tr("Relative intake ", "相对摄入 ") }, { t: "J", m: true }, { t: "/" }, { t: "J", m: true }, { t: "max", sub: true }],
    aria: "Intake against number of receptors"
  });
  const xs = logspace(1, 1e6, 240);
  p.line(xs.map(n => [n, n / (n + Math.PI * A)]), "mc-s1");
  p.line(xs.map(n => [n, n / (n + 4 * A)]), "mc-s2");
  p.line(xs.filter(n => Math.sqrt(n) < Math.PI * A).map(n => [n, Math.sqrt(n) / (Math.PI * A)]), "mc-d2 mc-dash");
  p.line([[Math.PI * A, 0], [Math.PI * A, 1]], "mc-plot-guide");
  p.text(Math.PI * A, 0.04, "N = πa/s", "t-muted", "start", 5);
  const yd = N / (N + Math.PI * A), yc = Math.min(1, Math.sqrt(N) / (Math.PI * A));
  p.marker(N, yd, "o", "mc-s1-mark", 5);
  p.marker(N, yc, "s", "mc-d2-mark", 4);
  p.text(3 * Math.PI * A, 0.75, tr("dispersed, Eq. 8", "分散，公式 8"), "t-d1", "end", -12, 4);
  p.text(1.5, 0.93, tr("dotted: Eq. 13", "点线：公式 13"), "t-ink", "start");
  const xo = Math.min(1e6, (0.25 * Math.PI * A) ** 2);
  p.text(xo, Math.sqrt(xo) / (Math.PI * A) + 0.05, tr("one patch", "合成一片"), "t-d2", "end");
  const cov = N / (4 * A * A);
  $("j-cov").textContent = cov < 1 ? sig(cov, 2) : tr("> 1 (model invalid)", "> 1（模型不适用）");
  $("j-sp").textContent = sig(A * Math.sqrt(4 * Math.PI / N), 2) + tr(" patch radii", " 个受体半径");
  $("j-d").textContent = yd.toFixed(3);
  $("j-c").textContent = yc.toFixed(4);
}
jAS = logSlider("j-as", 100, 3000, 1000, v => Math.round(v), drawJ);
jN = logSlider("j-n", 1, 1e6, 3100, v => sig(v, 2), drawJ);
/* presets: the paper's example cell, and Schwartz's phage-λ fit (πa/s = 483, half intake at N = 483) */
const J_PRESETS = [{ A: 1000, N: 3100 }, { A: 483 / Math.PI, N: 483 }];
document.querySelectorAll("[data-jpre]").forEach(b => b.addEventListener("click", () => {
  const q = J_PRESETS[+b.dataset.jpre]; jAS.set(q.A); jN.set(q.N);
}));
drawJ();

/* ======================= Fig. 3: swimming ======================= */
const DIG = [[0.02, 0.0123], [0.03, 0.0249], [0.04, 0.0411], [0.06, 0.0826], [0.08, 0.1215], [0.1, 0.1567], [0.15, 0.2272],
  [0.2, 0.2831], [0.3, 0.3777], [0.4, 0.446], [0.6, 0.553], [1, 0.7027], [1.5, 0.8297], [2, 0.933], [3, 1.0856],
  [4, 1.2208], [6, 1.4275], [10, 1.71]];
function swimGain(pe) {
  if (pe <= DIG[0][0]) return DIG[0][1] * (pe / DIG[0][0]) ** 2;
  if (pe >= 10) return 2.71 * (pe / 10) ** (1 / 3) - 1;
  for (let i = 1; i < DIG.length; i++) if (pe <= DIG[i][0]) {
    const [x0, y0] = DIG[i - 1], [x1, y1] = DIG[i], t = (log10(pe) - log10(x0)) / (log10(x1) - log10(x0));
    return 10 ** (log10(y0) + t * (log10(y1) - log10(y0)));
  }
}
let sA, sV, sD;
function drawSwim() {
  const a = sA.get() * 1e-4, v = sV.get() * 1e-4, D = sD.get(), eta = 0.01, nu = 0.01;
  const pe = a * v / D, g = swimGain(pe);
  const p = new Plot($("s-plot"), {
    x: { min: 1e-3, max: 1e3, log: true }, y: { min: 1e-4, max: 10, log: true },
    xlabel: [{ t: tr("Dimensionless speed ", "无量纲速度 ") }, { t: "av", m: true }, { t: "0", sub: true }, { t: "/" }, { t: "D", m: true }],
    ylabel: [{ t: tr("Gain in intake ", "摄入增量 ") }, { t: "J", m: true }, { t: "/" }, { t: "J", m: true }, { t: "0", sub: true }, { t: " − 1" }],
    aria: "Gain in intake against dimensionless swimming speed"
  });
  p.line(logspace(1e-3, 0.02, 40).map(x => [x, swimGain(x)]), "mc-s2");
  p.line(logspace(10, 1e3, 40).map(x => [x, swimGain(x)]), "mc-s2");
  p.line(logspace(0.02, 10, 160).map(x => [x, swimGain(x)]), "mc-s1");
  p.line([[1e-3, 1], [1e3, 1]], "mc-plot-guide");
  p.text(1.3e-3, 1, tr("intake doubled", "摄入翻倍"), "t-muted", "start", 0, -6);
  p.line([[0.03, 1e-4], [0.03, 10]], "mc-plot-guide");
  p.text(0.03, 3e-4, tr("E. coli, nutrient", "大肠杆菌，营养物"), "t-muted", "start", 5);
  p.marker(Math.min(Math.max(pe, 1e-3), 1e3), Math.min(Math.max(g, 1e-4), 10), "s", "mc-d2-mark", 4.5);
  $("s-pe").textContent = sig(pe, 2);
  $("s-gain").textContent = g < 0.001 ? "< 0.1%" : sig(100 * g, 2) + "%";
  $("s-dbl").textContent = sig(2.5 * D / a * 1e4, 2) + " µm/s";
  $("s-re").textContent = sig(a * v / nu, 2);
  $("s-pw").textContent = sig(4.5 * eta * v * v / (a * a) * 1e-7, 2) + " W/cm³";
  $("s-st").textContent = sig(96 * eta * D * D / a ** 4 * 1e-7, 2) + " W/cm³";
}
sA = logSlider("s-a", 0.3, 30, 1, v => sig(v, 2) + " µm", drawSwim);
sV = logSlider("s-v", 1, 3000, 30, v => sig(v, 2) + " µm/s", drawSwim);
sD = logSlider("s-d", 1e-8, 1e-5, 1e-5, v => sig(v, 2) + " cm²/s", drawSwim);
const SWIM_PRESETS = [{ a: 1, v: 30, D: 1e-5 }, { a: 1, v: 15, D: 5e-8 }];
document.querySelectorAll("[data-swim]").forEach(b => b.addEventListener("click", () => {
  const q = SWIM_PRESETS[+b.dataset.swim]; sA.set(q.a); sV.set(q.v); sD.set(q.D);
}));
drawSwim();

/* ======================= Fig. 4–5: one receptor ======================= */
const expRand = mean => -mean * Math.log(1 - Math.random());
function telegraph(x, T, record) {
  let t = 0, bound = Math.random() < x / (1 + x), tb = 0, nu = 0;
  const segs = record ? [[0, bound]] : null;
  while (t < T) {
    const dur = bound ? expRand(1) : expRand(1 / x);
    const dt = Math.min(dur, T - t);
    if (bound) tb += dt;
    t += dt;
    if (t < T) { bound = !bound; if (bound) nu++; if (record) segs.push([t, bound]); }
  }
  return { pT: tb / T, nu, segs };
}
let tX, tT, lastRun = null;
function newTelegraph() { lastRun = { x: tX.get(), T: tT.get(), ...telegraph(tX.get(), tT.get(), true) }; drawTelegraph(); }
function drawTelegraph() {
  const r = lastRun, cv = $("t-cv");
  const { ctx, w, h } = fitCanvas(cv);
  const C = { paper: css("--paper"), ink: css("--ink"), muted: css("--ink-muted"), sky: css("--data-1"), ctx: css("--data-context") };
  ctx.fillStyle = C.paper; ctx.fillRect(0, 0, w, h);
  const l = 34, rgt = 10, t0 = 12, b0 = h - 24;
  const X = t => l + (w - l - rgt) * t / r.T, Y = p => b0 - (b0 - t0) * p;
  ctx.font = "12px " + css("--font-mono"); ctx.fillStyle = C.ink; ctx.textAlign = "right";
  ctx.fillText("1", l - 6, Y(1) + 4); ctx.fillText("0", l - 6, Y(0) + 4);
  ctx.textAlign = "left"; ctx.fillStyle = C.muted; ctx.font = "12px " + css("--font-sans");
  ctx.fillText(tr("time →  ", "时间 →  ") + sig(r.T, 2) + " τb", l, h - 6);
  /* telegraph */
  ctx.strokeStyle = C.ctx; ctx.lineWidth = 1; ctx.beginPath();
  const S = r.segs;
  ctx.moveTo(X(0), Y(S[0][1] ? 1 : 0));
  for (let i = 1; i < S.length; i++) { ctx.lineTo(X(S[i][0]), Y(S[i - 1][1] ? 1 : 0)); ctx.lineTo(X(S[i][0]), Y(S[i][1] ? 1 : 0)); }
  ctx.lineTo(X(r.T), Y(S[S.length - 1][1] ? 1 : 0)); ctx.stroke();
  /* running average */
  const pbar = r.x / (1 + r.x);
  ctx.strokeStyle = C.ink; ctx.setLineDash([1.5, 3.5]); ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(X(0), Y(pbar)); ctx.lineTo(X(r.T), Y(pbar)); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle = C.sky; ctx.lineWidth = 2.2; ctx.beginPath();
  let cum = 0, k = 0; const n = 400;
  for (let i = 1; i <= n; i++) {
    const tt = r.T * i / n;
    while (k + 1 < S.length && S[k + 1][0] <= tt) { if (S[k][1]) cum += S[k + 1][0] - Math.max(S[k][0], 0); k++; }
    const partial = S[k][1] ? tt - S[k][0] : 0;
    const avg = (cum + partial) / tt;
    i === 1 ? ctx.moveTo(X(tt), Y(avg)) : ctx.lineTo(X(tt), Y(avg));
  }
  ctx.stroke();
  const est = r.pT / (1 - r.pT), nuExp = r.x / (1 + r.x) * r.T;
  $("t-nu").textContent = r.nu;
  $("t-nu-t").textContent = tr("expected ", "期望 ") + sig(nuExp, 2);
  $("t-pT").textContent = r.pT.toFixed(3);
  $("t-pbar").textContent = tr("true mean ", "真实平均 ") + pbar.toFixed(3);
  $("t-est").textContent = isFinite(est) ? sig(est, 3) : "∞";
  $("t-err").textContent = sig(100 * (nuExp / 2) ** -0.5, 2) + "%";
}
tX = logSlider("t-x", 0.1, 10, 1, v => sig(v, 2), newTelegraph);
tT = logSlider("t-T", 10, 1e4, 300, v => sig(v, 2), newTelegraph);
$("t-new").addEventListener("click", newTelegraph);
newTelegraph();

let ePts = [];
function drawErr() {
  const p = new Plot($("e-plot"), {
    x: { min: 1, max: 1e4, log: true }, y: { min: 0.01, max: 2, log: true },
    xlabel: [{ t: tr("New molecules counted ", "计入的新分子数 ") }, { t: "ν", m: true }],
    ylabel: [{ t: tr("Relative error ", "相对误差 ") }, { t: "Δc", m: true }, { t: "rms", sub: true }, { t: "/" }, { t: "c̄", m: true }],
    aria: "Relative error against number of new molecules"
  });
  p.line(logspace(1, 1e4, 60).map(n => [n, (n / 2) ** -0.5]), "mc-s2");
  const lt = p.text(2.2, (2.2 / 2) ** -0.5 * 1.18, "(ν/2)", "t-ink", "start");
  el("tspan", { dy: -6, "font-size": 10 }, lt).textContent = "−1/2";
  for (const q of ePts) p.marker(q[0], q[1], "o", "mc-s1-mark", 4.5);
}
$("e-run").addEventListener("click", e => {
  const btn = e.target; btn.disabled = true;
  const x = tX.get(), Ts = [10, 30, 100, 300, 1000, 3000];
  ePts = []; let i = 0;
  $("e-note").textContent = tr(`c/c½ = ${sig(x, 2)}, running…`, `c/c½ = ${sig(x, 2)}，正在运行…`);
  (function next() {
    const T = Ts[i], errs = []; let nuSum = 0;
    for (let k = 0; k < 300; k++) {
      const r = telegraph(x, T, false); nuSum += r.nu;
      if (r.pT < 1) errs.push(r.pT / (1 - r.pT) / x - 1);
    }
    const rms = Math.sqrt(errs.reduce((s, v) => s + v * v, 0) / errs.length);
    ePts.push([nuSum / 300, rms]); drawErr();
    if (++i < Ts.length) setTimeout(next, 0);
    else { btn.disabled = false; $("e-note").textContent = tr(`c/c½ = ${sig(x, 2)}, 300 measurements per point.`, `c/c½ = ${sig(x, 2)}，每点 300 次测量。`); }
  })();
});
drawErr();

/* ======================= Fig. 6: time to 1% ======================= */
const NA = 6e20, Dm = 1e-5, S_PATCH = 1e-7;
let mA, mN, mC, mK;
function drawMany() {
  const a = mA.get() * 1e-4, N = mN.get(), cM = mC.get(), KM = mK.get();
  const c = cM * NA, pbar = cM / (cM + KM), s = S_PATCH;
  const rate1 = 2 * Dm * s * c * (1 - pbar);                                     /* nu/2 per second, one receptor */
  const rateN = 2 * Math.PI * Dm * c * N * s * a * (1 - pbar) / (N * s + Math.PI * a); /* Eq. 55 */
  const ratePI = 5 * Math.PI * Dm * c * a / 3;                                    /* Eq. 41 */
  const items = [[tr("One receptor", "单个受体"), 1e4 / rate1, "mc-d3-mark"], [tr(`Cell, N = ${sig(N, 2)}`, `细胞，N = ${sig(N, 2)}`), 1e4 / rateN, "mc-d1-mark"], [tr("Perfect instrument, radius a", "理想仪器，半径 a"), 1e4 / ratePI, "mc-d2-mark"]];
  const vals = items.map(i => i[1]);
  let lo = 10 ** Math.floor(log10(Math.min(...vals)) - 0.3), hi = 10 ** Math.ceil(log10(Math.max(...vals)) + 0.3);
  if (log10(hi / lo) < 3) hi = lo * 1000;
  const p = new Plot($("m-plot"), {
    height: 230, m: { l: 18, r: 18, t: 14, b: 52 },
    x: { min: lo, max: hi, log: true, labelW: 60, fmt: v => fmtTime(v).replace(" ", " ") }, y: { min: 0, max: 3.25, step: 1 }, yTicks: false,
    xlabel: [{ t: tr("Averaging time for 1% precision ", "达到 1% 精度所需的平均时间 ") }, { t: "T", m: true }],
    aria: "Averaging time for one percent precision"
  });
  items.forEach(([lab, v, cls], i) => {
    const y0 = p.sy(2.75 - i), y1 = p.sy(2.25 - i), x1 = p.sx(Math.max(v, lo));
    el("rect", { x: p.px0, y: y0, width: Math.max(0, x1 - p.px0), height: y1 - y0, class: cls }, p.data);
    const t = el("text", { x: p.px0 + 8, y: y0 - 6, class: "mc-plot-note t-ink" }, p.over);
    t.textContent = `${lab}: ${fmtTime(v)}`;
  });
  $("m-p").textContent = pbar.toFixed(2);
}
mA = logSlider("m-a", 0.3, 10, 1, v => sig(v, 2) + " µm", drawMany);
mN = logSlider("m-n", 1, 1e6, 3100, v => sig(v, 2), drawMany);
mC = logSlider("m-c", 1e-9, 1e-2, 1e-6, fmtConc, drawMany);
mK = logSlider("m-k", 1e-9, 1e-2, 1e-6, fmtConc, drawMany);
drawMany();

/* ======================= Fig. 7: chemotaxis ======================= */
const PRESETS = [
  { name: tr("Brown & Berg 1974, L-glutamate (E. coli)", "Brown & Berg 1974，L-谷氨酸（大肠杆菌）"), mode: "t", a: 0.8, D: 9e-6, c: 1.61e-3, h: 2.3e-3, gt: 4.35e-3, f: 0.5,
    paper: tr("2T > 0.087 s; a gradient 1/10 as steep needs about 0.4 s", "2T > 0.087 s；梯度只有十分之一时约需 0.4 s") },
  { name: tr("Dahlquist et al. 1976, L-serine (Salmonella)", "Dahlquist 等 1976，L-丝氨酸（沙门氏菌）"), mode: "x", a: 0.8, D: 1e-5, c: 1e-3, h: 1e-3, gx: 0.7, v: 15, f: 0.5,
    paper: tr("2T ≥ 0.27 s (a gradient 1/10 as steep: about 1.2 s); spatial T > 1.7 s; apparent gradient 600 × steeper than the real one", "2T ≥ 0.27 s（梯度只有十分之一时约 1.2 s）；空间比较 T > 1.7 s；表观梯度比真实梯度陡约 600 倍") },
  { name: tr("Mesibov et al. 1973, α-methylaspartate", "Mesibov 等 1973，α-甲基天冬氨酸"), mode: "x", a: 0.8, D: 1e-5, c: 4e-9, h: 1.3e-4, gx: 80, v: 15, f: 0.5,
    paper: "2T > 0.6 s" },
  { name: tr("Mesibov et al. 1973, D-galactose", "Mesibov 等 1973，D-半乳糖"), mode: "x", a: 0.8, D: 1e-5, c: 2.5e-10, h: 6e-7, gx: 80, v: 15, f: 0.5,
    paper: "2T > 1.4 s" },
  { name: tr("Mato et al. 1975, cyclic AMP (Dictyostelium)", "Mato 等 1975，环腺苷酸（盘基网柄菌）"), mode: "x", a: 5, D: 5e-6, c: 4.3e-9, h: 1e-8, gx: 3.6e-8 / 4.3e-9, v: 0.2, f: 0.5,
    paper: tr("spatial T > 16 s; temporal about 17 s, which is one T (2T ≈ 34 s); apparent gradient ‘0.8 cm’ against a real ‘1.2 cm’, from its own inputs 0.8 mm and 1.2 mm", "空间比较 T > 16 s；时间比较约 17 s，指一个 T（2T ≈ 34 s）；表观梯度长度写作“0.8 cm”、真实梯度“1.2 cm”，按论文自己的输入应为 0.8 mm 和 1.2 mm") }
];
const sel = $("c-preset");
PRESETS.forEach((p, i) => { const o = document.createElement("option"); o.value = i; o.textContent = p.name; sel.appendChild(o); });
let cMode = "x";
function setMode(m) {
  cMode = m;
  $("c-mode-x").setAttribute("aria-pressed", m === "x"); $("c-mode-t").setAttribute("aria-pressed", m === "t");
  $("c-gx-f").hidden = m !== "x"; $("c-v-f").hidden = m !== "x"; $("c-gt-f").hidden = m !== "t";
}
function loadPreset(i) {
  const p = PRESETS[i]; setMode(p.mode);
  const fv = v => (v < 1e-3 ? v.toExponential().replace("e", "e") : String(v));
  $("c-a").value = p.a; $("c-D").value = fv(p.D); $("c-c").value = fv(p.c); $("c-h").value = fv(p.h); $("c-f").value = p.f;
  $("c-gx").value = p.gx !== undefined ? +p.gx.toPrecision(3) : 1; $("c-v").value = p.v ?? 15; $("c-gt").value = fv(p.gt ?? 1e-3);
  $("c-paper").textContent = p.paper;
  calcChemo();
}
const num = id => parseFloat($(id).value);
function tTemporal(a, D, f, h, gt) { return (Math.PI * a * D * f * h * gt * gt) ** (-1 / 3); }
function tSpatial(a, D, f, h, gx) { return 1 / (0.5 * Math.PI * a ** 3 * D * f * h * gx * gx); }
function calcChemo() {
  const aUm = num("c-a"), a = aUm * 1e-4, D = num("c-D"), cM = num("c-c"), hM = num("c-h"), f = num("c-f");
  const h = (cM * hM / (cM + hM)) * NA;
  const ok = [aUm, D, cM, hM, f].every(v => isFinite(v) && v > 0);
  let gt, gx, v;
  if (cMode === "x") { gx = num("c-gx"); v = num("c-v") * 1e-4; gt = v * gx; }
  else { gt = num("c-gt"); }
  if (!ok || !(gt > 0)) { ["c-tt", "c-ts", "c-la"].forEach(id => $(id).textContent = "–"); return; }
  const Tt = tTemporal(a, D, f, h, gt);
  $("c-tt").textContent = fmtTime(2 * Tt);
  if (cMode === "x" && gx > 0) {
    $("c-ts").textContent = fmtTime(tSpatial(a, D, f, h, gx));
    const La = D / (3 * v);
    $("c-la").textContent = fmtLen(La);
    $("c-lr").textContent = tr(`real 1/g = ${fmtLen(1 / gx)}, ratio ${sig(1 / gx / La, 2)}`, `真实 1/g = ${fmtLen(1 / gx)}，比值 ${sig(1 / gx / La, 2)}`);
  } else { $("c-ts").textContent = tr("needs a spatial gradient", "需要空间梯度"); $("c-la").textContent = "–"; $("c-lr").textContent = ""; }
  /* T versus a */
  const as = logspace(0.2, 50, 120);
  const tt = as.map(x => [x, 2 * tTemporal(x * 1e-4, D, f, h, gt)]);
  const ts = cMode === "x" && gx > 0 ? as.map(x => [x, tSpatial(x * 1e-4, D, f, h, gx)]) : [];
  const ys = [...tt, ...ts].map(q => q[1]).filter(y => y > 0 && isFinite(y));
  let ylo = 10 ** Math.floor(log10(Math.min(...ys))), yhi = 10 ** Math.ceil(log10(Math.max(...ys)));
  ylo = Math.max(ylo, 1e-6); yhi = Math.min(yhi, 1e8);
  if (yhi / ylo < 100) { ylo /= 10; yhi *= 10; }
  const span = log10(yhi / ylo);
  const p = new Plot($("c-plot"), {
    x: { min: 0.2, max: 50, log: true }, y: { min: ylo, max: yhi, log: true, decadeStep: span > 8 ? 2 : 1 },
    xlabel: [{ t: tr("Cell radius ", "细胞半径 ") }, { t: "a", m: true }, { t: " [µm]" }],
    ylabel: [{ t: tr("Minimum time ", "最短时间 ") }, { t: "T", m: true }, { t: " [s]" }],
    aria: "Minimum measurement time against cell radius"
  });
  p.line(tt, "mc-s1");
  if (ts.length) p.line(ts, "mc-d2 mc-dash");
  p.line([[aUm, ylo], [aUm, yhi]], "mc-plot-guide");
  p.marker(aUm, 2 * Tt, "o", "mc-s1-mark", 5);
  if (ts.length) p.marker(aUm, tSpatial(a, D, f, h, gx), "s", "mc-d2-mark", 4.5);
  p.text(0.22, tt[0][1], tr("temporal, 2T", "时间比较，2T"), "t-d1", "start", 2, -8);
  if (ts.length) {
    const ix = ts.findIndex(q => q[1] < yhi);
    if (ix >= 0) p.text(ts[ix][0], ts[ix][1], tr("spatial, T", "空间比较，T"), "t-d2", "start", 8, 4);
  }
}
sel.addEventListener("change", () => loadPreset(+sel.value));
$("c-mode-x").addEventListener("click", () => { setMode("x"); calcChemo(); });
$("c-mode-t").addEventListener("click", () => { setMode("t"); calcChemo(); });
["c-a", "c-D", "c-c", "c-h", "c-gx", "c-v", "c-gt", "c-f"].forEach(id => $(id).addEventListener("input", calcChemo));
loadPreset(0);

/* every slider: the value at page load is its default, marked on the track; double-click returns to it */
document.querySelectorAll(".mc-figure .mc-range").forEach(el => {
  const def = el.value;
  el.style.setProperty("--d", rangePct(el));
  el.title = tr("Double-click to reset", "双击恢复默认值");
  syncRange(el);
  el.addEventListener("input", () => syncRange(el));
  el.addEventListener("dblclick", () => { el.value = def; el.dispatchEvent(new Event("input")); });
});

/* canvases follow the theme; plots are rebuilt at the new width */
new MutationObserver(() => { drawTelegraph(); drawSphere(); if (window.drawDZAll) drawDZAll(); if (window.drawRTAll) drawRTAll(); })
  .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
let lastW = $("j-plot").clientWidth, rT = 0;
window.addEventListener("resize", () => {
  clearTimeout(rT);
  rT = setTimeout(() => {
    drawTelegraph(); drawSphere();
    const w = $("j-plot").clientWidth;
    if (w === lastW) return;
    lastW = w; if (window.drawDZAll) drawDZAll(); if (window.drawRTAll) drawRTAll(); drawSchematic(); drawStats(); drawJ(); drawSwim(); drawErr(); drawMany(); calcChemo();
  }, 120);
});
})();
