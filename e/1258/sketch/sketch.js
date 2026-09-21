let fibers = [];
let knots = [];
let grid = [];
let gridSize = 40;
let fiberCount = 800;
let knotCount = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize fibers
  for (let i = 0; i < fiberCount; i++) {
    fibers.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(2, 8),
      color: color(random(100, 255), random(50, 200), random(100, 255), 150),
      age: 0
    });
  }
  
  // Initialize knots
  for (let i = 0; i < knotCount; i++) {
    knots.push({
      x: random(width),
      y: random(height),
      size: random(15, 30),
      color: color(random(200, 255), random(100, 150), random(50, 100), 200),
      angle: random(TWO_PI)
    });
  }
  
  // Initialize grid for spatial hashing
  let cols = Math.ceil(width / gridSize);
  let rows = Math.ceil(height / gridSize);
  grid = new Array(cols * rows).fill().map(() => []);
}

function draw() {
  background(10, 5, 20);
  
  // Update and display fibers
  for (let i = 0; i < fibers.length; i++) {
    let f = fibers[i];
    
    // Apply velocity
    f.x += f.vx;
    f.y += f.vy;
    
    // Boundary check with bounce
    if (f.x < 0 || f.x > width) f.vx *= -1;
    if (f.y < 0 || f.y > height) f.vy *= -1;
    
    // Slowly age the fiber
    f.age += 0.01;
    
    // Draw fiber
    fill(f.color);
    ellipse(f.x, f.y, f.size + sin(f.age) * 2);
  }
  
  // Update and display knots
  for (let i = 0; i < knots.length; i++) {
    let k = knots[i];
    
    // Rotate knot
    k.angle += 0.01;
    
    // Draw knot as a geometric shape
    fill(k.color);
    push();
    translate(k.x, k.y);
    rotate(k.angle);
    rectMode(CENTER);
    rect(0, 0, k.size, k.size * 0.6);
    pop();
  }
  
  // Spatial hashing for interactions
  updateGrid();
  drawInteractions();
}

function updateGrid() {
  // Clear grid
  for (let i = 0; i < grid.length; i++) {
    grid[i] = [];
  }
  
  // Place fibers in grid cells
  for (let i = 0; i < fibers.length; i++) {
    let f = fibers[i];
    let col = Math.floor(f.x / gridSize);
    let row = Math.floor(f.y / gridSize);
    let index = row * Math.ceil(width / gridSize) + col;
    
    if (index >= 0 && index < grid.length) {
      grid[index].push(f);
    }
  }
}

function drawInteractions() {
  // Draw connections between nearby fibers
  for (let i = 0; i < fibers.length; i++) {
    let f1 = fibers[i];
    let col = Math.floor(f1.x / gridSize);
    let row = Math.floor(f1.y / gridSize);
    
    // Check neighboring cells
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        let neighborCol = col + dx;
        let neighborRow = row + dy;
        let index = neighborRow * Math.ceil(width / gridSize) + neighborCol;
        
        if (index >= 0 && index < grid.length) {
          for (let j = 0; j < grid[index].length; j++) {
            let f2 = grid[index][j];
            
            // Skip self
            if (f1 === f2) continue;
            
            // Check distance
            let dx = f1.x - f2.x;
            let dy = f1.y - f2.y;
            let dist = sqrt(dx * dx + dy * dy);
            
            if (dist < 50) {
              stroke(255, 30);
              line(f1.x, f1.y, f2.x, f2.y);
            }
          }
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
