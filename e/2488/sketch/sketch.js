let veins = [];
let connections = [];
const TOTAL_VEINS = 1000;
const GRID_SIZE = 40;
const CELL_SIZE = 150;
const CONNECTION_THRESHOLD = 120;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Initialize grid for spatial hashing
  let grid = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = [];
    }
  }

  // Create veins in a grid pattern with some randomness
  for (let i = 0; i < TOTAL_VEINS; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const z = random(-200, 200); // Depth in the crust
    const size = random(1.5, 3);
    const pulseSpeed = random(0.01, 0.03);
    const pulsePhase = random(TWO_PI);
    const hue = random(160, 180); // Cyan to blue

    // Distribute veins in grid cells
    const cellX = floor((x + width/2) / CELL_SIZE) % GRID_SIZE;
    const cellY = floor((y + height/2) / CELL_SIZE) % GRID_SIZE;

    veins.push({
      x,
      y,
      z,
      size,
      pulseSpeed,
      pulsePhase,
      hue
    });

    // Add to grid for spatial hashing
    grid[cellX][cellY].push(i);
  }

  // Generate connections between nearby veins
  for (let i = 0; i < veins.length; i++) {
    const v1 = veins[i];
    
    // Check nearby grid cells
    const startX = max(0, floor((v1.x + width/2) / CELL_SIZE) - 1);
    const endX = min(GRID_SIZE - 1, floor((v1.x + width/2) / CELL_SIZE) + 1);
    const startY = max(0, floor((v1.y + height/2) / CELL_SIZE) - 1);
    const endY = min(GRID_SIZE - 1, floor((v1.y + height/2) / CELL_SIZE) + 1);
    
    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y <= endY; y++) {
        const neighbors = grid[x][y];
        for (let j of neighbors) {
          if (i !== j) {
            const v2 = veins[j];
            const d = dist(v1.x, v1.y, v2.x, v2.y);
            
            // Only connect nearby veins
            if (d < CONNECTION_THRESHOLD) {
              connections.push({
                x1: v1.x,
                y1: v1.y,
                z1: v1.z,
                x2: v2.x,
                y2: v2.y,
                z2: v2.z
              });
            }
          }
        }
      }
    }
  }

  // Limit connections to avoid overdraw
  if (connections.length > 3000) {
    connections = connections.slice(0, 3000);
  }
}

function draw() {
  background(10, 15, 25); // Dark oceanic crust

  // Rotate the scene slowly for an orbital view
  rotateY(frameCount * 0.001);
  rotateX(frameCount * 0.0005);

  // Draw pulsing veins as points for performance
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < veins.length; i++) {
    const v = veins[i];
    
    // Calculate pulse effect
    const pulse = sin(frameCount * v.pulseSpeed + v.pulsePhase) * 0.5 + 0.5;
    const intensity = map(pulse, 0, 1, 30, 255);
    
    // Apply pulsing to bioluminescent color (cyan)
    fill(v.hue, 255, 255, intensity * 0.7);
    
    vertex(v.x, v.y, v.z);
  }
  endShape();

  // Draw connections between nearby veins
  stroke(180, 255, 255, 60);
  strokeWeight(0.3);
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    vertex(c.x1, c.y1, c.z1);
    vertex(c.x2, c.y2, c.z2);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
