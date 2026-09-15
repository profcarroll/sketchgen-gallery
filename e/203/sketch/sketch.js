let grid = [];
let cols, rows;
let cellSize = 40;
let time = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  cols = width / cellSize;
  rows = height / cellSize;
  
  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      grid[y][x] = {
        x: x * cellSize,
        y: y * cellSize,
        active: true,
        hue: (x + y) * 2,
        size: random(10, 30)
      };
    }
  }
}

function draw() {
  background(0);
  time += 0.02;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cell = grid[y][x];
      
      // Randomly activate/deactivate cells
      if (random() < 0.01) {
        cell.active = !cell.active;
      }
      
      if (!cell.active) continue;
      
      // Create electric bursts
      let burst = sin(time * 5 + x * 0.2 + y * 0.3) > 0.7;
      
      push();
      translate(cell.x, cell.y);
      
      // Draw grid lines with neon glow
      let hue = (cell.hue + time * 10) % 360;
      fill(hue, 100, 100, 0.8);
      
      if (burst) {
        stroke(hue, 100, 100, 0.9);
        strokeWeight(2);
        line(-cell.size/2, 0, cell.size/2, 0);
        line(0, -cell.size/2, 0, cell.size/2);
      } else {
        noStroke();
        rectMode(CENTER);
        rect(0, 0, cell.size, cell.size);
      }
      
      pop();
    }
  }
  
  // Draw connecting lines between nearby cells
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      let a = grid[y][x];
      let b = grid[y][x + 1];
      let c = grid[y + 1][x];
      
      if (a.active && b.active) {
        stroke(200, 100, 100, 0.3);
        strokeWeight(1);
        line(a.x + cellSize/2, a.y + cellSize/2, b.x + cellSize/2, b.y + cellSize/2);
      }
      
      if (a.active && c.active) {
        stroke(200, 100, 100, 0.3);
        strokeWeight(1);
        line(a.x + cellSize/2, a.y + cellSize/2, c.x + cellSize/2, c.y + cellSize/2);
      }
    }
  }
}
