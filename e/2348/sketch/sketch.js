let nodes = [];
let connections = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  pixelDensity(1);
  
  // Create nodes in a grid pattern
  const gridSize = 40;
  const nodeCount = (width / gridSize) * (height / gridSize);
  
  for (let i = 0; i < nodeCount; i++) {
    const x = (i % (width / gridSize)) * gridSize + random(gridSize);
    const y = floor(i / (width / gridSize)) * gridSize + random(gridSize);
    
    nodes.push({
      x: x,
      y: y,
      pulse: random(TWO_PI),
      hue: random(240, 300)
    });
  }
  
  // Create connections between nearby nodes
  const maxDistance = gridSize * 1.5;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = sqrt(dx * dx + dy * dy);
      
      if (distance < maxDistance) {
        connections.push({
          node1: i,
          node2: j,
          length: distance
        });
      }
    }
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Draw connections with pulsing glow
  strokeWeight(0.5);
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    const n1 = nodes[c.node1];
    const n2 = nodes[c.node2];
    
    const pulse = sin(time * 2 + n1.pulse) * 0.3 + 0.7;
    const hue = (n1.hue + time * 5) % 360;
    
    stroke(hue, 80, 90, pulse * 0.4);
    line(n1.x, n1.y, n2.x, n2.y);
  }
  
  // Draw nodes with expanding rings
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    
    // Node core
    const pulse = sin(time * 3 + node.pulse) * 0.3 + 0.7;
    fill(node.hue, 90, 95, pulse * 0.8);
    noStroke();
    ellipse(node.x, node.y, 4);
    
    // Expanding ring
    const ringSize = sin(time * 2 + node.pulse) * 10 + 20;
    const ringAlpha = map(ringSize, 10, 30, 0.2, 0);
    
    stroke(node.hue, 80, 90, ringAlpha);
    noFill();
    ellipse(node.x, node.y, ringSize);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
