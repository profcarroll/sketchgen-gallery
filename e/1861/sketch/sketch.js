let nodes = [];
let connections = [];
let time = 0;
let ringRadius = 0;
let maxRingRadius = 150;

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
    
    nodes.push({ 
      x, 
      y, 
      phase: random(TWO_PI),
      lastPulseTime: random(1000)
    });
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
    
    // Asynchronous pulsing glow effect
    const pulseA = sin(time * 2 + a.phase) * 0.4 + 0.6;
    const pulseB = sin(time * 2 + b.phase) * 0.4 + 0.6;
    
    // Average pulse for the connection
    const avgPulse = (pulseA + pulseB) / 2;
    
    // Color based on position and time
    const hue = (time * 15 + a.x * 0.01 + a.y * 0.01) % 360;
    const sat = 85 + sin(time + i * 0.02) * 15;
    const bright = 45 + sin(time * 0.7 + i * 0.03) * 25;
    
    stroke(hue, sat, bright, avgPulse * 0.7);
    
    vertex(a.x, a.y);
    vertex(b.x, b.y);
  }
  endShape();

  // Draw nodes with asynchronous violet pulse and ring effect
  noStroke();
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    
    const pulse = sin(time * 2 + n.phase) * 0.5 + 0.5;
    const size = 1.5 + pulse * 4;
    
    // Use a deep violet color for all nodes
    const hue = 270; // Deep violet
    const sat = 95;
    const bright = 60 + pulse * 30;
    
    fill(hue, sat, bright, 0.8);
    ellipse(n.x, n.y, size);
    
    // Draw expanding ring from node
    const timeSincePulse = millis() - n.lastPulseTime;
    if (timeSincePulse > 500) {
      n.lastPulseTime = millis();
      ringRadius = 0;
    }
    
    if (timeSincePulse < 1000) {
      // Draw the expanding ring
      const ringAlpha = map(timeSincePulse, 0, 1000, 0.8, 0);
      const ringSize = map(timeSincePulse, 0, 1000, 0, maxRingRadius);
      
      stroke(hue, sat, bright, ringAlpha * 0.5);
      strokeWeight(1);
      noFill();
      ellipse(n.x, n.y, ringSize);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
