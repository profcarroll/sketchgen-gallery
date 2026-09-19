let particles = [];
let grid = [];
let cols, rows;
let cellSize = 20;
let time = 0;
let frozen = false;

function setup() {
  createCanvas(400, 400);
  cols = width / cellSize;
  rows = height / cellSize;
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-2, 2),
      vy: random(-2, 2),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(0);
  time++;
  
  if (frozen) {
    // Draw frozen particles as glowing dots
    noStroke();
    for (let p of particles) {
      fill(p.color);
      ellipse(p.x, p.y, p.size * 2);
    }
    return;
  }

  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply some chaotic movement
    p.x += p.vx + sin(time * 0.01) * 0.5;
    p.y += p.vy + cos(time * 0.01) * 0.5;

    // Boundary check
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.vx *= -1;
      p.vy *= -1;
    }

    // Update grid
    let col = floor(p.x / cellSize);
    let row = floor(p.y / cellSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[col][row].push(i);
    }
    
    // Draw particle
    noStroke();
    fill(p.color);
    ellipse(p.x, p.y, p.size);
  }

  // Clear grid for next frame
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
}

function mousePressed() {
  frozen = true;
  noLoop();
}
