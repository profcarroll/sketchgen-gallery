let nodes = [];
let connections = [];
let time = 0;
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a spatial grid for efficient neighbor lookups
  const gridSize = 50;
  const cellSize = 100;
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }

  // Create nodes in a regular grid pattern
  const nodeCount = 1500;
  const spacing = 80;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  
  for (let i = 0; i < nodeCount; i++) {
    const x = random(-spacing, spacing) + (i % 50 - 25) * spacing;
    const y = random(-spacing, spacing) + floor(i / 50) * spacing;
    
    // Keep nodes within canvas bounds
    const boundedX = constrain(x, -halfWidth, halfWidth);
    const boundedY = constrain(y, -halfHeight, halfHeight);
    
    nodes.push({ x: boundedX, y: boundedY });
    
    // Add to spatial grid
    const gridX = floor((boundedX + halfWidth) / cellSize);
    const gridY = floor((boundedY + halfHeight) / cellSize);
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      grid[gridX][gridY].push(i);
    }
  }

  // Create horizontal and vertical connections only
  const maxConnections = 2000;
  let totalConnections = 0;

  for (let i = 0; i < nodes.length && totalConnections < maxConnections; i++) {
    const node = nodes[i];
    
    // Connect to nearby nodes in same row or column
    const gridX = floor((node.x + halfWidth) / cellSize);
    const gridY = floor((node.y + halfHeight) / cellSize);

    // Check neighboring cells for horizontal/vertical connections
    for (let dx = -2; dx <= 2 && totalConnections < maxConnections; dx++) {
      for (let dy = -2; dy <= 2 && totalConnections < maxConnections; dy++) {
        if (dx === 0 || dy === 0) { // Only horizontal or vertical
          const checkX = gridX + dx;
          const checkY = gridY + dy;

          if (checkX >= 0 && checkX < gridSize && checkY >= 0 && checkY < gridSize) {
            for (let j of grid[checkX][checkY]) {
              if (i >= j || totalConnections >= maxConnections) continue;
              
              const otherNode = nodes[j];
              // Only connect horizontally or vertically
              if (node.x === otherNode.x || node.y === otherNode.y) {
                connections.push({ a: i, b: j });
                totalConnections++;
              }
            }
          }
        }
      }
    }
  }
}

function draw() {
  background(0);
  time += 0.005;

  // Draw all connections at once
  strokeWeight(0.8);
  
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    const a = nodes[c.a];
    const b = nodes[c.b];
    
    // Pulsing glow effect
    const pulse = sin(time * 2 + i * 0.01) * 0.3 + 0.7;
    
    // Color based on position and time
    const hue = (time * 20 + a.x * 0.01 + a.y * 0.01) % 360;
    const sat = 80 + sin(time + i * 0.02) * 20;
    const bright = 50 + sin(time * 0.5 + i * 0.03) * 30;
    
    stroke(hue, sat, bright, pulse * 0.6);
    
    vertex(a.x, a.y);
    vertex(b.x, b.y);
  }
  endShape();

  // Draw nodes with pulsing glow
  noStroke();
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    
    const pulse = sin(time * 3 + i * 0.02) * 0.5 + 0.5;
    const size = 1 + pulse * 2;
    
    const hue = (time * 10 + i * 0.1) % 360;
    const sat = 90 + sin(time * 0.7 + i * 0.03) * 10;
    const bright = 80 + sin(time * 0.3 + i * 0.04) * 20;
    
    fill(hue, sat, bright, 0.9);
    ellipse(n.x, n.y, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
