let grid = [];
const cols = 60;
const rows = 45;
const cellSize = 10;
let growth = [];
let crystallized = false;
let crystalTime = 0;
let frameCountdown = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Initialize grid with dark pixels
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = color(0);
    }
  }

  // Initialize growth points
  for (let i = 0; i < 15; i++) {
    growth.push({
      x: random(cols),
      y: random(rows),
      size: 0,
      maxRadius: random(3, 8),
      speed: random(0.03, 0.07),
      age: 0,
      maxAge: random(200, 400)
    });
  }
}

function draw() {
  background(0);

  // Draw grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] !== color(0)) {
        fill(grid[y][x]);
        noStroke();
        rect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Update and draw growth
  for (let i = 0; i < growth.length; i++) {
    let g = growth[i];
    
    // Grow
    g.age += 1;
    if (g.age > g.maxAge) {
      g.age = 0;
      g.x = random(cols);
      g.y = random(rows);
      g.size = 0;
    }

    g.size += g.speed;

    // Draw growing circle
    noFill();
    stroke(255, 150);
    strokeWeight(1);
    ellipse(
      g.x * cellSize + cellSize / 2,
      g.y * cellSize + cellSize / 2,
      g.size * 2,
      g.size * 2
    );

    // When reached max radius, crystallize the area around it
    if (g.size >= g.maxRadius && !crystallized) {
      crystallized = true;
      crystalTime = frameCount;
      
      // Create crystalline formations
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let dx = x - g.x;
          let dy = y - g.y;
          let distance = sqrt(dx * dx + dy * dy);
          
          if (distance < g.maxRadius) {
            // Freeze the pixel
            let r = random(150, 255);
            let g_val = random(150, 255);
            let b = random(150, 255);
            grid[y][x] = color(r, g_val, b);
          }
        }
      }
    }

    // After crystallization, create geometric shards
    if (crystallized && frameCount > crystalTime + 30) {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let dx = x - g.x;
          let dy = y - g.y;
          let distance = sqrt(dx * dx + dy * dy);
          
          if (distance < g.maxRadius && grid[y][x] !== color(0)) {
            // Convert to sharp geometric tile
            let r = red(grid[y][x]);
            let g_val = green(grid[y][x]);
            let b = blue(grid[y][x]);
            
            fill(r, g_val, b);
            noStroke();
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  }

  // Draw the crystalline tiles
  if (crystallized) {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x] !== color(0)) {
          let r = red(grid[y][x]);
          let g_val = green(grid[y][x]);
          let b = blue(grid[y][x]);
          
          fill(r, g_val, b);
          noStroke();
          rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  // Stop animation after a few seconds
  if (frameCount > 300) {
    noLoop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
