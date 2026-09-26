// A campfire whose sparks drift up and become constellations.
// Everything lives in "units": the canvas is 1000 units tall and x = 0 is the
// fire, so the scene keeps its proportions at any window size.
const GROUND = 860, FIRE_Y = 846, POOL = 120, MAX_STARS = 46, GROUP_MAX = 7, LINK = 150;
const LAYERS = [[200, 40, 15, 150, 1], [255, 110, 25, 150, 0.75], [255, 215, 110, 170, 0.48]];
let sparks = [], stars = [], edges = [], groups = [];
let tick = 0, U = 1, halfW = 500, bg, glow;

function setup() {
  createCanvas(windowWidth, windowHeight);
  glow = paint(256, 256, 1, (c) => {
    c.fillStyle = grad(c.createRadialGradient(128, 128, 0, 128, 128, 128),
      [0, 'rgba(255,150,60,0.55)', 0.35, 'rgba(210,80,30,0.2)', 1, 'rgba(120,30,20,0)']);
    c.fillRect(0, 0, 256, 256);
  });
  for (let i = 0; i < POOL; i++) sparks.push({ life: 0 });
  layout();
  // Let the fire burn ~40 simulated seconds first, so the opening frame
  // already has a sky of constellations rather than an empty one.
  for (let i = 0; i < 2400; i++) step();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layout();
}

// Gradients are painted once into plain offscreen canvases: filling one every
// frame costs milliseconds on a canvas with no GPU, drawing an image does not.
function paint(w, h, d, fn) {
  const c = document.createElement('canvas');
  c.width = ceil(w * d);
  c.height = ceil(h * d);
  const ctx = c.getContext('2d');
  ctx.scale(d, d);
  fn(ctx);
  return c;
}

function grad(g, stops) {
  for (let i = 0; i < stops.length; i += 2) g.addColorStop(stops[i], stops[i + 1]);
  return g;
}

// Sky, treeline and ground never change, so they are baked once per size.
// No painted stars: every star in this sky is one the fire put there.
function layout() {
  const w = max(width, 1), h = max(height, 1), gy = (GROUND * h) / 1000;
  U = h / 1000;
  halfW = w / U / 2;
  bg = paint(w, h, pixelDensity(), (c) => {
    c.fillStyle = grad(c.createLinearGradient(0, 0, 0, gy), [0, '#04051a', 0.65, '#12113a', 1, '#2b1a3e']);
    c.fillRect(0, 0, w, gy);
    c.fillStyle = '#03030a';
    c.fillRect(0, gy, w, h - gy);
    // Pines grow taller toward the edges, so the fire sits in a clearing.
    for (let x = -10; x < w + 10; x += random(6, 20) * U) {
      const th = random(25, 90) * U * (0.25 + (1.5 * abs(x - w / 2)) / w);
      c.beginPath();
      c.moveTo(x - th * 0.3, gy + 1);
      c.lineTo(x + th * 0.3, gy + 1);
      c.lineTo(x, gy - th);
      c.fill();
    }
  });
}

function spawn() {
  const s = sparks.find((p) => p.life <= 0);
  if (!s) return;
  s.x = s.x0 = random(-20, 20);
  s.y = s.y0 = FIRE_Y - random(30, 110);
  s.vx = random(-0.5, 0.5);
  s.vy = random(-2.6, -1.3);
  s.life = s.max = random(40, 130);
  s.age = 0;
  s.seed = random(TWO_PI);
  // About one spark in fifty is carried all the way up to become a star.
  s.star = random() < 0.02;
  if (s.star) {
    s.tx = random(-0.92, 0.92) * halfW;
    s.ty = random(60, 480);
    s.sp = (2.1 * (s.y0 - s.ty)) / Math.hypot(s.tx - s.x0, s.y0 - s.ty); // one pace, near or far
  }
}

function step() {
  tick++;
  // Sparks come in gusts as the logs shift, not at a metronome rate.
  for (let n = floor(noise(tick * 0.03) * 2.2 + random()); n > 0; n--) spawn();
  for (const s of sparks) {
    if (s.life <= 0) continue;
    s.age++;
    if (s.star) {
      // Climb along a path that bends outward as it rises, then ease to a stop.
      const p = constrain((s.y0 - s.y) / (s.y0 - s.ty), 0, 1);
      const xd = s.x0 + (s.tx - s.x0) * pow(p, 1.4) + sin(s.age * 0.05 + s.seed) * 12 * (1 - p);
      s.vx = (xd - s.x) * 0.08;
      s.vy = max((s.ty - s.y) * 0.03, -s.sp);
      if (s.y - s.ty < 0.6) settle(s);
    } else {
      // A breeze that varies with height; ordinary sparks cool and burn out.
      const wind = (noise(s.y * 0.004, tick * 0.004) - 0.5) * 2;
      s.vx += (wind - s.vx) * 0.04 + random(-0.1, 0.1);
      s.vy *= 0.996;
      s.life--;
    }
    s.x += s.vx;
    s.y += s.vy;
  }
  for (const g of groups) if (g.fading) g.a -= 0.005;
  // Fading groups are always the oldest, so the first one empties first.
  if (groups.length && groups[0].a <= 0) {
    const dead = groups.shift();
    stars = stars.filter((o) => o.g !== dead);
    edges = edges.filter((e) => e.b.g !== dead);
  }
}

// A spark becomes a star and reaches for the nearest star whose figure is still
// growing. One scan per new star, never per frame: stars are few and settle rarely.
function settle(s) {
  s.life = 0;
  const st = { x: s.x, y: s.y, born: tick, tw: random(TWO_PI), r: random(1.8, 3.4) };
  let best = null, bd = LINK * LINK;
  for (const o of stars) {
    const d = (o.x - st.x) ** 2 + (o.y - st.y) ** 2;
    if (d < bd && d > 400 && !o.g.fading && o.g.n < GROUP_MAX) [bd, best] = [d, o];
  }
  if (best) edges.push({ a: best, b: st, born: tick });
  else groups.push({ n: 0, a: 1, fading: false });
  st.g = best ? best.g : groups[groups.length - 1];
  st.g.n++;
  stars.push(st);
  // The sky holds only so many; past that, the oldest constellation fades.
  if (stars.filter((o) => !o.g.fading).length > MAX_STARS) {
    const old = groups.find((g) => !g.fading);
    if (old) old.fading = true;
  }
}

function draw() {
  step();
  drawingContext.drawImage(bg, 0, 0, width, height);
  push();
  translate(width / 2, 0);
  scale(U);
  blendMode(ADD);
  const f = 0.8 + 0.25 * noise(tick * 0.08); // the fire breathing
  drawingContext.globalAlpha = min(f, 1);
  drawingContext.drawImage(glow, -420 * f, FIRE_Y - 60 - 260 * f, 840 * f, 520 * f);
  drawingContext.globalAlpha = 1;
  strokeWeight(1.3);
  for (const e of edges) {
    const k = min(1, (tick - e.born) / 60); // each line draws itself out to the new star
    stroke(150, 170, 255, 110 * e.b.g.a);
    line(e.a.x, e.a.y, lerp(e.a.x, e.b.x, k), lerp(e.a.y, e.b.y, k));
  }
  for (const o of stars) {
    // A new star pops: its core swells bright for a moment, then settles.
    const age = tick - o.born, flare = max(0, 1 - age / 45) ** 2;
    const a = o.g.a * min(1, 0.4 + age / 20) * (0.8 + 0.2 * sin(tick * 0.05 + o.tw));
    stroke(170, 190, 255, 45 * a + 50 * flare);
    strokeWeight(o.r * (4 + 2 * flare));
    point(o.x, o.y);
    stroke(240, 244, 255, 255 * a);
    strokeWeight(o.r * (1 + flare));
    point(o.x, o.y);
  }
  for (const s of sparks) {
    if (s.life <= 0) continue;
    // Star-bound sparks cool from ember orange to starlight on the way up;
    // the rest go from yellow through orange to red and wink out.
    const p = s.star ? constrain((s.y0 - s.y) / (s.y0 - s.ty), 0, 1) : 0;
    const q = s.star ? 1 : s.life / s.max;
    const a = s.star ? 255 : 255 * min(1, q * 4) * (q < 0.2 && random() < 0.3 ? 0.3 : 1);
    const r = lerp(255, 225, p), g = s.star ? lerp(160, 232, p) : 60 + 170 * q * q;
    const b = s.star ? lerp(60, 255, p) : 20 + 110 * q * q * q;
    stroke(r, g, b, a * 0.25);
    strokeWeight(6);
    point(s.x, s.y);
    stroke(r, g, b, a);
    strokeWeight(2);
    line(s.x, s.y, s.x - s.vx * 3, s.y - s.vy * 3);
  }
  blendMode(BLEND);
  stroke(38, 22, 14);
  strokeWeight(15);
  line(-70, FIRE_Y + 12, 62, FIRE_Y - 8);
  line(-62, FIRE_Y - 8, 70, FIRE_Y + 12);
  // Three passes of flame tongues, red to yellow, added together so the
  // overlaps burn toward white at the core.
  blendMode(ADD);
  noStroke();
  fill(255, 80, 20, 120 + 90 * noise(tick * 0.15));
  ellipse(0, FIRE_Y + 6, 110, 18);
  for (const [lr, lg, lb, al, sc] of LAYERS) {
    fill(lr, lg, lb, al);
    for (let i = -2; i <= 2; i++) {
      const h = (70 + 150 * noise(i * 5.1 + sc * 13, tick * 0.09)) * sc * (1 - abs(i) * 0.2);
      const sway = (noise(i * 2.3 + 40, tick * 0.05) - 0.5) * 70 * sc;
      tongue(i * 16 * sc, FIRE_Y, 34 * sc + 10, h, sway);
    }
  }
  pop();
  blendMode(BLEND);
}

// A teardrop with a pointed, swaying tip and a rounded base.
function tongue(x, y, w, h, sway) {
  beginShape();
  vertex(x - w / 2, y);
  bezierVertex(x - w / 2, y - h * 0.5, x + sway * 0.4 - w * 0.1, y - h * 0.75, x + sway, y - h);
  bezierVertex(x + sway * 0.4 + w * 0.1, y - h * 0.75, x + w / 2, y - h * 0.5, x + w / 2, y);
  bezierVertex(x + w / 2, y + w * 0.35, x - w / 2, y + w * 0.35, x - w / 2, y);
  endShape();
}
