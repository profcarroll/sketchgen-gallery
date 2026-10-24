let hyphae = [];
let grid = [];
const GRID_SIZE = 30;
const CELL_SIZE = 100;
const TOTAL_HYPHAE = 800;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize the fungal network grid
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = [];
    }
  }

  // Create hyphae in a grid pattern with some randomness
  for (let i = 0; i < TOTAL_HYPHAE; i++) {
    const x = random(width);
    const y = random(height);
    const size = random(1, 3);
    const pulseSpeed = random(0.02, 0.05);
    const pulsePhase = random(TWO_PI);

    // Distribute hyphae in grid cells
    const cellX = floor(x / CELL_SIZE) % GRID_SIZE;
    const cellY = floor(y / CELL_SIZE) % GRID_SIZE;

    hyphae.push({
      x,
      y,
      size,
      pulseSpeed,
      pulsePhase,
      cellX,
      cellY
    });

    // Add to grid for spatial hashing
    grid[cellX][cellY].push(i);
  }
}

function draw() {
  background(20, 30, 10); // Dark forest floor

  // Draw pulsing hyphae network
  noStroke();
  for (let i = 0; i < hyphae.length; i++) {
    const h = hyphae[i];
    
    // Calculate pulse effect
    const pulse = sin(frameCount * h.pulseSpeed + h.pulsePhase) * 0.5 + 0.5;
    const intensity = map(pulse, 0, 1, 30, 255);
    
    // Apply pulsing to bioluminescent color (green)
    fill(0, intensity, 0, 180);
    
    // Draw each hyphae
    ellipse(h.x, h.y, h.size * pulse, h.size * pulse);
  }

  // Draw connections between nearby hyphae
  stroke(0, 150, 0, 100);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < hyphae.length; i++) {
    const h1 = hyphae[i];
    
    // Check nearby grid cells
    const startX = max(0, h1.cellX - 1);
    const endX = min(GRID_SIZE - 1, h1.cellX + 1);
    const startY = max(0, h1.cellY - 1);
    const endY = min(GRID_SIZE - 1, h1.cellY + 1);
    
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const neighbors = grid[x][y];
        for (let j of neighbors) {
          if (i !== j) {
            const h2 = hyphae[j];
            const d = dist(h1.x, h1.y, h2.x, h2.y);
            
            // Only connect nearby hyphae
            if (d < 80) {
              vertex(h1.x, h1.y);
              vertex(h2.x, h2.y);
            }
          }
        }
      }
    }
  }
  endShape();
}
