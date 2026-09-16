let particles = [];
let grid = [];
let gridSize = 20;
let cols, rows;
let forceStrength = 0.5;
let scatterForce = 0;

function setup() {
  createCanvas(600, 600);
  cols = width / gridSize;
  rows = height / gridSize;

  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      size: random(2, 6),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200),
      targetX: 0,
      targetY: 0,
      inGrid: false
    });
  }

  // Initialize grid
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(10, 10, 20);

  // Update grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }

  // Assign particles to grid cells
  for (let p of particles) {
    let col = floor(p.x / gridSize);
    let row = floor(p.y / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[col][row].push(p);
    }
  }

  // Apply forces
  for (let p of particles) {
    // Mouse interaction
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d < 150) {
      scatterForce = map(d, 0, 150, 1, 0);
      let angle = atan2(p.y - mouseY, p.x - mouseX);
      p.vx += cos(angle) * 0.5 * scatterForce;
      p.vy += sin(angle) * 0.5 * scatterForce;
    } else {
      scatterForce = 0;
    }

    // Grid attraction
    let col = floor(p.x / gridSize);
    let row = floor(p.y / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      if (grid[col][row].length > 0) {
        for (let other of grid[col][row]) {
          if (other !== p) {
            let dx = other.x - p.x;
            let dy = other.y - p.y;
            let distance = sqrt(dx * dx + dy * dy);
            if (distance < 30 && distance > 0) {
              let force = (30 - distance) / 30 * 0.1;
              p.vx += dx * force;
              p.vy += dy * force;
            }
          }
        }
      }
    }

    // Apply velocity
    p.x += p.vx;
    p.y += p.vy;

    // Slow down
    p.vx *= 0.95;
    p.vy *= 0.95;

    // Boundary check
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    // Draw particle
    noStroke();
    fill(p.color);
    ellipse(p.x, p.y, p.size);
  }
}
