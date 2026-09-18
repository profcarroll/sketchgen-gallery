let grid = [];
let gridSize = 20;
let cellSize = 20;
let waveRadius = 0;
let waveSpeed = 2;
let waveCenter = { x: 0, y: 0 };
let waveActive = false;
let fadeRate = 0.95;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize grid of cells
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      grid.push({
        x: x,
        y: y,
        pulse: random(0, 1),
        pulseSpeed: random(0.005, 0.02),
        fade: 0,
        lastHitTime: 0
      });
    }
  }
}

function draw() {
  background(10);
  
  // Draw each cell
  for (let i = 0; i < grid.length; i++) {
    let cell = grid[i];
    
    // Update pulse animation
    cell.pulse += cell.pulseSpeed;
    if (cell.pulse > 1) cell.pulse = 0;
    
    // Calculate brightness based on pulse and fade
    let brightness = map(sin(cell.pulse), -1, 1, 50, 200);
    brightness *= (1 - cell.fade);
    
    // Draw cell with slight glow effect
    fill(brightness);
    noStroke();
    rect(cell.x, cell.y, cellSize, cellSize, 3);
    
    // If wave is active, check if this cell is hit
    if (waveActive) {
      let d = dist(cell.x + cellSize/2, cell.y + cellSize/2, waveCenter.x, waveCenter.y);
      if (d < waveRadius && d > waveRadius - 10) {
        cell.fade = 1;
        cell.lastHitTime = millis();
      }
    }
    
    // Update fade value
    if (cell.fade > 0) {
      cell.fade *= fadeRate;
      if (cell.fade < 0.01) cell.fade = 0;
    }
  }
  
  // Update wave animation
  if (waveActive) {
    waveRadius += waveSpeed;
    if (waveRadius > max(width, height)) {
      waveActive = false;
      waveRadius = 0;
    }
  }
}

function mousePressed() {
  waveCenter.x = mouseX;
  waveCenter.y = mouseY;
  waveActive = true;
  waveRadius = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
