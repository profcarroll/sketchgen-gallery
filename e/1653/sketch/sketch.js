let grid = [];
let particles = [];
let bursts = [];
let gridSize = 15;
let hueOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize grid
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      grid.push({x, y, active: random() > 0.7});
    }
  }
  
  // Initialize particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 2),
      speed: random(0.3, 1),
      angle: random(TWO_PI),
      color: color(random([0, 255]), random([0, 255]), random([0, 255]))
    });
  }
}

function draw() {
  background(0);
  
  // Update hue offset for rainbow cycling
  hueOffset = (hueOffset + 0.5) % 360;
  
  // Draw grid
  for (let cell of grid) {
    if (cell.active) {
      // Use dynamic hue for neon glow effect
      let hue = (hueOffset + frameCount * 2) % 360;
      fill(hue, 255, 255, 100);
      rect(cell.x, cell.y, gridSize, gridSize);
      
      // Add pixel clusters with vibrant neon colors
      if (random() > 0.98) {
        let clusterHue = (hueOffset + frameCount * 3 + random(360)) % 360;
        fill(clusterHue, 255, 255);
        ellipse(cell.x + gridSize/2, cell.y + gridSize/2, random(3, 7));
      }
    }
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
  
  // Draw bursts
  for (let i = bursts.length - 1; i >= 0; i--) {
    let burst = bursts[i];
    burst.radius += burst.speed;
    burst.alpha -= 2;
    
    if (burst.alpha <= 0) {
      bursts.splice(i, 1);
      continue;
    }
    
    // Draw hexagonal modules with vibrant neon colors
    let burstHue = (hueOffset + frameCount * 4 + random(360)) % 360;
    fill(burstHue, 255, 255, burst.alpha);
    push();
    translate(burst.x, burst.y);
    
    for (let j = 0; j < 6; j++) {
      let angle = TWO_PI * j / 6;
      let x1 = cos(angle) * burst.radius;
      let y1 = sin(angle) * burst.radius;
      let x2 = cos(angle + TWO_PI/6) * burst.radius;
      let y2 = sin(angle + TWO_PI/6) * burst.radius;
      
      triangle(0, 0, x1, y1, x2, y2);
    }
    
    pop();
  }
  
  // Random grid activation
  if (random() > 0.99) {
    let idx = int(random(grid.length));
    grid[idx].active = true;
  }
}

function mousePressed() {
  // Create burst effect at mouse position
  bursts.push({
    x: mouseX,
    y: mouseY,
    radius: 0,
    speed: random(2, 4),
    alpha: 255
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
