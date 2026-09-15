let grid = [];
let cellSize = 40;
let cols, rows;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.ceil(width / cellSize);
  rows = Math.ceil(height / cellSize);
  
  // Initialize grid with cells
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = {
        x: i * cellSize,
        y: j * cellSize,
        flicker: random(1),
        pulse: random(TWO_PI),
        broken: false,
        breakTime: 0
      };
    }
  }
  
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  strokeWeight(2);
}

function draw() {
  background(0);
  time += 0.02;
  
  // Draw grid lines with dynamic flicker
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cell = grid[i][j];
      
      // Update flicker and pulse
      cell.flicker = noise(i * 0.1, j * 0.1, time * 0.5);
      cell.pulse += 0.05;
      
      // Randomly break lines
      if (random() < 0.001) {
        cell.broken = true;
        cell.breakTime = millis();
      }
      
      if (cell.broken && millis() - cell.breakTime > 200) {
        cell.broken = false;
      }
      
      // Draw vertical line
      stroke((time * 20 + i * 10) % 360, 80, 90, 0.7);
      if (!cell.broken) {
        line(cell.x, cell.y, cell.x, cell.y + cellSize);
      } else {
        // Break into staggered segments
        let breakOffset = sin(time * 5 + i + j) * 10;
        line(cell.x, cell.y, cell.x, cell.y + cellSize / 2 - breakOffset);
        line(cell.x, cell.y + cellSize / 2 + breakOffset, cell.x, cell.y + cellSize);
      }
      
      // Draw horizontal line
      stroke((time * 20 + j * 10) % 360, 80, 90, 0.7);
      if (!cell.broken) {
        line(cell.x, cell.y, cell.x + cellSize, cell.y);
      } else {
        // Break into staggered segments
        let breakOffset = sin(time * 5 + i + j) * 10;
        line(cell.x, cell.y, cell.x + cellSize / 2 - breakOffset, cell.y);
        line(cell.x + cellSize / 2 + breakOffset, cell.y, cell.x + cellSize, cell.y);
      }
    }
  }
  
  // Draw connecting pulses
  for (let i = 0; i < cols - 1; i++) {
    for (let j = 0; j < rows - 1; j++) {
      let cellA = grid[i][j];
      let cellB = grid[i+1][j];
      let cellC = grid[i][j+1];
      
      // Connect adjacent cells with pulsing lines
      if (random() < 0.3) {
        let pulse = sin(cellA.pulse) * 0.5 + 0.5;
        stroke(200, 80, 90, pulse * 0.7);
        line(
          cellA.x + cellSize / 2,
          cellA.y + cellSize / 2,
          cellB.x + cellSize / 2,
          cellB.y + cellSize / 2
        );
        
        stroke(200, 80, 90, pulse * 0.7);
        line(
          cellA.x + cellSize / 2,
          cellA.y + cellSize / 2,
          cellC.x + cellSize / 2,
          cellC.y + cellSize / 2
        );
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = Math.ceil(width / cellSize);
  rows = Math.ceil(height / cellSize);
}
