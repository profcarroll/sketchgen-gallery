let trails = [];
let grid = [];
let gridSize = 30;
let particleCount = 500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateGrid();
  
  // Initialize trails
  for (let i = 0; i < particleCount; i++) {
    trails.push({
      x: random(width),
      y: random(height),
      history: [],
      hue: random(180, 240),
      size: random(2, 6),
      speed: random(0.5, 2)
    });
  }
}

function draw() {
  background(0);
  
  // Draw grid structure
  stroke(255, 30);
  strokeWeight(1);
  for (let i = 0; i < grid.length; i++) {
    let tile = grid[i];
    rect(tile.x, tile.y, tile.w, tile.h);
  }
  
  // Update and draw trails
  for (let i = 0; i < trails.length; i++) {
    let t = trails[i];
    
    // Add current position to history
    t.history.push({x: t.x, y: t.y});
    if (t.history.length > 20) {
      t.history.shift();
    }
    
    // Move trail
    let angle = noise(t.x * 0.01, t.y * 0.01, frameCount * 0.01) * TWO_PI;
    t.x += cos(angle) * t.speed;
    t.y += sin(angle) * t.speed;
    
    // Wrap around edges
    if (t.x < 0) t.x = width;
    if (t.x > width) t.x = 0;
    if (t.y < 0) t.y = height;
    if (t.y > height) t.y = 0;
    
    // Draw trail history
    noFill();
    stroke(t.hue, 100, 100, 80);
    strokeWeight(t.size);
    beginShape();
    for (let j = 0; j < t.history.length; j++) {
      let pos = t.history[j];
      vertex(pos.x, pos.y);
    }
    endShape();
    
    // Draw current point
    fill(t.hue, 100, 100);
    noStroke();
    ellipse(t.x, t.y, t.size * 2);
  }
}

function generateGrid() {
  grid = [];
  let cols = width / gridSize + 2;
  let rows = height / gridSize + 2;
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid.push({
        x: i * gridSize,
        y: j * gridSize,
        w: gridSize,
        h: gridSize
      });
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateGrid();
}
