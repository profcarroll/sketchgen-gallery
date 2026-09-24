let grid = [];
let particles = [];
let spriteClusters = [];
let gridSize = 20;
let glowIntensity = 0;
let mouseInfluence = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize grid
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      grid.push({x, y, active: random() > 0.7});
    }
  }
  
  // Initialize sprite clusters
  for (let i = 0; i < 15; i++) {
    spriteClusters.push({
      x: random(width),
      y: random(height),
      type: int(random(3)), // 0=square, 1=triangle, 2=line
      size: random(10, 30),
      pulse: 0,
      color: color(random([255, 0, 0]), random([0, 255, 0]), random([0, 255, 0]))
    });
  }
  
  // Initialize particles
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      color: color(random([0, 255]), random([0, 255]), random([0, 255]))
    });
  }
}

function draw() {
  background(0);
  
  // Mouse influence
  if (mouseInfluence > 0) {
    mouseInfluence -= 0.02;
  }
  
  // Draw grid
  for (let cell of grid) {
    if (cell.active) {
      fill(0, 255, 255, 100 + glowIntensity * 50);
      rect(cell.x, cell.y, gridSize, gridSize);
      
      // Add pixel clusters
      if (random() > 0.98) {
        fill(255, 0, 255);
        ellipse(cell.x + gridSize/2, cell.y + gridSize/2, random(3, 7));
      }
    }
  }
  
  // Draw sprite clusters
  for (let cluster of spriteClusters) {
    cluster.pulse = (cluster.pulse + 0.05) % TWO_PI;
    let pulseSize = sin(cluster.pulse) * 2 + cluster.size;
    
    fill(cluster.color);
    switch (cluster.type) {
      case 0: // Square
        rect(cluster.x - pulseSize/2, cluster.y - pulseSize/2, pulseSize, pulseSize);
        break;
      case 1: // Triangle
        triangle(
          cluster.x, cluster.y - pulseSize/2,
          cluster.x - pulseSize/2, cluster.y + pulseSize/2,
          cluster.x + pulseSize/2, cluster.y + pulseSize/2
        );
        break;
      case 2: // Line
        line(cluster.x - pulseSize/2, cluster.y, cluster.x + pulseSize/2, cluster.y);
        break;
    }
    
    // Add glow effect
    fill(0, 255, 255, 50);
    ellipse(cluster.x, cluster.y, pulseSize * 2);
  }
  
  // Draw particles
  for (let p of particles) {
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
    }
    
    fill(p.color);
    ellipse(p.x, p.y, p.size);
  }
  
  // Mouse interaction
  if (mouseInfluence > 0) {
    let mouseRadius = map(mouseInfluence, 0, 1, 50, 200);
    for (let cell of grid) {
      let d = dist(mouseX, mouseY, cell.x + gridSize/2, cell.y + gridSize/2);
      if (d < mouseRadius) {
        cell.active = true;
      }
    }
    
    // Create burst effect
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: mouseX,
        y: mouseY,
        size: random(2, 6),
        speed: random(1, 3),
        angle: random(TWO_PI),
        color: color(255, 255, 0)
      });
    }
    
    glowIntensity = min(glowIntensity + 0.05, 1);
  } else {
    glowIntensity = max(glowIntensity - 0.02, 0);
  }
  
  // Random grid activation
  if (random() > 0.99) {
    let idx = int(random(grid.length));
    grid[idx].active = true;
  }
}

function mousePressed() {
  mouseInfluence = 1;
  glowIntensity = 1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
