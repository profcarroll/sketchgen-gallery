let dots = [];
let fft;
let amplitude;
let scatter = false;
let targetPosition = [];
let noiseScale = 0.01;
let noiseStrength = 0.5;

function setup() {
  createCanvas(400, 400);
  noStroke();
  colorMode(HSB, 255);

  // Initialize dots
  for (let i = 0; i < 1000; i++) {
    dots.push({
      x: random(width),
      y: random(height),
      vx: 0,
      vy: 0,
      hue: random(255),
      size: random(2, 5)
    });
  }

  // Setup audio
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
}

function draw() {
  background(0, 0, 0, 10); // Fade effect

  let level = amplitude.getLevel();
  if (level > 0.05) {
    scatter = true;
  } else {
    scatter = false;
  }

  for (let i = 0; i < dots.length; i++) {
    let dot = dots[i];

    // Apply noise-based movement
    let nx = noise(dot.x * noiseScale, dot.y * noiseScale) - 0.5;
    let ny = noise(dot.x * noiseScale + 1000, dot.y * noiseScale + 1000) - 0.5;

    if (scatter) {
      // Scatter mode
      dot.vx += nx * noiseStrength * 2;
      dot.vy += ny * noiseStrength * 2;
    } else {
      // Idle mode
      dot.vx += nx * noiseStrength;
      dot.vy += ny * noiseStrength;
    }

    // Apply velocity
    dot.x += dot.vx;
    dot.y += dot.vy;

    // Dampen velocity
    dot.vx *= 0.95;
    dot.vy *= 0.95;

    // Boundary check
    if (dot.x < 0) dot.x = width;
    if (dot.x > width) dot.x = 0;
    if (dot.y < 0) dot.y = height;
    if (dot.y > height) dot.y = 0;

    // Draw dot
    fill(dot.hue, 255, 255, 180);
    ellipse(dot.x, dot.y, dot.size);
  }
}

function mousePressed() {
  getAudioContext().resume();
}
