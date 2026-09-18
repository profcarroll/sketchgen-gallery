let particles = [];
const numParticles = 500;
const repelRadius = 80;
const repelForce = 2;
let fadeSpeed = 0.95;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();

  // Initialize particles with random positions and velocities
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      hue: random(360),
      size: random(2, 5),
      alpha: random(0.5, 1)
    });
  }
}

function draw() {
  // Semi-transparent background for trail effect
  fill(0, 0, 0, 0.05);
  rect(0, 0, width, height);

  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // Apply velocity to position
    p.x += p.vx;
    p.y += p.vy;

    // Boundary checks: wrap around screen edges
    if (p.x > width) p.x = 0;
    else if (p.x < 0) p.x = width;
    if (p.y > height) p.y = 0;
    else if (p.y < 0) p.y = height;

    // Apply repulsion force from nearby particles
    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      let other = particles[j];
      let d = dist(p.x, p.y, other.x, other.y);
      if (d < repelRadius) {
        let force = map(d, 0, repelRadius, repelForce, 0);
        let angle = atan2(p.y - other.y, p.x - other.x);
        p.vx += cos(angle) * force;
        p.vy += sin(angle) * force;
      }
    }

    // Limit velocity to avoid excessive speed
    let speed = dist(0, 0, p.vx, p.vy);
    if (speed > 3) {
      p.vx = (p.vx / speed) * 3;
      p.vy = (p.vy / speed) * 3;
    }

    // Draw particle with fading trail
    fill(p.hue, 80, 90, p.alpha);
    ellipse(p.x, p.y, p.size);

    // Slowly decrease alpha for trail effect
    p.alpha *= fadeSpeed;
    if (p.alpha < 0.05) {
      p.alpha = random(0.5, 1); // Reset alpha occasionally
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
