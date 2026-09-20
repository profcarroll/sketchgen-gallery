let pulses = [];
const pulseCount = 100;
const maxRadius = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);

  // Initialize pulses with random positions and properties
  for (let i = 0; i < pulseCount; i++) {
    pulses.push({
      x: random(width),
      y: random(height),
      radius: 0,
      maxRadius: random(100, maxRadius),
      speed: random(0.5, 2),
      hue: random(0, 360),
      alpha: random(0.3, 1),
      angle: random(TWO_PI),
      angularVelocity: random(-0.02, 0.02),
      isEdgeAffected: false
    });
  }
}

function draw() {
  background(0);

  for (let i = 0; i < pulses.length; i++) {
    const p = pulses[i];

    // Update pulse radius and position
    p.radius += p.speed;
    p.angle += p.angularVelocity;

    // Move in a circular motion with some randomness
    p.x += cos(p.angle) * 0.5;
    p.y += sin(p.angle) * 0.5;

    // Check for edge collision and distort
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.isEdgeAffected = true;
    }

    // Draw the pulse with trail effect
    drawPulse(p);

    // Reset if out of bounds or reached max size
    if (p.radius > p.maxRadius || p.x < -100 || p.x > width + 100 || p.y < -100 || p.y > height + 100) {
      resetPulse(p);
    }
  }
}

function drawPulse(p) {
  // Create a trail effect using multiple semi-transparent circles
  const steps = 8;
  for (let i = 0; i < steps; i++) {
    const size = map(i, 0, steps - 1, p.radius * 0.2, p.radius);
    const alpha = map(i, 0, steps - 1, 0.5 * p.alpha, 0.05 * p.alpha);
    
    // Distort the shape near edges
    if (p.isEdgeAffected) {
      const distortion = 0.3;
      const rippleSize = size * (1 + distortion * sin(frameCount * 0.02 + i));
      ellipse(p.x, p.y, rippleSize, rippleSize);
    } else {
      ellipse(p.x, p.y, size, size);
    }
  }
}

function resetPulse(p) {
  // Reset to a new random location and properties
  p.x = random(width);
  p.y = random(height);
  p.radius = 0;
  p.maxRadius = random(100, maxRadius);
  p.speed = random(0.5, 2);
  p.hue = (p.hue + 30) % 360; // Shift hue slightly
  p.alpha = random(0.3, 1);
  p.angle = random(TWO_PI);
  p.angularVelocity = random(-0.02, 0.02);
  p.isEdgeAffected = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
