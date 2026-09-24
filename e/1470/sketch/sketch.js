let pendulums = [];
const numPendulums = 12;
const pendulumLength = 150;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize pendulums with different phases and colors
  for (let i = 0; i < numPendulums; i++) {
    const angle = map(i, 0, numPendulums, 0, TWO_PI);
    const hue = map(i, 0, numPendulums, 0, 360);
    pendulums.push({
      angle: angle,
      phase: random(TWO_PI),
      length: pendulumLength,
      hue: hue,
      speed: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.02); // Semi-transparent background for motion trails

  // Center of the canvas
  const centerX = 0;
  const centerY = 0;

  // Update time
  time += 0.01;

  // Draw pendulums
  for (let i = 0; i < pendulums.length; i++) {
    const p = pendulums[i];

    // Calculate oscillation with harmonic timing based on pentatonic scale
    const oscillation = sin(p.phase + time * p.speed) * 0.5 + 0.5;
    const angle = p.angle + oscillation * 0.2;

    // Position of the pendulum disc
    const x = sin(angle) * p.length;
    const y = cos(angle) * p.length;

    push();
    translate(x, y, 0);

    // Draw colored disc
    noStroke();
    fill(p.hue, 80, 90);
    sphere(10);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
