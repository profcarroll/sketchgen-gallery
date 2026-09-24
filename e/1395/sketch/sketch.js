let nodes = [];
let connections = [];
let time = 0;
let mouseInfluence = 0;
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create a spatial grid for efficient neighbor lookups
  const gridSize = 50;
  const cellSize = 200;
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }

  // Create nodes in a grid pattern
  const nodeCount = 200;
  for (let i = 0; i < nodeCount; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const z = random(-1000, 1000);
    
    nodes.push({ x, y, z });
    
    // Add to spatial grid
    const gridX = floor((x + width/2) / cellSize);
    const gridY = floor((y + height/2) / cellSize);
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      grid[gridX][gridY].push(i);
    }
  }

  // Create connections between nearby nodes using spatial grid
  const maxDistance = 150;
  const maxConnections = 2000;
  let totalConnections = 0;

  for (let i = 0; i < nodes.length && totalConnections < maxConnections; i++) {
    const node = nodes[i];
    const gridX = floor((node.x + width/2) / cellSize);
    const gridY = floor((node.y + height/2) / cellSize);

    // Check neighboring cells
    for (let dx = -1; dx <= 1 && totalConnections < maxConnections; dx++) {
      for (let dy = -1; dy <= 1 && totalConnections < maxConnections; dy++) {
        const checkX = gridX + dx;
        const checkY = gridY + dy;

        if (checkX >= 0 && checkX < gridSize && checkY >= 0 && checkY < gridSize) {
          for (let j of grid[checkX][checkY]) {
            if (i >= j || totalConnections >= maxConnections) continue;
            
            const otherNode = nodes[j];
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const dz = node.z - otherNode.z;
            const distance = sqrt(dx*dx + dy*dy + dz*dz);
            
            if (distance < maxDistance) {
              connections.push({ a: i, b: j });
              totalConnections++;
            }
          }
        }
      }
    }
  }
}

function draw() {
  background(0);
  time += 0.002;

  // Camera movement
  const camX = sin(time * 0.3) * 500;
  const camY = cos(time * 0.2) * 300;
  const camZ = sin(time * 0.1) * 400;
  
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  // Apply mouse influence
  if (mouseInfluence > 0) {
    mouseInfluence -= 0.02;
  }

  // Draw all connections at once
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    const a = nodes[c.a];
    const b = nodes[c.b];
    
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    const distance = sqrt(dx*dx + dy*dy + dz*dz);
    
    // Color based on distance and time
    const hue = (time * 20 + distance * 0.1) % 360;
    const sat = 80 + sin(time + distance * 0.01) * 20;
    const bright = 50 + sin(time * 0.5 + distance * 0.02) * 30;
    
    // Apply mouse influence to nearby connections
    const influence = mouseInfluence * 1000 / (distance + 1);
    const glow = map(influence, 0, 1, 0, 1);
    
    if (glow > 0.01) {
      stroke(hue, sat, bright + 30 * glow, 0.8 + 0.2 * glow);
    } else {
      stroke(hue, sat, bright, 0.5);
    }
    
    vertex(a.x, a.y, a.z);
    vertex(b.x, b.y, b.z);
  }
  endShape();

  // Draw nodes with metallic and copper tones
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    
    const hue = (time * 10 + i) % 360;
    const sat = 70 + sin(time * 0.5 + i * 0.02) * 20;
    const bright = 40 + cos(time * 0.3 + i * 0.03) * 30;
    
    // Node glow effect
    const distToCam = dist(n.x, n.y, n.z, camX, camY, camZ);
    const size = map(distToCam, 0, 2000, 5, 1);
    
    fill(hue, sat, bright, 0.8);
    vertex(n.x, n.y, n.z);
  }
  endShape();

  // Add electric green paths
  stroke(120, 100, 100, 0.7);
  strokeWeight(1);
  beginShape(LINES);
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (i % 5 === 0) {
      vertex(n.x, n.y, n.z);
      const next = nodes[(i + 1) % nodes.length];
      vertex(next.x, next.y, next.z);
    }
  }
  endShape();
}

function mousePressed() {
  // Activate mouse influence
  mouseInfluence = 1;
}

function mouseMoved() {
  // Simple influence effect on nodes near cursor
  const mouseNormX = (mouseX - width/2) / (width/2);
  const mouseNormY = (mouseY - height/2) / (height/2);
  
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const dx = mouseNormX * width/2 - n.x;
    const dy = mouseNormY * height/2 - n.y;
    const distance = sqrt(dx*dx + dy*dy);
    
    if (distance < 300) {
      const influence = map(distance, 0, 300, 1, 0);
      nodes[i].z += influence * 50;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
