// Intertwingularity: a rope laid in counter-twist and knotted into a trefoil.
// Plies wind round the trunk one way and strands wind round their ply the other
// (counter-lay, which is why real rope does not unspool). Each strand also leaves
// its home ply for a stretch and runs inside another: a passage quoted where it
// does not live, so no ply stays purely itself.
const SEED = 1974;      // the year of Computer Lib / Dream Machines
const J = 128;          // samples round the loop
const P = 4, Q = 5, S = P * Q;   // plies, strands per ply, strands
const K = 96;           // depth buckets, fine enough that a strand's width survives the sort
const E = 0.05;         // share of the loop a strand takes to slide into another ply
const M = Math;

let U, kU, bg, ramps, hops;
let F, G, SW, TW, X, Y, Z, hitX, hitY, head, link, nxt, prv;   // typed arrays: the per-sample work allocates nothing
let pulses = [], yaw = 0, pitch = 0;

const unit = v => { const l = M.hypot(...v); return v.map(c => c / l); };
const ss = (a, b, x) => { x = M.min(1, M.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };

function setup() {
  createCanvas(windowWidth, windowHeight);
  randomSeed(SEED); noiseSeed(SEED);   // the gate seeds p5 too; an explicit seed keeps the rope the same everywhere
  const palette = [['#2b1230', '#b83a5a', '#ff7f5a', '#ffb98f'],
                   ['#0c2233', '#1d7f93', '#3fd0c0', '#9cf2e0'],
                   ['#1e1640', '#5a3fc8', '#a884ff', '#d6c2ff'],
                   ['#33260d', '#b58a2c', '#ffc94d', '#ffe9a0']];
  // Ramps darken with distance instead of fading, so far strands still hide behind near ones.
  ramps = palette.map(st => Array.from({length: K}, (_, i) => {
    const q = i / (K - 1) * 3, n = M.min(2, M.floor(q));
    return lerpColor(color(st[n]), color(st[n + 1]), q - n).toString();
  }));
  const r = Array.from({length: J}, (_, j) => {       // the (2,3) torus knot, z stretched so crossings clear
    const u = j * TAU / J, m = 2 + M.cos(3 * u);
    return [m * M.cos(2 * u), m * M.sin(2 * u), 1.4 * M.sin(3 * u)];
  });
  F = new Float32Array(9 * J); G = new Float32Array(9 * J);   // per sample: point, N, B (the rope's cross-section plane)
  r.forEach((p, j) => {
    const a = r[(j + J - 1) % J], b = r[(j + 1) % J], T = unit(b.map((v, i) => v - a[i]));
    // N is the knot's axis projected off the tangent. Frenet's normal turns 32 degrees a sample at the
    // knot's tightest bend and kinks the strands there; this one never turns more than 9.
    const N = unit([-T[2] * T[0], -T[2] * T[1], 1 - T[2] * T[2]]);
    F.set([...p, ...N, T[1] * N[2] - T[2] * N[1], T[2] * N[0] - T[0] * N[2], T[0] * N[1] - T[1] * N[0]], 9 * j);
  });
  hops = Array.from({length: S}, (_, s) => ({
    home: M.floor(s / Q), to: (M.floor(s / Q) + 1 + M.floor(random(P - 1))) % P, u: random(),
    len: random(0.14, 0.34), v: random(-0.02, 0.02), ph: TAU * (s % Q) / Q + M.floor(s / Q),
  }));
  SW = new Float32Array(J); TW = new Float32Array(J); hitX = new Float32Array(J); hitY = new Float32Array(J);
  X = new Float32Array(S * J); Y = new Float32Array(S * J); Z = new Float32Array(S * J);
  head = new Int32Array(K * P); link = new Int32Array(S * J);
  nxt = Int32Array.from({length: S * J}, (_, i) => i - i % J + (i % J + 1) % J);
  prv = Int32Array.from({length: S * J}, (_, i) => i - i % J + (i % J + J - 1) % J);
  layout();
}

function layout() {
  U = M.max(1, M.min(width, height)); kU = 0.128 * U;   // a hidden frame reports 0 x 0; keep the arithmetic finite until it opens
  // The backdrop is painted once and blitted: re-filling a gradient every frame cost as much as the rope itself.
  const d = pixelDensity(), g = (bg = document.createElement('canvas')).getContext('2d');
  bg.width = M.max(1, width * d); bg.height = M.max(1, height * d); g.scale(d, d);
  const v = g.createRadialGradient(width / 2, height * 0.46, 0, width / 2, height / 2, M.max(width, height) * 0.75);
  v.addColorStop(0, '#191d33'); v.addColorStop(0.55, '#0d0e1a'); v.addColorStop(1, '#05060b');
  g.fillStyle = v; g.fillRect(0, 0, width, height);
}

function draw() {
  const t = millis() / 1000, ctx = drawingContext, cx = width / 2, cy = height / 2;
  // p5 reports (0, 0) until a pointer has moved; until then the view drifts by itself.
  const seen = mouseX > 0 || mouseY > 0;
  yaw += ((seen ? mouseX / width - 0.5 : 0.35 * M.sin(t * 0.13)) * 1.5 - yaw) * 0.05;
  pitch += (0.5 + (seen ? mouseY / height - 0.5 : 0.25 * M.sin(t * 0.09 + 1)) * 1.2 - pitch) * 0.05;
  const sp = t * 0.06, ca = M.cos(sp), sa = M.sin(sp), cb = M.cos(yaw), sb = M.sin(yaw), cc = M.cos(pitch), sc = M.sin(pitch);
  const m = [cb * ca, -cb * sa, sb,                   // spin about the knot's own axis, then turn the view
             cc * sa + sc * sb * ca, cc * ca - sc * sb * sa, -sc * cb,
             sc * sa - cc * sb * ca, sc * ca + cc * sb * sa, cc * cb];
  pulses = pulses.filter(p => t - p.t < 9).slice(-4); // a hard cap: clicking cannot leak
  for (let j = 0; j < J; j++) {
    const f = j / J, u = f * TAU;
    let bl = 0;                                       // each press is a swelling twist, a front travelling both ways round the loop
    for (const p of pulses) { const age = t - p.t, d = M.abs((f - p.f + 1.5) % 1 - 0.5), x = (d - 0.07 * age) / 0.07; bl += M.exp(-x * x - age / 4); }
    // The rope breathes: noise sampled on a circle, so the thickness closes up at the seam of the loop.
    SW[j] = (1 + 0.9 * bl) * (0.8 + 0.5 * noise(M.cos(u) * 1.5 + 9, M.sin(u) * 1.5 + 9, t * 0.15)); TW[j] = 1.3 * bl;
    for (let v = 0; v < 9; v += 3) {
      const g = 9 * j + v, x = F[g], y = F[g + 1], z = F[g + 2];
      G[g] = m[0] * x + m[1] * y + m[2] * z; G[g + 1] = m[3] * x + m[4] * y + m[5] * z; G[g + 2] = m[6] * x + m[7] * y + m[8] * z;
    }
    hitX[j] = cx + G[9 * j] * kU; hitY[j] = cy + G[9 * j + 1] * kU;
  }
  const R1 = 0.03 * U, R2 = 0.0085 * U;
  let zlo = Infinity, zhi = -Infinity;
  for (let s = 0; s < S; s++) {
    const h = hops[s];
    for (let j = 0; j < J; j++) {
      const i = s * J + j, f = j / J, u = f * TAU, sw = SW[j], tw = TW[j], g = 9 * j;
      const d = ((f - h.u - h.v * t) % 1 + 1) % 1, w = ss(0, E, d) * (1 - ss(h.len, h.len + E, d));
      const a = 5 * u + 0.8 * t + tw, c = a + TAU * h.home / P, b = -11 * u + 1.7 * t + h.ph - tw;
      let px = R1 * sw * M.cos(c), py = R1 * sw * M.sin(c);
      if (w > 0) { const c2 = a + TAU * h.to / P; px += w * (R1 * sw * M.cos(c2) - px); py += w * (R1 * sw * M.sin(c2) - py); }
      px += R2 * sw * M.cos(b); py += R2 * sw * M.sin(b);
      X[i] = cx + G[g] * kU + G[g + 3] * px + G[g + 6] * py;
      Y[i] = cy + G[g + 1] * kU + G[g + 4] * px + G[g + 7] * py;
      Z[i] = G[g + 2] * kU + G[g + 5] * px + G[g + 8] * py;
      if (Z[i] < zlo) zlo = Z[i]; if (Z[i] > zhi) zhi = Z[i];
    }
  }
  head.fill(-1);                                      // depth-sort as linked lists: no arrays grow or shrink per frame
  const zs = K / M.max(1, zhi - zlo);
  for (let i = 0; i < S * J; i++) {
    const k = M.min(K - 1, ((Z[i] - zlo) * zs) | 0), b = k * P + M.floor(i / J / Q);
    link[i] = head[b]; head[b] = i;
  }
  ctx.save();                                         // p5 caches its own fill/stroke; leave its state as we found it
  ctx.drawImage(bg, 0, 0, width, height);
  ctx.lineCap = 'butt';                               // pieces below are C1 at their joints, so butt caps leave no seams
  for (let b = 0; b < K * P; b++) {                   // back to front: one stroke per (depth, ply) instead of one per piece
    if (head[b] < 0) continue;
    const k = b / P | 0;
    ctx.lineWidth = 0.0036 * U * (0.55 + 1.3 * k / K); ctx.strokeStyle = ramps[b % P][k]; ctx.beginPath();
    for (let i = head[b]; i >= 0; i = link[i]) {      // midpoint to midpoint, through the sample: smooth without more samples
      const p = prv[i], n = nxt[i];
      ctx.moveTo((X[p] + X[i]) / 2, (Y[p] + Y[i]) / 2); ctx.quadraticCurveTo(X[i], Y[i], (X[i] + X[n]) / 2, (Y[i] + Y[n]) / 2);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function mousePressed() {
  let best = 0, bd = Infinity;
  for (let j = 0; j < J; j++) { const d = (hitX[j] - mouseX) ** 2 + (hitY[j] - mouseY) ** 2; if (d < bd) { bd = d; best = j; } }
  const t = millis() / 1000, f = best / J;
  pulses.push({f, t});
  for (let n = 0; n < 3; n++) {                       // a press also edits the links: three strands re-route to where it landed
    const h = hops[M.floor(random(S))];
    Object.assign(h, {to: (h.home + 1 + M.floor(random(P - 1))) % P, u: f - h.v * t, len: random(0.16, 0.3)});
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight, true); layout(); }   // true: no redraw before layout() has the new size
