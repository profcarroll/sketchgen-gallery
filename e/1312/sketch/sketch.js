// HAL 9000's lens on its console. Everything is drawn from frameCount so the
// motion is deterministic; the lens level eases toward a stepped target.
let stage = 4;      // 4 = full glow ... 0 = ember; a click after 0 restores 4
let lv = 1;         // eased 0..1 brightness
let phase = 0;      // breathing phase, advanced at a rate that depends on lv
const LIGHTS = 8;   // indicator lights, four per side

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // Disconnecting a memory module steps the level down; past the ember it resets.
  stage = stage === 0 ? 4 : stage - 1;
}

function draw() {
  lv += (stage / 4 - lv) * 0.12;
  // Slower breathing as the mind goes: rate scales with lv.
  phase += 0.02 + 0.05 * lv;
  const breath = 0.85 + 0.15 * sin(phase);
  const glow = (0.08 + 0.92 * lv) * breath;

  background(14, 14, 16);
  drawPanel();
  drawLights();
  drawLens(width / 2, height / 2, min(width, height) * 0.3, glow);
}

function drawPanel() {
  // Faint horizontal brushed-metal seams so the matte panel is not flat.
  for (let y = 0; y < height; y += 24) {
    fill(22, 22, 25, 120);
    rect(0, y, width, 2);
  }
}

function drawLights() {
  const alive = ceil(lv * LIGHTS);
  for (let i = 0; i < LIGHTS; i++) {
    const side = i % 2 === 0 ? 0.08 : 0.92;
    const row = floor(i / 2);
    const x = width * side;
    const y = height * (0.25 + row * 0.17);
    // Lights die from the last index backward as lv falls.
    const on = i < alive && sin(frameCount * 0.07 + i * 1.7) > -0.3;
    fill(on ? color(220, 60, 40, 200) : color(45, 20, 20));
    ellipse(x, y, 12, 12);
    if (on) {
      fill(220, 60, 40, 40);
      ellipse(x, y, 30, 30);
    }
  }
}

function drawLens(cx, cy, r, glow) {
  // Bezel: stacked black and grey rings.
  fill(6); ellipse(cx, cy, r * 2.5);
  fill(38); ellipse(cx, cy, r * 2.3);
  fill(4);  ellipse(cx, cy, r * 2.1);
  fill(28); ellipse(cx, cy, r * 2.0);

  // Red glass: concentric discs, darker at the rim, brighter toward the centre.
  const steps = 28;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);           // 0 rim -> 1 centre
    const d = r * 1.9 * (1 - t * 0.9);
    const k = (0.25 + 0.75 * t) * glow;
    fill(200 * k + 20, 15 * k + 4, 10 * k + 4);
    ellipse(cx, cy, d);
  }

  // Amber pupil that pulses with the breath.
  const pr = r * 0.34 * (0.9 + 0.1 * glow);
  fill(255 * glow + 30, 190 * glow + 15, 40 * glow + 5);
  ellipse(cx, cy, pr * 2);
  fill(255, 245 * glow, 160 * glow, 255 * glow);
  ellipse(cx, cy, pr * 0.8);

  // Reflected glint drifting across the glass, fading with lv.
  const a = frameCount * 0.01;
  fill(255, 255, 255, 110 * lv);
  ellipse(cx + cos(a) * r * 0.6, cy - r * 0.45 + sin(a * 1.3) * r * 0.12, r * 0.22, r * 0.1);
}
