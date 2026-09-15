let grid = [];
let cols, rows;
let cellSize = 40;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);
  
  // Initialize grid
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = {
        x: i * cellSize,
        y: j * cellSize,
        pulse: random(1),
        glitch: 0,
        intensity: 0
      };
    }
  }
}

function draw() {
  background(10, 10, 20);
  
  time += 0.01;
  
  // Draw grid lines with pulsing and glitch effects
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let cell = grid[i][j];
      
      // Update pulse
      cell.pulse += 0.01;
      if (cell.pulse > TWO_PI) cell.pulse = 0;
      
      // Glitch effect
      cell.glitch = noise(i * 0.1, j * 0.1, time * 0.5) * 0.5 + 0.5;
      
      // Intensity based on neighbors
      let intensity = 0;
      if (i > 0 && j > 0 && i < cols - 1 && j < rows - 1) {
        intensity = (
          grid[i-1][j].pulse +
          grid[i+1][j].pulse +
          grid[i][j-1].pulse +
          grid[i][j+1].pulse
        ) * 0.25;
      }
      cell.intensity = intensity;
      
      // Draw connections to neighbors
      stroke(0, 255, 255);
      strokeWeight(1);
      
      // Horizontal line
      if (i < cols - 1) {
        let next = grid[i+1][j];
        let alpha = map(sin(cell.pulse + next.pulse), -1, 1, 30, 100);
        alpha *= cell.glitch * 0.5 + 0.5;
        stroke(0, 255, 255, alpha);
        
        // Draw with glitch effect
        if (random() > 0.98) {
          line(cell.x, cell.y, next.x, next.y);
        } else {
          let offset = random(-3, 3);
          line(cell.x + offset, cell.y, next.x + offset, next.y);
        }
      }
      
      // Vertical line
      if (j < rows - 1) {
        let next = grid[i][j+1];
        let alpha = map(sin(cell.pulse + next.pulse), -1, 1, 30, 100);
        alpha *= cell.glitch * 0.5 + 0.5;
        stroke(0, 255, 255, alpha);
        
        if (random() > 0.98) {
          line(cell.x, cell.y, next.x, next.y);
        } else {
          let offset = random(-3, 3);
          line(cell.x, cell.y + offset, next.x, next.y + offset);
        }
      }
      
      // Central glow effect
      noStroke();
      fill(0, 255, 255, map(sin(time + i + j), -1, 1, 30, 80));
      ellipse(cell.x, cell.y, 4 + sin(time + i + j) * 2);
    }
  }
  
  // Add occasional random bursts
  if (frameCount % 60 === 0) {
    let x = floor(random(cols));
    let y = floor(random(rows));
    grid[x][y].glitch = 1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
