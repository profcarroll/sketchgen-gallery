let organisms = [];
let particles = [];
let gridSize = 40;
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize spatial hash grid
  let cols = ceil(width / gridSize);
  let rows = ceil(height / gridSize);
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
  
  // Create organisms
  for (let i = 0; i < 15; i++) {
    organisms.push({
      x: random(width),
      y: random(height),
      size: random(40, 80),
      hue: random(180, 240),
      speed: random(0.1, 0.3),
      angle: random(TWO_PI),
      pulsePhase: random(TWO_PI),
      segmentCount: floor(random(6, 12)),
      segments: []
    });
  }
  
  // Create particles
  for (let i = 0; i < 800; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      hue: random(180, 240),
      sat: random(70, 90),
      bri: random(60, 90),
      speed: random(0.05, 0.2),
      angle: random(TWO_PI),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  // Clear grid
  let cols = ceil(width / gridSize);
  let rows = ceil(height / gridSize);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
    }
  }
  
  // Update and draw particles
  for (let p of particles) {
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    if (p.x < 0) p.x = width;
    else if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    else if (p.y > height) p.y = 0;
    
    // Spatial hash
    let col = floor(p.x / gridSize);
    let row = floor(p.y / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[col][row].push(p);
    }
    
    noStroke();
    fill(p.hue, p.sat, p.bri, 0.7);
    ellipse(p.x, p.y, p.size);
  }
  
  // Update and draw organisms
  for (let o of organisms) {
    o.x += cos(o.angle) * o.speed;
    o.y += sin(o.angle) * o.speed;
    
    if (o.x < 0) o.x = width;
    else if (o.x > width) o.x = 0;
    if (o.y < 0) o.y = height;
    else if (o.y > height) o.y = 0;
    
    // Change direction occasionally
    if (random() < 0.01) {
      o.angle += random(-0.2, 0.2);
    }
    
    o.pulsePhase += 0.03;
    
    // Body pulse
    let pulse = sin(o.pulsePhase) * 0.3 + 0.7;
    let bodySize = o.size * pulse;
    
    noStroke();
    fill(o.hue, 80, 90, 0.2);
    beginShape();
    for (let i = 0; i < o.segmentCount; i++) {
      let angle = TWO_PI * i / o.segmentCount;
      let x = o.x + cos(angle) * bodySize;
      let y = o.y + sin(angle) * bodySize;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Glowing core
    fill(o.hue, 100, 95, 0.5);
    ellipse(o.x, o.y, bodySize * 0.4);
    
    // Tentacles
    stroke(o.hue, 100, 90, 0.3);
    strokeWeight(0.5);
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6 + o.pulsePhase;
      let startX = o.x + cos(angle) * bodySize * 0.6;
      let startY = o.y + sin(angle) * bodySize * 0.6;
      let endX = startX + cos(angle) * bodySize * 0.3;
      let endY = startY + sin(angle) * bodySize * 0.3;
      line(startX, startY, endX, endY);
    }
    
    // Spatial hash
    let col = floor(o.x / gridSize);
    let row = floor(o.y / gridSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      grid[col][row].push(o);
    }
  }
  
  // Draw connections between nearby organisms
  stroke(180, 100, 90, 0.05);
  strokeWeight(0.3);
  for (let o of organisms) {
    let col = floor(o.x / gridSize);
    let row = floor(o.y / gridSize);
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        let nc = col + dx;
        let nr = row + dy;
        
        if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
          for (let other of grid[nc][nr]) {
            if (other !== o && other.segments === undefined) { // Only connect organisms
              let d = dist(o.x, o.y, other.x, other.y);
              if (d < 120) {
                line(o.x, o.y, other.x, other.y);
              }
            }
          }
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
