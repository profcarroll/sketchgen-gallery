let grid = [];
let cellSize = 20;
let cols, rows;
let waves = [];

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  background(0);

  cols = width / cellSize;
  rows = height / cellSize;

  for (let j = 0; j < rows; j++) {
    grid[j] = [];
    for (let i = 0; i < cols; i++) {
      grid[j][i] = {
        hue: random(360),
        brightness: 10,
        saturation: 90,
        flash: 0,
        glow: 0
      };
    }
  }
}

function draw() {
  background(0);

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = grid[j][i];
      let x = i * cellSize;
      let y = j * cellSize;

      // Apply glow effect
      if (cell.glow > 0) {
        fill(cell.hue, cell.saturation, cell.brightness * cell.glow);
        noStroke();
        rect(x, y, cellSize, cellSize);
        cell.glow -= 0.01;
      } else {
        // Base color with subtle breathing
        let breath = sin(frameCount * 0.02 + i * 0.1 + j * 0.1) * 0.5 + 0.5;
        fill(cell.hue, cell.saturation, cell.brightness + breath * 5);
        noStroke();
        rect(x, y, cellSize, cellSize);
      }

      // Apply flash effect
      if (cell.flash > 0) {
        fill(random(360), 100, 100, cell.flash);
        noStroke();
        rect(x, y, cellSize, cellSize);
        cell.flash -= 0.05;
      }
    }
  }

  // Update and draw waves
  for (let i = waves.length - 1; i >= 0; i--) {
    let wave = waves[i];
    wave.radius += wave.speed;
    if (wave.radius > max(width, height)) {
      waves.splice(i, 1);
      continue;
    }

    // Draw ripple
    stroke(wave.hue, 100, 100, 0.5);
    noFill();
    ellipse(wave.x, wave.y, wave.radius * 2);

    // Apply effects to cells in ripple
    let radius = wave.radius;
    let startI = max(0, floor((wave.x - radius) / cellSize));
    let endI = min(cols - 1, ceil((wave.x + radius) / cellSize));
    let startJ = max(0, floor((wave.y - radius) / cellSize));
    let endJ = min(rows - 1, ceil((wave.y + radius) / cellSize));

    for (let j = startJ; j <= endJ; j++) {
      for (let i = startI; i <= endI; i++) {
        let cell = grid[j][i];
        let cellX = i * cellSize + cellSize / 2;
        let cellY = j * cellSize + cellSize / 2;
        let d = dist(cellX, cellY, wave.x, wave.y);

        if (abs(d - radius) < cellSize) {
          // Flash
          cell.flash = 1.0;
          // Glow
          cell.glow = 1.0;
        }
      }
    }
  }

  // Simulate breathing effect on all cells
  if (frameCount % 30 === 0) {
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        grid[j][i].hue += random(-1, 1);
      }
    }
  }
}

function mousePressed() {
  let hue = random(360);
  waves.push({
    x: mouseX,
    y: mouseY,
    radius: 0,
    speed: 3,
    hue: hue
  });
}
