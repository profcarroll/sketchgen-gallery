function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  noStroke();
}

function draw() {
  // Base field: deep ochre-plum ground
  background(42, 22, 26);

  let t = frameCount * 0.015;

  let cx = width * 0.5;
  let topY = height * 0.35;
  let botY = height * 0.72;

  let blockW = width * 0.72;
  let topH = height * 0.38;
  let botH = height * 0.34;

  // Breathing modulations
  let topBreathe = sin(t * 0.8) * 8;
  let botBreathe = cos(t * 0.6) * 7;
  let colorShift = sin(t * 0.5) * 15;

  // Top color field: glowing crimson / burnt cadmium
  drawFeatheredField(
    cx, topY,
    blockW + topBreathe, topH + topBreathe * 0.5,
    195 + colorShift, 38 + colorShift * 0.4, 32,
    30
  );

  // Bottom color field: deep plum / indigo violet
  drawFeatheredField(
    cx, botY,
    blockW + botBreathe, botH + botBreathe * 0.5,
    65 - colorShift * 0.3, 24, 60 + colorShift * 0.5,
    30
  );
}

function drawFeatheredField(x, y, w, h, r, g, b, steps) {
  // Draw layered concentric rectangles to create a soft, vibrating perimeter
  for (let i = steps; i >= 1; i--) {
    let factor = map(i, 1, steps, 1.0, 0.7);
    let alpha = map(i, 1, steps, 4, 18);
    fill(r, g, b, alpha);
    rect(x, y, w * factor, h * factor, 12);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
