const PALETTE = [
  [57, 255, 20],   // Neon lime
  [255, 0, 128],   // Hot magenta
  [0, 245, 255],   // Cyan
  [255, 235, 0],   // Acid yellow
  [255, 90, 0],    // Electric orange
];

const NUM_RINGS = 24;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
}

function draw() {
  background(8, 8, 12);

  let cx = width * 0.5;
  let cy = height * 0.5;
  let maxDim = max(width, height) * 0.85;
  let baseSpacing = maxDim / NUM_RINGS;

  let t = frameCount * 0.035;

  for (let i = NUM_RINGS; i >= 1; i--) {
    let col = PALETTE[i % PALETTE.length];
    
    // Elastic spring oscillation: combination of fundamental wave and harmonically damped overshoots
    let phase = i * 0.38;
    let wave = sin(t - phase);
    let springBounce = sin((t - phase) * 3) * exp(-abs(wave) * 0.8) * 0.45;
    let elasticPulse = (wave + springBounce) * (baseSpacing * 0.65);

    let currentR = i * baseSpacing + elasticPulse;
    if (currentR > 4) {
      let weight = map(sin(t * 1.5 - phase), -1, 1, 3, 9);
      
      // Outer glow ring
      stroke(col[0], col[1], col[2], 50);
      strokeWeight(weight + 6);
      ellipse(cx, cy, currentR * 2, currentR * 2);

      // Core sharp fluorescent ring
      stroke(col[0], col[1], col[2], 240);
      strokeWeight(weight);
      ellipse(cx, cy, currentR * 2, currentR * 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
