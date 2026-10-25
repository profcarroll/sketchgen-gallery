let cables = [];
let grid = [];
const GRID_SIZE = 20;
const CELL_SIZE = 150;
const TOTAL_CABLES = 600;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize the grid for spatial hashing
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = [];
    }
  }

  // Create cables in a grid pattern with some randomness
  for (let i = 0; i < TOTAL_CABLES; i++) {
    const x = random(width);
    const y = random(height);
    const size = random(2, 6);
    const pulseSpeed = random(0.03, 0.07);
    const pulsePhase = random(TWO_PI);
    const hue = random(170, 190); // Cyan to blue

    // Distribute cables in grid cells
    const cellX = floor(x / CELL_SIZE) % GRID_SIZE;
    const cellY = floor(y / CELL_SIZE) % GRID_SIZE;

    cables.push({
      x,
      y,
      size,
      pulseSpeed,
      pulsePhase,
      hue
    });

    // Add to grid for spatial hashing
    grid[cellX][cellY].push(i);
  }
}

function draw() {
  background(10, 20, 30); // Dark ocean floor

  // Draw pulsing cables
  noStroke();
  for (let i = 0; i < cables.length; i++) {
    const c = cables[i];
    
    // Calculate pulse effect
    const pulse = sin(frameCount * c.pulseSpeed + c.pulsePhase) * 0.5 + 0.5;
    const intensity = map(pulse, 0, 1, 50, 255);
    
    // Apply pulsing to bioluminescent color (cyan)
    fill(c.hue, 255, 255, intensity * 0.7);
    
    // Draw each cable
    ellipse(c.x, c.y, c.size * pulse, c.size * pulse);
  }

  // Draw connections between nearby cables
  stroke(180, 255, 255, 80);
  strokeWeight(0.3);
  beginShape(LINES);
  for (let i = 0; i < cables.length; i++) {
    const c1 = cables[i];
    
    // Check nearby grid cells
    const startX = max(0, c1.cellX - 1);
    const endX = min(GRID_SIZE - 1, c1.cellX + 1);
    const startY = max(0, c1.cellY - 1);
    const endY = min(GRID_SIZE - 1, c1.cellY + 1);
    
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const neighbors = grid[x][y];
        for (let j of neighbors) {
          if (i !== j) {
            const c2 = cables[j];
            const d = dist(c1.x, c1.y, c2.x, c2.y);
            
            // Only connect nearby cables
            if (d < 100) {
              vertex(c1.x, c1.y);
              vertex(c2.x, c2.y);
            }
          }
        }
      }
    }
  }
  endShape();
}
