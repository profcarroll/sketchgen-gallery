let grid;
let particles = [];
let connections = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);

  // Create a grid of points
  grid = [];
  const spacing = 40;
  for (let x = 0; x < width + spacing; x += spacing) {
    for (let y = 0; y < height + spacing; y += spacing) {
      grid.push({ x, y });
    }
  }

  // Initialize particles
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      hue: random(360),
      size: random(2, 6),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(0, 0, 5);

  // Draw grid lines
  stroke(0, 0, 80, 0.2);
  strokeWeight(1);
  for (let i = 0; i < grid.length; i++) {
    const p = grid[i];
    line(p.x, 0, p.x, height);
    line(0, p.y, width, p.y);
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Move particle
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;

    // Bounce off edges
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.angle += random(-0.5, 0.5);
    }

    // Random direction change
    if (random() < 0.02) {
      p.angle += random(-0.3, 0.3);
    }

    // Fade out
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
      particles.push({
        x: random(width),
        y: random(height),
        hue: random(360),
        size: random(2, 6),
        speed: random(0.5, 2),
        angle: random(TWO_PI),
        life: random(100, 300)
      });
    }

    // Draw particle
    fill(p.hue, 80, 90, 0.7);
    ellipse(p.x, p.y, p.size);

    // Connect to nearby particles
    for (let j = i - 1; j >= 0; j--) {
      const other = particles[j];
      const d = dist(p.x, p.y, other.x, other.y);
      if (d < 80) {
        const alpha = map(d, 0, 80, 0.3, 0);
        stroke(p.hue, 70, 90, alpha);
        strokeWeight(1);
        line(p.x, p.y, other.x, other.y);
      }
    }

    // Connect to grid points
    for (let j = 0; j < grid.length; j++) {
      const g = grid[j];
      const d = dist(p.x, p.y, g.x, g.y);
      if (d < 100) {
        const alpha = map(d, 0, 100, 0.2, 0);
        stroke(p.hue, 70, 90, alpha);
        strokeWeight(0.5);
        line(p.x, p.y, g.x, g.y);
      }
    }
  }

  // Occasionally add new particles
  if (random() < 0.1) {
    particles.push({
      x: random(width),
      y: random(height),
      hue: random(360),
      size: random(2, 6),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      life: random(100, 300)
    });
  }
}
