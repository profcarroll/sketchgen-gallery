// A lighthouse beam over drifting fog. Everything is placed in fractions of the
// canvas so the scene survives any window size; time comes from frameCount so a
// frozen clock still sees the picture move.
let t = 0, beamA = 0, beamLen = 0;
const lamp = { x: 0, y: 0 };
let stars = [], glints = [], rock = [];

// Three fog banks, far to near: slower, bluer and thinner in the distance.
const banks = [
  { y: 0.50, speed: 0.010, alpha: 7,  cool: [52, 72, 108], n: 26, puffs: [] },
  { y: 0.62, speed: 0.018, alpha: 9,  cool: [66, 86, 122], n: 28, puffs: [] },
  { y: 0.76, speed: 0.030, alpha: 10, cool: [80, 100, 134], n: 26, puffs: [] },
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  frameRate(30);
  for (let i = 0; i < 90; i++)
    stars.push({ x: random(), y: random(0.5), s: random(1, 2.2), ph: random(TWO_PI), sp: random(0.8, 2.6) });
  for (let i = 0; i < 40; i++)
    glints.push({ x: random(0.22, 1), y: random(0.81, 0.98), len: random(0.015, 0.05), ph: random(TWO_PI) });
  for (const b of banks)
    for (let i = 0; i < b.n; i++)
      b.puffs.push({ px: random(), py: random(-0.05, 0.05), w: random(0.12, 0.24), h: random(0.05, 0.10), ph: random(TWO_PI) });
  // Headland outline: a broad hump with a ragged edge, built once.
  for (let x = 0; x <= 0.38; x += 0.02) {
    const hump = 0.24 * exp(-sq((x - 0.12) / 0.11));
    rock.push([x, 0.86 - hump + random(-0.012, 0.012)]);
  }
}

// How brightly the beam lights a point: narrow in angle, fading with distance.
function beamAt(x, y) {
  const dx = x - lamp.x, dy = y - lamp.y;
  if (dx < 0) return 0;
  const da = atan2(dy, dx) - beamA;
  return exp(-da * da / 0.02) * max(0, 1 - sqrt(dx * dx + dy * dy) / beamLen);
}

function draw() {
  t = frameCount / 60;
  lamp.x = 0.12 * width;
  lamp.y = 0.41 * height;
  beamLen = 1.1 * max(width, height);
  beamA = -0.15 + 0.6 * sin(t * 0.3);

  noStroke();
  for (let i = 0; i < 28; i++) {                        // sky, darkest overhead
    fill(lerp(6, 26, i / 27), lerp(10, 40, i / 27), lerp(28, 78, i / 27));
    rect(0, i * 0.8 * height / 28, width, 0.8 * height / 28 + 1);
  }
  for (const s of stars) {
    fill(215, 225, 255, 110 + 110 * sin(t * s.sp + s.ph));
    ellipse(s.x * width, s.y * height, s.s);
  }
  for (let r = 5; r > 0; r--) {                         // moon and its halo
    fill(200, 215, 245, r === 1 ? 235 : 12);
    ellipse(0.8 * width, 0.16 * height, r * 0.022 * height);
  }
  for (let i = 0; i < 10; i++) {                        // water
    fill(lerp(14, 6, i / 9), lerp(28, 12, i / 9), lerp(56, 30, i / 9));
    rect(0, (0.8 + i * 0.02) * height, width, 0.02 * height + 1);
  }

  // The beam: stacked wedges of decreasing length add up to a linear fade.
  blendMode(ADD);
  for (const band of [{ hw: 0.12, a: 3 }, { hw: 0.045, a: 6 }])
    for (let i = 0; i < 16; i++) {
      const d = beamLen * (1 - i / 16);
      fill(255, 232, 175, band.a);
      triangle(lamp.x, lamp.y,
        lamp.x + cos(beamA - band.hw) * d, lamp.y + sin(beamA - band.hw) * d,
        lamp.x + cos(beamA + band.hw) * d, lamp.y + sin(beamA + band.hw) * d);
    }
  blendMode(BLEND);

  drawFog(banks[0]);
  drawFog(banks[1]);

  strokeWeight(2);                                      // moon glitter and beam glints
  for (const g of glints) {
    const x = g.x * width, y = g.y * height + sin(t * 0.6 + g.ph) * 3;
    const moon = 0.5 * exp(-sq((x - 0.8 * width) / (0.08 * width)));
    const b = min(1, (moon + beamAt(x, y) * 1.4) * (0.6 + 0.4 * sin(t * 1.3 + g.ph)));
    stroke(lerp(70, 255, b), lerp(100, 236, b), lerp(150, 190, b), 30 + 210 * b);
    const half = g.len * width * (0.6 + 0.4 * sin(t * 0.8 + g.ph)) / 2;
    line(x - half, y, x + half, y);
  }
  noStroke();

  fill(8, 12, 22);                                      // headland and tower, pure silhouette
  beginShape();
  vertex(0, height);
  for (const p of rock) vertex(p[0] * width, p[1] * height);
  vertex(0.38 * width, height);
  endShape(CLOSE);
  const h = height, top = 0.435 * h;
  quad(lamp.x - 0.03 * h, 0.64 * h, lamp.x - 0.018 * h, top, lamp.x + 0.018 * h, top, lamp.x + 0.03 * h, 0.64 * h);
  rect(lamp.x - 0.032 * h, top - 0.008 * h, 0.064 * h, 0.012 * h);   // gallery
  rect(lamp.x - 0.02 * h, lamp.y - 0.015 * h, 0.04 * h, 0.03 * h);   // lamp room
  triangle(lamp.x - 0.026 * h, lamp.y - 0.015 * h, lamp.x + 0.026 * h, lamp.y - 0.015 * h, lamp.x, lamp.y - 0.05 * h);

  blendMode(ADD);                                       // the lamp itself
  for (let r = 6; r > 0; r--) {
    fill(255, 225, 160, r === 1 ? 200 : 14);
    ellipse(lamp.x, lamp.y, r * 0.02 * h);
  }
  blendMode(BLEND);

  drawFog(banks[2]);
}

// Each puff is three nested ellipses; a puff the beam touches warms and thickens.
function drawFog(bank) {
  noStroke();
  for (const p of bank.puffs) {
    const x = (((p.px + t * bank.speed) % 1) * 1.5 - 0.25) * width;
    const y = (bank.y + p.py + sin(t * 0.25 + p.ph) * 0.015) * height;
    const k = beamAt(x, y);
    fill(lerp(bank.cool[0], 255, k * 0.9), lerp(bank.cool[1], 236, k * 0.9),
         lerp(bank.cool[2], 190, k * 0.9), bank.alpha * (1 + 3.5 * k));
    for (let s = 1; s > 0.3; s -= 0.3) ellipse(x, y, p.w * width * s, p.h * height * s);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
