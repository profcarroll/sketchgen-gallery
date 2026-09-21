// A drone's-eye flight through a procedurally built Brutalist campus. The gate has no GPU, so
// nothing here is WEBGL: boxes are projected by hand and painted far-to-near as flat polygons
// (a few hundred per frame), with fog standing in for atmosphere.
const C = 50;                                   // one campus cell; every 4th cell row/column is a street
const FOG = [205, 206, 202], NEAR = 4;
const boxes = [], puddles = [], weeds = [], dust = [], route = [];
const cam = { x: 0, y: 0, z: 20, yaw: 0, pitch: 0, roll: 0, cosY: 1, sinY: 0, cosP: 1, sinP: 0 };
let F, routeLen = 0;

// Hash, not random(): the campus is identical every run and never depends on draw order.
const h2 = (i, j, s) => { const n = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return n - Math.floor(n); };
const mod4 = (i) => ((i % 4) + 4) % 4;
const isStreet = (i, j) => mod4(i) === 0 || mod4(j) === 0;
const isOpen = (i, j) => isStreet(i, j) || h2(i, j, 1) < 0.14;          // streets and plazas
const wrap = (v, c, span) => c + (((v - c + span / 2) % span) + span) % span - span / 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); frameRate(30); F = Math.max(width * 0.7, height * 0.6);
  buildCampus(); buildRoute();
  scatter(puddles, 90, 5, (x, y, r) => ({ x, y, r: 6 + 10 * r }));
  scatter(weeds, 260, 6, (x, y, r) => ({ x, y, s: 3 + 5 * r }));
  for (let k = 0; k < 90; k++) dust.push([h2(k, 1, 7), h2(k, 2, 7), h2(k, 3, 7)]);
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); F = Math.max(width * 0.7, height * 0.6); }

function addBox(x0, y0, x1, y1, z0, z1, t, win) {
  boxes.push({ x0, y0, x1, y1, z0, z1, t, win, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, d: 0 });
}
function buildCampus() {
  for (let i = -4; i <= 13; i++) for (let j = -4; j <= 13; j++) {
    const x = i * C, y = j * C, r = h2(i, j, 1), t = 0.8 + 0.3 * h2(i, j, 2), h = 30 + 110 * h2(i, j, 3);
    if (isStreet(i, j)) {
      // a walkway spanning the street, above the drone's altitude band, so the drone flies under it
      if (h2(i, j, 4) > 0.8 && (mod4(i) === 0) !== (mod4(j) === 0)) {
        if (mod4(i) === 0) addBox(x - 12, y + 18, x + C + 12, y + 32, 44, 50, 0.95, 0);
        else addBox(x + 18, y - 12, x + 32, y + C + 12, 44, 50, 0.95, 0);
      }
    } else if (r < 0.14) { /* plaza */ }
    else if (r < 0.5) addBox(x + 5, y + 5, x + C - 5, y + C - 5, 0, h, t, 1);            // slab
    else if (r < 0.8) {                                                                   // cantilever: a block on a recessed core
      addBox(x + 14, y + 14, x + C - 14, y + C - 14, 0, 28, t * 0.9, 0);
      addBox(x, y, x + C, y + C, 28, 28 + h * 0.7, t, 1);
    } else {                                                                              // stair tower on a plinth
      addBox(x + 3, y + 3, x + C - 3, y + C - 3, 0, 16, t * 0.95, 0);
      addBox(x + 13, y + 13, x + C - 13, y + C - 13, 16, 110 + 140 * h2(i, j, 5), t, 1);
    }
  }
}
function scatter(list, n, seed, make) {
  for (let k = 0; list.length < n && k < n * 6; k++) {
    const x = -150 + 800 * h2(k, 1, seed), y = -150 + 800 * h2(k, 2, seed);
    if (isOpen(Math.floor(x / C), Math.floor(y / C))) list.push(make(x, y, h2(k, 3, seed)));
  }
}
function buildRoute() {
  // Waypoints sit on street centre-lines; Chaikin corner-cutting rounds each turn inside its intersection.
  let p = [[25, 25], [425, 25], [425, 225], [225, 225], [225, 425], [25, 425]];
  for (let it = 0; it < 4; it++) {
    const q = [];
    for (let k = 0; k < p.length; k++) {
      const a = p[k], b = p[(k + 1) % p.length];
      q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
    }
    p = q;
  }
  p.push(p[0]);
  for (let k = 0; k < p.length; k++) {
    if (k) routeLen += Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]);
    route.push({ x: p[k][0], y: p[k][1], s: routeLen });
  }
}
function at(s) {
  s = ((s % routeLen) + routeLen) % routeLen;
  let k = 0; while (route[k + 1].s < s) k++;
  const a = route[k], b = route[k + 1], t = (s - a.s) / (b.s - a.s || 1);
  return [a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t];
}
function flyCamera() {
  const s = frameCount * 0.8, a = at(s), b = at(s + 30), c = at(s + 90);
  const h0 = Math.atan2(b[1] - a[1], b[0] - a[0]), h1 = Math.atan2(c[1] - b[1], c[0] - b[0]);
  const turn = Math.atan2(Math.sin(h1 - h0), Math.cos(h1 - h0)), sway = 5 * Math.sin(s * 0.03);
  cam.x = a[0] + Math.sin(h0) * sway; cam.y = a[1] - Math.cos(h0) * sway;
  cam.z = 24 + 9 * Math.sin(s * 0.011) + 4 * Math.sin(s * 0.029);      // rises and sinks between 11 and 37
  cam.yaw = h0 + 0.16 * Math.sin(s * 0.017);
  cam.pitch = -0.06 + 0.05 * Math.sin(s * 0.021);
  cam.roll = constrain(turn * 1.6, -0.35, 0.35) + 0.02 * Math.sin(s * 0.05);   // banks into the turns
  cam.cosY = Math.cos(cam.yaw); cam.sinY = Math.sin(cam.yaw);
  cam.cosP = Math.cos(cam.pitch); cam.sinP = Math.sin(cam.pitch);
}

// World -> view space: [right, up, forward].
function view(x, y, z) {
  const dx = x - cam.x, dy = y - cam.y, dz = z - cam.z;
  const fw = dx * cam.cosY + dy * cam.sinY;
  return [dx * cam.sinY - dy * cam.cosY, dz * cam.cosP - fw * cam.sinP, fw * cam.cosP + dz * cam.sinP];
}
const fogged = (r, g, b, d) => { const f = 1 - Math.exp(-d / 430); return [r + (FOG[0] - r) * f, g + (FOG[1] - g) * f, b + (FOG[2] - b) * f]; };
const paint = (r, g, b, d) => fill(...fogged(r, g, b, d));
function poly(pts) {                       // clip to the near plane in view space, project, fill
  const out = [];
  for (let k = 0; k < pts.length; k++) {
    const a = pts[k], b = pts[(k + 1) % pts.length];
    if (a[2] >= NEAR) out.push(a);
    if ((a[2] >= NEAR) !== (b[2] >= NEAR)) {
      const t = (NEAR - a[2]) / (b[2] - a[2]);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, NEAR]);
    }
  }
  if (out.length < 3) return;
  beginShape(); for (const v of out) vertex(v[0] * F / v[2], -v[1] * F / v[2]); endShape(CLOSE);
}
function seg(a, b) { if (a[2] >= NEAR && b[2] >= NEAR) line(a[0] * F / a[2], -a[1] * F / a[2], b[0] * F / b[2], -b[1] * F / b[2]); }
const flat = (x0, y0, x1, y1) => poly([view(x0, y0, 0.05), view(x1, y0, 0.05), view(x1, y1, 0.05), view(x0, y1, 0.05)]);

// One face from corner a and edge vectors u, v; vertical ones get a window grid and rain stains.
function face(ax, ay, az, ux, uy, uz, vx, vy, vz, sh, b) {
  const d = Math.hypot(ax + (ux + vx) / 2 - cam.x, ay + (uy + vy) / 2 - cam.y, az + (uz + vz) / 2 - cam.z), k = b.t * sh;
  paint(172 * k, 168 * k, 158 * k, d);
  const P = (s, t) => view(ax + ux * s + vx * t, ay + uy * s + vy * t, az + uz * s + vz * t);
  poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1)]);
  if (!b.win || !vz || d > 300) return;
  const step = d < 130 ? 12 : 24, nc = Math.max(1, Math.floor(Math.hypot(ux, uy) / step)), nr = Math.max(1, Math.floor(vz / step));
  paint(46, 48, 50, d);
  for (let c = 0; c < nc; c++) for (let r = 0; r < nr; r++)   // deep-set windows in a repeating grid
    poly([P((c + 0.2) / nc, (r + 0.25) / nr), P((c + 0.8) / nc, (r + 0.25) / nr), P((c + 0.8) / nc, (r + 0.75) / nr), P((c + 0.2) / nc, (r + 0.75) / nr)]);
  if (d > 200) return;
  stroke(70, 66, 58, 80); strokeWeight(2);
  for (let q = 0; q < 2; q++) { const s = h2(b.cx, q, ax + ay); seg(P(s, 1), P(s, 1 - 0.3 - 0.5 * h2(b.cy, q, 3))); }
  noStroke();
}
function drawBox(b) {
  const dx = b.x1 - b.x0, dy = b.y1 - b.y0, dz = b.z1 - b.z0;
  if (!b.z0) { paint(96, 94, 88, b.d); poly([view(b.x0 - 5, b.y0 - 5, 0.05), view(b.x1 + 5, b.y0 - 5, 0.05), view(b.x1 + 5, b.y1 + 5, 0.05), view(b.x0 - 5, b.y1 + 5, 0.05)]); }
  if (cam.z > b.z1) face(b.x0, b.y0, b.z1, dx, 0, 0, 0, dy, 0, 1.1, b);              // roof
  else if (cam.z < b.z0) face(b.x0, b.y0, b.z0, dx, 0, 0, 0, dy, 0, 0.55, b);       // underside of an overhang or walkway
  if (cam.y < b.y0) face(b.x0, b.y0, b.z0, dx, 0, 0, 0, 0, dz, 0.82, b);
  if (cam.y > b.y1) face(b.x0, b.y1, b.z0, dx, 0, 0, 0, 0, dz, 1.0, b);
  if (cam.x < b.x0) face(b.x0, b.y0, b.z0, 0, dy, 0, 0, 0, dz, 0.72, b);
  if (cam.x > b.x1) face(b.x1, b.y0, b.z0, 0, dy, 0, 0, 0, dz, 0.9, b);
}

function groundMarks() {
  const ci = Math.floor(cam.x / C), cj = Math.floor(cam.y / C);
  for (let i = ci - 7; i <= ci + 7; i++) for (let j = cj - 7; j <= cj + 7; j++) {      // worn lane dashes give the ground parallax
    if (!isStreet(i, j) || (mod4(i) === 0 && mod4(j) === 0)) continue;
    const x = i * C, y = j * C, ns = mod4(i) === 0;
    paint(168, 164, 150, Math.hypot(x + 25 - cam.x, y + 25 - cam.y));
    for (let q = 0; q < 2; q++) { const o = 6 + q * 24; if (ns) flat(x + 24.2, y + o, x + 25.8, y + o + 12); else flat(x + o, y + 24.2, x + o + 12, y + 25.8); }
  }
  stroke(90, 90, 86, 120); strokeWeight(1);
  for (const p of puddles) {
    const d = Math.hypot(p.x - cam.x, p.y - cam.y); if (d > 320) continue;
    paint(198, 205, 208, d);
    poly(Array.from({ length: 10 }, (_, a) => view(p.x + p.r * Math.cos(a * TWO_PI / 10), p.y + 0.7 * p.r * Math.sin(a * TWO_PI / 10), 0.1)));
  }
  strokeWeight(1.5);
  for (const w of weeds) {                                     // weeds pushing up through the paving
    const d = Math.hypot(w.x - cam.x, w.y - cam.y); if (d > 240) continue;
    stroke(...fogged(78, 90, 48, d)); const base = view(w.x, w.y, 0);
    for (let q = -1; q <= 1; q++) seg(base, view(w.x + q * w.s * 0.6, w.y + 0.3 * q * q * w.s, w.s * (1.2 - 0.3 * q * q)));
  }
  noStroke();
}
function motes() {                                             // dust hanging in the air, wrapped around the drone
  stroke(255, 255, 255, 150);
  for (const m of dust) {
    const v = view(wrap(m[0] * 260 + frameCount * 0.25, cam.x, 260), wrap(m[1] * 260 + frameCount * 0.1, cam.y, 260), 4 + m[2] * 46);
    if (v[2] < NEAR) continue;
    strokeWeight(Math.max(1, 90 / v[2])); point(v[0] * F / v[2], -v[1] * F / v[2]);
  }
  noStroke();
}

function draw() {
  flyCamera();
  background(122, 120, 114);
  push(); translate(width / 2, height / 2); rotate(cam.roll); noStroke();
  const hy = F * Math.tan(cam.pitch), B = Math.max(width, height) * 1.6;
  fill(...FOG); rect(-B, -B, 2 * B, B + hy);                    // sky
  for (let k = 1; k <= 6; k++) { fill(FOG[0], FOG[1], FOG[2], 60); rect(-B, hy, 2 * B, height * 0.05 * k); }   // fog thickening toward the horizon
  groundMarks();
  const vis = [];
  for (const b of boxes) {
    const dx = b.cx - cam.x, dy = b.cy - cam.y, fw = dx * cam.cosY + dy * cam.sinY;
    b.d = Math.hypot(dx, dy);
    if (b.d < 420 && (fw > -60 || b.d < 60) && Math.abs(dx * cam.sinY - dy * cam.cosY) < fw * 1.5 + 120) vis.push(b);
  }
  vis.sort((p, q) => q.d - p.d);
  for (const b of vis) drawBox(b);
  motes();
  pop();
  hud();
}
function hud() {                                                 // faint drone-footage overlay
  const m = 26, L = 30, sec = Math.floor(frameCount / 30);
  noFill(); stroke(255, 225); strokeWeight(2);
  for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
    const x = sx > 0 ? m : width - m, y = sy > 0 ? m : height - m;
    line(x, y, x + sx * L, y); line(x, y, x, y + sy * L);
  }
  line(width / 2 - 10, height / 2, width / 2 + 10, height / 2); line(width / 2, height / 2 - 10, width / 2, height / 2 + 10);
  noStroke(); fill(255, 230); textFont('monospace'); textSize(13);
  const hdg = ((90 - cam.yaw * 180 / PI) % 360 + 360) % 360;
  textAlign(LEFT, BOTTOM); text(`ALT ${Math.round(cam.z * 0.6)} M   HDG ${nf(Math.round(hdg), 3)}   SPD ${(14.4 + Math.sin(frameCount * 0.05)).toFixed(1)} M/S`, m + 6, height - m - 4);
  textAlign(RIGHT, TOP); text(`${nf(Math.floor(sec / 60), 2)}:${nf(sec % 60, 2)}:${nf(frameCount % 30, 2)}`, width - m - 6, m + 6);
  textAlign(LEFT, TOP); text('REC', m + 22, m + 6);
  if (frameCount % 60 < 38) { fill(230, 50, 40); circle(m + 11, m + 13, 9); }
}
