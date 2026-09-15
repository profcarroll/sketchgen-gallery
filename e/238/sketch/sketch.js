let particles = [];
const particleCount = 150;
const trailLength = 30;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  noStroke();

  // Initialize particles with random positions, velocities, and colors
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      size: random(10, 30),
      hue: random(255),
      trail: []
    });
  }
}

function draw() {
  // Semi-transparent background to create fading effect
  background(0, 0, 0, 20);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // Update position and add to trail
    p.pos.add(p.vel);
    p.trail.push(createVector(p.pos.x, p.pos.y));

    // Limit trail length
    if (p.trail.length > trailLength) {
      p.trail.shift();
    }

    // Bounce off edges
    if (p.pos.x < 0 || p.pos.x > width) p.vel.x *= -1;
    if (p.pos.y < 0 || p.pos.y > height) p.vel.y *= -1;

    // Draw trail
    beginShape();
    for (let j = 0; j < p.trail.length; j++) {
      let alpha = map(j, 0, p.trail.length, 0, 150);
      let size = map(j, 0, p.trail.length, 0, p.size);
      fill(p.hue, 255, 255, alpha);
      noStroke();
      vertex(p.trail[j].x, p.trail[j].y);
    }
    endShape();

    // Draw main particle with pulsing size and shifting hue
    let pulse = sin(frameCount * 0.03 + i) * 5;
    fill((p.hue + frameCount * 0.3) % 255, 255, 255);
    ellipse(p.pos.x, p.pos.y, p.size + pulse);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
