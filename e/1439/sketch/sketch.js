let grid = [];
let gridSize = 20;
let cellSize;
let time = 0;
let breakTimer = 0;
let breakDuration = 100;
let isBreaking = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellSize = min(width, height) / gridSize;
  
  // Initialize grid points
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = {
        x: i * cellSize,
        y: j * cellSize,
        intensity: random(0.5, 1),
        pulse: random(TWO_PI)
      };
    }
  }
}

function draw() {
  background(0);
  time += 0.02;
  
  // Break grid periodically
  breakTimer++;
  if (breakTimer > 300 && !isBreaking) {
    isBreaking = true;
    breakTimer = 0;
  } else if (breakTimer > breakDuration && isBreaking) {
    isBreaking = false;
    breakTimer = 0;
  }
  
  // Draw connections
  stroke(255, 255, 255, 100);
  strokeWeight(1);
  
  for (let i = 0; i < gridSize - 1; i++) {
    for (let j = 0; j < gridSize - 1; j++) {
      let p1 = grid[i][j];
      let p2 = grid[i+1][j];
      let p3 = grid[i][j+1];
      
      // Calculate pulse effect
      let pulse1 = sin(time + p1.pulse) * 0.5 + 0.5;
      let pulse2 = sin(time + p2.pulse) * 0.5 + 0.5;
      let pulse3 = sin(time + p3.pulse) * 0.5 + 0.5;
      
      // Apply breaking effect
      if (isBreaking) {
        let dist1 = dist(p1.x, p1.y, p2.x, p2.y);
        let dist2 = dist(p1.x, p1.y, p3.x, p3.y);
        
        if (random() > 0.7) {
          stroke(255, 0, 0, 200 * pulse1);
          line(p1.x, p1.y, p2.x, p2.y);
        } else {
          stroke(255, 255, 255, 50 * pulse1);
          line(p1.x, p1.y, p2.x, p2.y);
        }
        
        if (random() > 0.7) {
          stroke(255, 0, 0, 200 * pulse1);
          line(p1.x, p1.y, p3.x, p3.y);
        } else {
          stroke(255, 255, 255, 50 * pulse1);
          line(p1.x, p1.y, p3.x, p3.y);
        }
      } else {
        // Normal grid connection
        stroke(255, 255, 255, 100 * pulse1);
        line(p1.x, p1.y, p2.x, p2.y);
        line(p1.x, p1.y, p3.x, p3.y);
      }
    }
  }
  
  // Update points for pulsing effect
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid[i][j].pulse += 0.05;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cellSize = min(width, height) / gridSize;
}
