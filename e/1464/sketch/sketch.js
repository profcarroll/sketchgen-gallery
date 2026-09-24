let grid = [];
const cols = 40;
const rows = 30;
const cellSize = 15;
let moss = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // Initialize grid with bright pixels
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      if (random() > 0.7) {
        grid[y][x] = color(
          random(100, 255),
          random(100, 255),
          random(100, 255)
        );
      } else {
        grid[y][x] = color(0);
      }
    }
  }

  // Initialize moss
  for (let i = 0; i < 50; i++) {
    moss.push({
      x: random(cols),
      y: random(rows),
      size: random(1, 3),
      speed: random(0.005, 0.02),
      age: 0,
      maxAge: random(200, 500)
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

  // Update and draw moss
  for (let i = 0; i < moss.length; i++) {
    let m = moss[i];
    
    // Grow moss
    m.age += 1;
    if (m.age > m.maxAge) {
      m.age = 0;
      m.x = random(cols);
      m.y = random(rows);
    }

    // Apply some randomness to movement
    m.x += sin(frameCount * m.speed) * 0.5;
    m.y += cos(frameCount * m.speed) * 0.5;

    // Keep within bounds
    m.x = constrain(m.x, 0, cols - 1);
    m.y = constrain(m.y, 0, rows - 1);

    // Draw moss
    noStroke();
    fill(30, 200, 30, 150);
    ellipse(
      m.x * cellSize + cellSize / 2,
      m.y * cellSize + cellSize / 2,
      m.size * 2,
      m.size * 2
    );

    // Fade out underlying pixel
    let gridX = floor(m.x);
    let gridY = floor(m.y);
    if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
      let c = grid[gridY][gridX];
      if (c !== color(0)) {
        let r = red(c);
        let g = green(c);
        let b = blue(c);
        // Fade the pixel
        grid[gridY][gridX] = color(r * 0.98, g * 0.98, b * 0.98);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
