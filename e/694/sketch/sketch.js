let nodes = [];
let connections = [];
const nodeCount = 150;
const connectionCount = 300;
const time = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(2, 8),
      hue: random(360)
    });
  }
  
  for (let i = 0; i < connectionCount; i++) {
    const a = floor(random(nodeCount));
    let b;
    do {
      b = floor(random(nodeCount));
    } while (b === a);
    
    connections.push({
      a,
      b,
      strength: random(0.1, 0.5),
      targetStrength: random(0.1, 0.5)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  const t = millis() * 0.001;
  
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    
    // Apply some gentle noise to movement
    n.vx += (noise(n.x * 0.01, n.y * 0.01, t) - 0.5) * 0.02;
    n.vy += (noise(n.y * 0.01, n.x * 0.01, t + 100) - 0.5) * 0.02;
    
    // Apply velocity
    n.x += n.vx;
    n.y += n.vy;
    
    // Wrap around the edges
    if (n.x < 0) n.x = width;
    if (n.x > width) n.x = 0;
    if (n.y < 0) n.y = height;
    if (n.y > height) n.y = 0;
    
    // Slow down over time
    n.vx *= 0.98;
    n.vy *= 0.98;
    
    // Draw node
    fill(n.hue, 80, 90, 0.7);
    ellipse(n.x, n.y, n.size);
  }
  
  for (let i = 0; i < connections.length; i++) {
    const c = connections[i];
    const a = nodes[c.a];
    const b = nodes[c.b];
    
    // Update connection strength
    if (random() < 0.01) {
      c.targetStrength = random(0.1, 0.5);
    }
    
    c.strength += (c.targetStrength - c.strength) * 0.02;
    
    // Calculate distance
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Apply connection force
    const targetDist = 100;
    const force = (dist - targetDist) * 0.002;
    
    if (abs(force) > 0.01) {
      a.vx -= dx * force * c.strength;
      a.vy -= dy * force * c.strength;
      b.vx += dx * force * c.strength;
      b.vy += dy * force * c.strength;
    }
    
    // Draw connection
    const alpha = map(dist, 0, 300, 0.8, 0.1);
    if (alpha > 0) {
      stroke(a.hue, 70, 90, alpha);
      line(a.x, a.y, b.x, b.y);
    }
  }
  
  // Occasionally tear apart
  if (frameCount % 300 === 0) {
    for (let i = 0; i < connections.length; i++) {
      const c = connections[i];
      if (random() < 0.2) {
        c.strength = 0;
      }
    }
  }
  
  // Occasionally restore
  if (frameCount % 300 === 150) {
    for (let i = 0; i < connections.length; i++) {
      const c = connections[i];
      c.targetStrength = random(0.1, 0.5);
    }
  }
}
