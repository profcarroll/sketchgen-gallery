// 1970s environmental-graphic mural: broad flat bands of saturated color sweep
// the frame at a hard diagonal, crossed by a few oversized concentric arcs and
// a stack of chevrons. Everything is flat and crisp — no gradients, no shading.
// The whole arrangement is deterministic from one seed; a click advances the
// seed to a new but fixed configuration and redraws once. noLoop() keeps the
// canvas perfectly still between clicks, so nothing animates on its own.

let seed = 7;

// A handful of punchy, unmodulated 1970s hues. A seeded shuffle of these gives
// the color assignment that jumps on each click.
const PALETTE = [
  '#e8531f', '#f2a71b', '#1f8a8c', '#d8c39a',
  '#7a3b1d', '#c8102e', '#2e6b2e', '#efe6d0'
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  noLoop();            // static between clicks — nothing moves on its own
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function mousePressed() {
  // Deterministic LCG step: a new, fixed configuration on each click.
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  redraw();
}

function draw() {
  randomSeed(seed);
  const cols = shuffled(PALETTE);   // per-configuration color assignment
  drawDiagonalBands(cols);
  drawConcentricArcs(cols);
  drawChevronStack(cols);
}

// A fresh copy of the palette in a seeded-random order.
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = floor(random(i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

// Broad flat bands sweeping the whole frame at a hard diagonal.
function drawDiagonalBands(cols) {
  const angles = [-QUARTER_PI, QUARTER_PI, -PI / 3, PI / 3, -PI / 6, PI / 6];
  const angle = random(angles);
  const diag = sqrt(width * width + height * height);
  const count = floor(random(7, 12));
  const bw = (2 * diag) / count;

  push();
  translate(width / 2, height / 2);
  rotate(angle);
  for (let i = 0; i < count; i++) {
    fill(cols[i % cols.length]);
    // +1 keeps neighbouring bands seamless — no background shows through.
    rect(-diag + i * bw, -diag, bw + 1, 2 * diag);
  }
  pop();
}

// A few oversized concentric arcs, thick and crisp, anchored toward an edge.
function drawConcentricArcs(cols) {
  const cx = random([0, width, width * 0.5]);
  const cy = random([0, height, height * 0.5]);
  const rings = floor(random(3, 6));
  const step = min(width, height) * random(0.16, 0.24);
  const start = random(TWO_PI);
  const sweep = random(PI * 0.6, PI * 1.4);

  noFill();
  strokeCap(PROJECT);
  for (let i = rings; i >= 1; i--) {
    strokeWeight(step * 0.55);
    stroke(cols[(i + 3) % cols.length]);
    arc(cx, cy, step * i * 2, step * i * 2, start, start + sweep);
  }
  noStroke();
}

// A stack of nested chevrons — oversized, flat, all pointing one way.
function drawChevronStack(cols) {
  const n = floor(random(4, 7));
  const dir = random([-1, 1]);                 // apex up or down
  const hw = width * random(0.22, 0.34);       // half-width, oversized
  const vh = height * random(0.14, 0.22);      // vertical reach
  const gap = min(width, height) * 0.06;
  const cxp = width * random(0.35, 0.65);
  const cyp = height * random(0.4, 0.6);

  strokeJoin(MITER);
  strokeCap(PROJECT);
  noFill();
  for (let i = 0; i < n; i++) {
    const o = i * gap;
    strokeWeight(gap * 0.5);
    stroke(cols[(i + 1) % cols.length]);
    beginShape();
    vertex(cxp - hw, cyp + o);
    vertex(cxp, cyp - dir * vh + o);
    vertex(cxp + hw, cyp + o);
    endShape();
  }
  noStroke();
}
