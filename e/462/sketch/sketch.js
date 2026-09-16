let grid = [];
let cellSize = 20;
let cols, rows;
let waveRadius = 0;
let waveSpeed = 2;
let waveCenter;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.ceil(width / cellSize);
  rows = Math.ceil(height / cellSize);

  // Initialize grid with cells
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = {
        x: x * cellSize,
        y: y * cellSize,
        pulse: random(TWO_PI),
        baseColor: color(100, 150, 200),
        isRipple: false
      };
    }
  }
}

function draw() {
  background(10);
  
  // Update and display grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = grid[y][x];
      
      // Pulsing effect
      cell.pulse += 0.02;
      let pulseValue = sin(cell.pulse) * 0.3 + 0.7;
      
      // Ripple effect
      if (cell.isRipple) {
        let d = dist(cell.x, cell.y, waveCenter.x, waveCenter.y);
        if (d < waveRadius) {
          pulseValue = 1.5; // Brighten during ripple
        } else if (d < waveRadius + 20) {
          pulseValue = 0.5; // Dim after ripple passes
        }
      }

      fill(cell.baseColor);
      noStroke();
      
      push();
      translate(cell.x + cellSize/2, cell.y + cellSize/2);
      scale(pulseValue);
      rectMode(CENTER);
      rect(0, 0, cellSize - 2, cellSize - 2);
      pop();
    }
  }

  // Update wave
  if (waveRadius > 0) {
    waveRadius += waveSpeed;
  }

  // Reset wave after it passes the canvas
  if (waveRadius > max(width, height) * 1.5) {
    waveRadius = 0;
  }
}

function mousePressed() {
  waveCenter = { x: mouseX, y: mouseY };
  waveRadius = 0;
  
  // Mark cells that are affected by ripple
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = grid[y][x];
      let d = dist(cell.x, cell.y, waveCenter.x, waveCenter.y);
      if (d < 50) {
        cell.isRipple = true;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = Math.ceil(width / cellSize);
  rows = Math.ceil(height / cellSize);
}
