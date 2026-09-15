let grid = [];
let particles = [];
let gridSize = 40;
let particleCount = 150;
let trailLength = 20;

function setup() {
  createCanvas(800, 600);
  noStroke();

  // Create grid of points
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      grid.push({ x, y });
    }
  }

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      trail: [],
      color: color(random(100, 255), random(100, 255), 255, 150)
    });
  }
}

function draw() {
  background(10, 10, 20);

  // Draw grid connections
  for (let i = 0; i < grid.length; i++) {
    let a = grid[i];
    for (let j = i + 1; j < grid.length; j++) {
      let b = grid[j];
      let d = dist(a.x, a.y, b.x, b.y);
      if (d < gridSize * 2) {
        let alpha = map(d, 0, gridSize * 2, 50, 0);
        stroke(100, 150, 255, alpha);
        line(a.x, a.y, b.x, b.y);
      }
    }
  }

  // Update and draw particles
  for (let p of particles) {
    // Update position
    p.x += p.vx;
    p.y += p.vy;

    // Wrap around edges
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Add to trail
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > trailLength) {
      p.trail.shift();
    }

    // Draw trail
    noFill();
    stroke(p.color);
    beginShape();
    for (let point of p.trail) {
      vertex(point.x, point.y);
    }
    endShape();

    // Draw particle
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, 4, 4);
  }
}
