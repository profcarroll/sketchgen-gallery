let nodes = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create nodes in a regular grid pattern
  const nodeCount = 800;
  const spacing = 60;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  
  for (let i = 0; i < nodeCount; i++) {
    const x = (i % 50 - 25) * spacing;
    const y = floor(i / 50) * spacing;
    
    nodes.push({ x, y });
  }

  // Create horizontal and vertical connections only
  const maxConnections = 1500;
  let totalConnections = 0;

  for (let i = 0; i < nodes.length && totalConnections < maxConnections; i++) {
    const node = nodes[i];
    
    // Connect to nearby nodes in same row or column
    for (let j = i + 1; j < nodes.length && totalConnections < maxConnections; j++) {
      const otherNode = nodes[j];
      
      // Only connect horizontally or vertically
      if (node.x === otherNode.x || node.y === otherNode.y) {
        connections.push({ a: i, b: j });
        totalConnections++;
      }
    }
  }
}

function draw() {
  background(0);
  time += 0.003;

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
    const hue = (time * 15 + a.x * 0.01 + a.y * 0.01) % 360;
    const sat = 80 + sin(time + i * 0.02) * 20;
    const bright = 50 + sin(time * 0.5 + i * 0.03) * 30;
    
    stroke(hue, sat, bright, pulse * 0.6);
    
    vertex(a.x, a.y);
    vertex(b.x, b.y);
  }
  endShape();

  // Draw nodes with pulsing amber glow
  noStroke();
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    
    const pulse = sin(time * 2 + i * 0.02) * 0.5 + 0.5;
    const size = 1 + pulse * 3;
    
    // Use a consistent amber color for all nodes
    const hue = 30; // Amber
    const sat = 90;
    const bright = 80 + pulse * 20;
    
    fill(hue, sat, bright, 0.9);
    ellipse(n.x, n.y, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
