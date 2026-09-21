// A lighthouse beam swings over drifting fog. Every movement is a function of
// frameCount, so the picture is the same whatever the clock is doing, and the
// sky is bands of flat rects rather than a gradient fill: on a CPU canvas a
// full-screen gradient costs as much per frame as the whole rest of the scene.
const LAYERS = 5, PER = 12, HORIZON = 0.8, TOWER_X = 0.17;
const CREAM = [255, 232, 178], MIST = [96, 118, 148];
let fog = [], stars = [];

function setup() {
  createCanvas(max(windowWidth, 1), max(windowHeight, 1));
  noStroke();
  for (let i = 0; i < 70; i++) stars.push({ x: random(), y: random(0.6), p: random(TWO_PI) });
  for (let l = 0; l < LAYERS; l++) {
    fog[l] = [];
    for (let i = 0; i < PER; i++) fog[l].push({ x: random(), y: random(-1, 1), s: random(0.7, 1.3), glow: 0 });
  }
}

// The headland: a hill under the tower that slides down to a flat, dark sea.
function groundY(xn) {
  return HORIZON - 0.15 * exp(-sq((xn - 0.14) / 0.13)) - 0.05 * exp(-sq((xn - 0.04) / 0.1));
}

function draw() {
  const w = width, h = height, t = frameCount;
  const bx = TOWER_X * w, by = groundY(TOWER_X) * h, th = 0.15 * h;
  const lx = bx, ly = by - th - 0.019 * h;                  // the lamp
  const ang = -0.45 + 0.7 * sin(t * 0.0105);                // ~10 s from one end of the arc to the other

  for (let i = 0; i < 40; i++) {                            // night sky, deeper at the top
    const k = i / 39, bh = h * HORIZON / 40;
    fill(lerp(5, 26, k), lerp(9, 44, k), lerp(26, 72, k));
    rect(0, i * bh, w, bh + 1);
  }
  fill(8, 13, 24);
  rect(0, h * HORIZON, w, h * (1 - HORIZON));
  for (const s of stars) {
    fill(230, 235, 255, 100 + 90 * sin(t * 0.03 + s.p));
    circle(s.x * w, s.y * h, 1.8);
  }

  // The beam is sixteen stacked wedges: the widest is faint and short, the narrowest
  // bright and long, so the light narrows and brightens toward its core.
  const reach = Math.hypot(w, h);
  blendMode(ADD);
  for (let i = 0; i < 16; i++) {
    const k = i / 15, half = lerp(0.17, 0.012, k), len = reach * lerp(0.35, 1.1, k);
    fill(255, 225, 160, 6);
    triangle(lx, ly, lx + cos(ang - half) * len, ly + sin(ang - half) * len,
             lx + cos(ang + half) * len, ly + sin(ang + half) * len);
  }
  blendMode(BLEND);

  drawFog(0, 2, t, lx, ly, ang, reach);                     // far mist sits behind the headland
  fill(6, 9, 16);
  beginShape();
  vertex(0, h);
  for (let i = 0; i <= 40; i++) vertex(i / 40 * w, groundY(i / 40) * h);
  vertex(w, h);
  endShape(CLOSE);
  quad(bx - 0.024 * h, by + 2, bx + 0.024 * h, by + 2, bx + 0.014 * h, by - th, bx - 0.014 * h, by - th);
  rect(bx - 0.02 * h, by - th - 0.008 * h, 0.04 * h, 0.008 * h);
  rect(bx - 0.011 * h, by - th - 0.03 * h, 0.022 * h, 0.022 * h);
  triangle(bx - 0.015 * h, by - th - 0.03 * h, bx + 0.015 * h, by - th - 0.03 * h, bx, by - th - 0.05 * h);
  fill(255, 220, 140);
  rect(bx - 0.006 * h, ly - 0.008 * h, 0.012 * h, 0.016 * h);
  drawFog(2, LAYERS, t, lx, ly, ang, reach);                // near mist drifts over the foot of the tower

  blendMode(ADD);
  fill(255, 215, 140, 22);
  for (const r of [0.06, 0.038, 0.022]) circle(lx, ly, r * 2 * h);
  blendMode(BLEND);
}

// Each blob remembers how lit it is and eases toward what the beam is doing to it,
// so a patch of mist keeps glowing for a moment after the beam has moved on.
function drawFog(from, to, t, lx, ly, ang, reach) {
  const w = width, h = height;
  for (let l = from; l < to; l++) {
    const speed = 0.0002 + l * 0.00012;                     // nearer mist runs faster
    for (const b of fog[l]) {
      const bw = w * (0.26 + 0.05 * l) * b.s, bh = bw * 0.3;
      const x = ((b.x + t * speed) % 1) * (w + 2 * bw) - bw;
      const y = h * (lerp(0.5, 0.9, l / (LAYERS - 1)) + 0.03 * b.y);
      const dist = Math.hypot(x - lx, y - ly);
      const da = abs(((atan2(y - ly, x - lx) - ang + PI) % TWO_PI + TWO_PI) % TWO_PI - PI);
      const hw = 0.08 + bw * 0.45 / max(dist, 1);           // a big blob is lit across more of its width
      const lit = exp(-sq(da / hw)) * sqrt(constrain(1 - dist / (reach * 0.9), 0, 1));
      b.glow += (lit - b.glow) * 0.07;
      const g = b.glow, a = (4.5 + 3 * l) * (1 + 1.4 * g);
      fill(lerp(MIST[0], CREAM[0], g), lerp(MIST[1], CREAM[1], g), lerp(MIST[2], CREAM[2], g), a);
      // Five nested ellipses at low alpha: fewer, stronger ones read as rings, not mist.
      for (let k = 0; k < 5; k++) ellipse(x, y, bw * (1 - k * 0.17), bh * (1 - k * 0.15));
    }
  }
}

function windowResized() {
  resizeCanvas(max(windowWidth, 1), max(windowHeight, 1));
}
