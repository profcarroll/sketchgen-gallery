let vessels;
let pulseOffset = 0;
const vesselCount = 300;
const connectionCount = 1500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create watercolor paper texture
  background(20, 5, 95);
  for (let i = 0; i < 5000; i++) {
    const x = random(width);
    const y = random(height);
    const sz = random(0.5, 2);
    const c = color(20, 3, 90 + random(5));
    fill(c);
    ellipse(x, y, sz, sz);
  }
  
  // Create vessel network
  vessels = [];
  
  // Core source at center
  vessels.push({
    x: width/2,
    y: height/2,
    size: 8,
    color: color(180, 80, 95),
    pulse: 0,
    pulseSpeed: 0.03,
    connections: []
  });
  
  // Create branching vessels
  for (let i = 1; i < vesselCount; i++) {
    const parent = random(vessels);
    const angle = parent.connections.length * TWO_PI / 6 + random(-0.5, 0.5);
    const dist = random(30, 80);
    const x = parent.x + cos(angle) * dist;
    const y = parent.y + sin(angle) * dist;
    
    // Keep within canvas bounds
    if (x < 0 || x > width || y < 0 || y > height) continue;
    
    vessels.push({
      x: x,
      y: y,
      size: random(2, 8),
      color: color(190 + random(-10, 10), 60, 70 + random(10)),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.015, 0.035),
      connections: []
    });
    
    // Connect to parent
    parent.connections.push(vessels[i]);
    vessels[i].connections.push(parent);
  }
  
  // Create connections between nearby vessels
  const gridSize = 120;
  const grid = [];
  
  for (let i = 0; i < vessels.length; i++) {
    const vessel = vessels[i];
    const gridX = floor(vessel.x / gridSize);
    const gridY = floor(vessel.y / gridSize);
    
    if (!grid[gridX]) grid[gridX] = [];
    if (!grid[gridX][gridY]) grid[gridX][gridY] = [];
    
    grid[gridX][gridY].push(vessel);
  }
  
  // Connect nearby vessels
  for (let i = 0; i < connectionCount && vessels.length > 0; i++) {
    const vesselA = random(vessels);
    let vesselB;
    
    let found = false;
    let attempts = 0;
    while (!found && attempts < 50) {
      attempts++;
      const gridX = floor(vesselA.x / gridSize);
      const gridY = floor(vesselA.y / gridSize);
      
      const nearbyGridX = gridX + floor(random(-2, 3));
      const nearbyGridY = gridY + floor(random(-2, 3));
      
      if (grid[nearbyGridX] && grid[nearbyGridX][nearbyGridY] && 
          grid[nearbyGridX][nearbyGridY].length > 0) {
        vesselB = random(grid[nearbyGridX][nearbyGridY]);
        if (vesselA !== vesselB && !vesselA.connections.includes(vesselB)) {
          vesselA.connections.push(vesselB);
          vesselB.connections.push(vesselA);
          found = true;
        }
      }
    }
  }
  
  // Set up lighting effect
  noStroke();
}

function draw() {
  // Fade out slightly for trail effect
  fill(20, 5, 95, 0.1);
  rect(0, 0, width, height);
  
  pulseOffset += 0.02;
  
  // Draw connections
  strokeWeight(1);
  for (let vessel of vessels) {
    for (let connected of vessel.connections) {
      const pulseA = sin(vessel.pulse + pulseOffset) * 0.5 + 0.5;
      const pulseB = sin(connected.pulse + pulseOffset) * 0.5 + 0.5;
      const avgPulse = (pulseA + pulseB) / 2;
      
      const lerpCol = lerpColor(vessel.color, connected.color, 0.5);
      stroke(red(lerpCol), green(lerpCol), blue(lerpCol), avgPulse * 30);
      
      line(vessel.x, vessel.y, connected.x, connected.y);
    }
  }
  
  // Draw vessels
  for (let vessel of vessels) {
    const pulse = sin(vessel.pulse + pulseOffset) * 0.5 + 0.5;
    
    // Glow effect
    fill(red(vessel.color), green(vessel.color), blue(vessel.color), pulse * 100);
    ellipse(vessel.x, vessel.y, vessel.size * pulse * 2);
    
    // Main vessel
    fill(vessel.color);
    noStroke();
    ellipse(vessel.x, vessel.y, vessel.size);
    
    // Update pulse
    vessel.pulse += vessel.pulseSpeed;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
