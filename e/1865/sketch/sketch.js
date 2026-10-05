let grid = [];
let time = 0;
let connections = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  
  // Create a grid of points
  const gridSize = 25;
  for (let x = 0; x < width; x += gridSize) {
    for (let y = 0; y < height; y += gridSize) {
      grid.push({x, y, stable: false, pulse: 0});
    }
  }

  // Pre-generate connections between nearby points
  connections = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = i + 1; j < grid.length; j++) {
      if (dist(grid[i].x, grid[i].y, grid[j].x, grid[j].y) < 100) {
        connections.push({i, j});
      }
    }
  }
}

function draw() {
  background(10, 5, 15);
  
  time += 0.005;
  
  // Draw pulsing grid lines
  stroke(255, 30);
  strokeWeight(1);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < grid.length; i++) {
    const p = grid[i];
    
    // Apply noise to determine pulse
    const n = noise(p.x * 0.01, p.y * 0.01, time * 0.3);
    const a = map(n, 0, 1, 0, TWO_PI);
    const pulse = sin(time + a) * 0.5 + 0.5;
    
    // Pulsing grid
    stroke(255, 80 + pulse * 175);
    vertex(p.x, p.y, 0);
    vertex(p.x + 15 * cos(a), p.y + 15 * sin(a), 0);
    
    // Occasionally stabilize points
    if (random() < 0.0002 && !p.stable) {
      p.stable = true;
    }
  }
  endShape();
  
  // Draw glowing neon lines connecting points
  stroke(255, 150);
  strokeWeight(1);
  
  beginShape(LINES);
  for (let i = 0; i < connections.length && i < 400; i++) {
    const l = connections[i];
    const p1 = grid[l.i];
    const p2 = grid[l.j];
    
    // Only draw if both points are not yet stable
    if (!p1.stable && !p2.stable) {
      // Pulse the connection
      const pulse = sin(time * 1.5 + (p1.x + p1.y) * 0.01) * 0.5 + 0.5;
      stroke(255, 80 + pulse * 175);
      vertex(p1.x, p1.y, 0);
      vertex(p2.x, p2.y, 0);
    }
  }
  endShape();
  
  // Draw stable grid points as permanent glowing dots
  stroke(255, 200);
  strokeWeight(2);
  noFill();
  
  beginShape(POINTS);
  for (let i = 0; i < grid.length; i++) {
    const p = grid[i];
    if (p.stable) {
      vertex(p.x, p.y, 0);
    }
  }
  endShape();
  
  // Draw crystalline patterns from stable points
  stroke(255, 100);
  strokeWeight(1);
  noFill();
  
  beginShape(LINES);
  for (let i = 0; i < grid.length; i++) {
    const p1 = grid[i];
    if (!p1.stable) continue;
    
    for (let j = i + 1; j < grid.length; j++) {
      const p2 = grid[j];
      if (!p2.stable) continue;
      
      // Connect every third stable point to create a crystalline structure
      if ((i % 3 === 0) && (j % 3 === 0)) {
        stroke(255, 100 + sin(time * 0.5 + i * 0.1) * 50);
        vertex(p1.x, p1.y, 0);
        vertex(p2.x, p2.y, 0);
      }
    }
  }
  endShape();
  
  // Randomly flicker grid lines
  if (random() < 0.03) {
    stroke(255, 255);
    strokeWeight(3);
    beginShape(LINES);
    const idx = floor(random(grid.length));
    const p = grid[idx];
    vertex(p.x - 8, p.y - 8, 0);
    vertex(p.x + 8, p.y + 8, 0);
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
