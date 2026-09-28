let nodes = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create nodes in a regular grid pattern
  const nodeCount = 1200;
  const spacing = 50;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  
  for (let i = 0; i < nodeCount; i++) {
    const x = (i % 60 - 30) * spacing;
    const y = floor(i / 60) * spacing;
    
    nodes.push({ x, y });
  }

  // Create horizontal and vertical connections only
  const maxConnections = 2500;
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
  time += 0.01;

  // Draw all connections at once
  strokeWeight(0.6);
  
  beginShape(LINES);
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    const a = nodes[c.a];
    const b = nodes[c.b];
    
    // Pulsing glow effect
    const pulse = sin(time * 3 + i * 0.01) * 0.4 + 0.6;
    
    // Color based on position and time
    const hue = (time * 20 + a.x * 0.01 + a.y * 0.01) % 360;
    const sat = 85 + sin(time + i * 0.02) * 15;
    const bright = 45 + sin(time * 0.7 + i * 0.03) * 25;
    
    stroke(hue, sat, bright, pulse * 0.7);
    
    vertex(a.x, a.x);
    vertex(b.x, b.y);
  }
  endShape();

  // Draw nodes with synchronized emerald pulse
  noStroke();
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    
    const pulse = sin(time * 5 + i * 0.03) * 0.5 + 0.5;
    const size = 1.5 + pulse * 4;
    
    // Use a consistent emerald color for all nodes
    const hue = 120; // Emerald green
    const sat = 95;
    const bright = 70 + pulse * 20;
    
    fill(hue, sat, bright, 0.8);
    ellipse(n.x, n.y, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
