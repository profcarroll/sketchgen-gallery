let cols = 22;
let rows = 14;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CORNER);
  noStroke();
}

function draw() {
  background(14, 15, 18);

  let marginX = width * 0.06;
  let marginY = height * 0.06;
  let availableW = width - marginX * 2;
  let availableH = height - marginY * 2;

  let cellW = availableW / cols;
  let cellH = availableH / rows;
  let padding = min(cellW, cellH) * 0.15;
  let squareW = cellW - padding;
  let squareH = cellH - padding;

  let t = frameCount;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      let x = marginX + c * cellW + padding * 0.5;
      let y = marginY + r * cellH + padding * 0.5;

      // Deterministic distinct frequency and phase per cell
      let phase = (c * 1.618 + r * 2.718);
      let speed = 0.012 + 0.007 * sin(c * 0.7 - r * 0.5);
      let val = sin(t * speed + phase);

      // Smooth easing into opacity
      let alpha = map(val, -1, 1, 12, 225);

      // Subtle warm-to-cool palette modulation
      let redVal = map(sin(phase * 0.5), -1, 1, 230, 255);
      let greenVal = map(sin(phase * 0.7), -1, 1, 232, 250);
      let blueVal = map(sin(phase * 0.3), -1, 1, 220, 240);

      fill(redVal, greenVal, blueVal, alpha);
      rect(x, y, squareW, squareH, 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
