let grid = [];
let gridSize = 30;
let cellSize;
let time = 0;

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
        pulse: random(TWO_PI),
        broken: false,
        breakTime: 0
      };
    }
  }
}

function draw() {
  background(0);
  time += 0.03;
  
  // Draw connections
  strokeWeight(2);
  
  for (let i = 0; i < gridSize - 1; i++) {
    for (let j = 0; j < gridSize - 1; j++) {
      let p1 = grid[i][j];
      let p2 = grid[i+1][j];
      let p3 = grid[i][j+1];
      
      // Calculate pulse effect
      let pulse1 = sin(time + p1.pulse) * 0.5 + 0.5;
      let pulse2 = sin(time + p2.pulse) * 0.5 + 0.5;
      let pulse3 = sin(time + p3.pulse) * 0.5 + 0.5;
      
      // Draw horizontal connections (intact)
      stroke(0, 255, 255, 150 * pulse1); // Neon cyan
      line(p1.x, p1.y, p2.x, p2.y);
      
      // Draw vertical connections with breaking effect
      stroke(255, 0, 255, 150 * pulse1); // Neon magenta
      if (random() > 0.95) {
        // Break the vertical connection occasionally
        if (!p1.broken) {
          p1.broken = true;
          p1.breakTime = millis();
        }
        
        // Fade out broken line
        let elapsed = millis() - p1.breakTime;
        let alpha = map(elapsed, 0, 500, 150, 0);
        if (alpha > 0) {
          stroke(255, 0, 255, alpha * pulse1);
          line(p1.x, p1.y, p3.x, p3.y);
        } else {
          // Reconnect after delay
          if (elapsed > 1000) {
            p1.broken = false;
          }
        }
      } else {
        // Normal vertical connection
        stroke(255, 0, 255, 150 * pulse1);
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
