let particles = [];
let grid = [];
let gridSize = 20;
let cols, rows;

function setup() {
  createCanvas(400, 400);
  cols = width / gridSize;
  rows = height / gridSize;
  
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      life: random(50, 200),
      size: random(2, 6)
    });
  }
  
  grid = new Array(cols * rows);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = [];
  }
}

function draw() {
  background(10, 10, 20);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Move particle
    p.x += p.vx;
    p.y += p.vy;
    
    // Boundary check
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
    }
    
    // Life decay
    p.life--;
    if (p.life <= 0) {
      p.x = random(width);
      p.y = random(height);
      p.life = random(50, 200);
      p.vx = random(-1, 1);
      p.vy = random(-1, 1);
    }
    
    // Draw particle
    noStroke();
    fill(255, 200);
    ellipse(p.x, p.y, p.size);
    
    // Grid indexing
    let col = floor(p.x / gridSize);
    let row = floor(p.y / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[row * cols + col].push(p);
    }
  }
  
  // Process grid for line formation
  for (let i = 0; i < grid.length; i++) {
    let cell = grid[i];
    if (cell.length > 1) {
      // Check neighbors for straight lines
      let x = (i % cols) * gridSize + gridSize / 2;
      let y = floor(i / cols) * gridSize + gridSize / 2;
      
      // Draw connecting lines to nearby particles
      stroke(255, 100);
      noFill();
      beginShape();
      for (let j = 0; j < cell.length; j++) {
        let p = cell[j];
        vertex(p.x, p.y);
      }
      endShape(CLOSE);
      
      // Occasionally form solid squares
      if (frameCount % 120 === 0 && cell.length > 3) {
        // Draw temporary square
        stroke(255, 200);
        noFill();
        rectMode(CENTER);
        rect(x, y, gridSize * 2, gridSize * 2);
      }
    }
    cell.length = 0; // Clear for next frame
  }
}
