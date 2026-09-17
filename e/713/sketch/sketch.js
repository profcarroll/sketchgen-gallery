let particles = [];
let trails = [];
let grid = [];
const GRID_SIZE = 20;
const PARTICLE_COUNT = 300;
const TRAIL_LIFETIME = 120;
const FORCE_RADIUS = 60;
const FORCE_STRENGTH = 0.3;

function setup() {
  createCanvas(400, 400);
  noStroke();
  
  // Initialize grid
  for (let x = 0; x < width; x += GRID_SIZE) {
    grid[x] = [];
    for (let y = 0; y < height; y += GRID_SIZE) {
      grid[x][y] = [];
    }
  }
  
  // Create particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      vx: random(-1, 1),
      vy: random(-1, 1),
      color: color(random(100, 255), random(100, 255), random(100, 255)),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(10);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply random motion
    p.vx += random(-0.2, 0.2);
    p.vy += random(-0.2, 0.2);
    
    // Limit velocity
    let speed = dist(0, 0, p.vx, p.vy);
    if (speed > 3) {
      p.vx = (p.vx / speed) * 3;
      p.vy = (p.vy / speed) * 3;
    }
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Bounce off edges
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    
    // Keep within bounds
    p.x = constrain(p.x, 0, width);
    p.y = constrain(p.y, 0, height);
    
    // Add to grid
    let gridX = floor(p.x / GRID_SIZE) * GRID_SIZE;
    let gridY = floor(p.y / GRID_SIZE) * GRID_SIZE;
    if (grid[gridX] && grid[gridX][gridY]) {
      grid[gridX][gridY].push(i);
    }
    
    // Draw particle
    fill(p.color);
    ellipse(p.x, p.y, p.size);
  }
  
  // Check for trail formation
  if (frameCount % 60 === 0 && random() < 0.3) {
    let startX = random(width);
    let startY = random(height);
    trails.push({
      x: startX,
      y: startY,
      points: [],
      lifetime: TRAIL_LIFETIME,
      angle: random(TWO_PI)
    });
  }
  
  // Update and display trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let trail = trails[i];
    
    // Apply force to nearby particles
    for (let j = 0; j < particles.length; j++) {
      let p = particles[j];
      let d = dist(trail.x, trail.y, p.x, p.y);
      
      if (d < FORCE_RADIUS) {
        let angle = atan2(p.y - trail.y, p.x - trail.x);
        let force = map(d, 0, FORCE_RADIUS, FORCE_STRENGTH, 0);
        
        p.vx += cos(angle) * force;
        p.vy += sin(angle) * force;
      }
    }
    
    // Add current position to trail
    trail.points.push({x: trail.x, y: trail.y});
    
    // Move trail forward
    trail.x += cos(trail.angle) * 2;
    trail.y += sin(trail.angle) * 2;
    
    // Remove trail if it's out of bounds or expired
    if (trail.lifetime <= 0 || 
        trail.x < 0 || trail.x > width ||
        trail.y < 0 || trail.y > height) {
      trails.splice(i, 1);
      continue;
    }
    
    trail.lifetime--;
    
    // Draw trail
    stroke(255, 100);
    noFill();
    beginShape();
    for (let point of trail.points) {
      vertex(point.x, point.y);
    }
    endShape();
  }
  
  // Clear grid
  for (let x in grid) {
    for (let y in grid[x]) {
      grid[x][y] = [];
    }
  }
}
