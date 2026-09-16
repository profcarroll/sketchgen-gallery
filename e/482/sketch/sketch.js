let particles = [];
const center = { x: 0, y: 0 };
const G = 0.5; // Gravitational constant
const timeStep = 0.02;
let trailLength = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Create initial particles
  for (let i = 0; i < 200; i++) {
    const angle = random(TWO_PI);
    const radius = random(100, 300);
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;

    particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      trail: [],
      hue: random(360),
      breakTime: random(100, 500), // When to break
      breakDuration: 0,
      breaking: false
    });
  }
}

function draw() {
  background(0, 0, 0, 0.1); // Fade trail

  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Apply gravity
    const dx = center.x - p.x;
    const dy = center.y - p.y;
    const distance = sqrt(dx * dx + dy * dy);
    const force = G / (distance * distance);

    // Update velocity
    p.vx += dx * force * timeStep;
    p.vy += dy * force * timeStep;

    // Break away occasionally
    if (!p.breaking && p.breakTime-- < 0) {
      p.breaking = true;
      p.breakDuration = random(100, 200);
      p.vx += random(-0.5, 0.5);
      p.vy += random(-0.5, 0.5);
    }

    // End break
    if (p.breaking && p.breakDuration-- < 0) {
      p.breaking = false;
    }

    // Update position
    p.x += p.vx * timeStep;
    p.y += p.vy * timeStep;

    // Add to trail
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > trailLength) {
      p.trail.shift();
    }

    // Draw trail
    beginShape();
    for (let j = 0; j < p.trail.length; j++) {
      const t = p.trail[j];
      const alpha = map(j, 0, p.trail.length, 0, 1);
      fill(p.hue, 80, 90, alpha * 0.5);
      vertex(t.x, t.y);
    }
    endShape();

    // Draw particle
    fill(p.hue, 80, 90);
    ellipse(p.x, p.y, 4, 4);
  }

  // Draw center point
  fill(200, 100, 100);
  ellipse(center.x, center.y, 10, 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
