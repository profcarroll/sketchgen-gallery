let particles = [];
let grid = [];
const GRID_SIZE = 20;
const PARTICLE_COUNT = 500;
const STREAK_LENGTH = 10;
const MAX_CONNECTIONS = 300;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      hue: random(360),
      sat: random(70, 100),
      bri: random(80, 100),
      size: random(1, 3),
      trail: []
    });
  }
  
  // Initialize grid
  for (let i = 0; i < width / GRID_SIZE + 1; i++) {
    grid[i] = [];
    for (let j = 0; j < height / GRID_SIZE + 1; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.pos.add(p.vel);
    
    // Wrap around edges
    if (p.pos.x > width) p.pos.x = 0;
    if (p.pos.x < 0) p.pos.x = width;
    if (p.pos.y > height) p.pos.y = 0;
    if (p.pos.y < 0) p.pos.y = height;
    
    // Add to trail
    p.trail.push(p.pos.copy());
    if (p.trail.length > STREAK_LENGTH) {
      p.trail.shift();
    }
    
    // Draw trail
    noFill();
    stroke(p.hue, p.sat, p.bri, 0.7);
    beginShape();
    for (let j = 0; j < p.trail.length; j++) {
      let alpha = map(j, 0, p.trail.length - 1, 0, 1);
      stroke(p.hue, p.sat, p.bri, alpha * 0.7);
      vertex(p.trail[j].x, p.trail[j].y);
    }
    endShape();
    
    // Draw particle
    fill(p.hue, p.sat, p.bri);
    noStroke();
    ellipse(p.pos.x, p.pos.y, p.size);
    
    // Update grid
    let gridX = floor(p.pos.x / GRID_SIZE);
    let gridY = floor(p.pos.y / GRID_SIZE);
    if (gridX >= 0 && gridX < grid.length && gridY >= 0 && gridY < grid[0].length) {
      grid[gridX][gridY].push(p);
    }
  }
  
  // Connect nearby particles
  let connections = 0;
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    
    // Check nearby grid cells
    let gridX = floor(p1.pos.x / GRID_SIZE);
    let gridY = floor(p1.pos.y / GRID_SIZE);
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        let nx = gridX + dx;
        let ny = gridY + dy;
        
        if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
          for (let j = 0; j < grid[nx][ny].length; j++) {
            let p2 = grid[nx][ny][j];
            
            if (p1 !== p2 && connections < MAX_CONNECTIONS) {
              let d = p5.Vector.dist(p1.pos, p2.pos);
              if (d < 100) {
                stroke(200, 80, 90, map(d, 0, 100, 0.8, 0));
                line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
                connections++;
              }
            }
          }
        }
      }
    }
  }
  
  // Clear grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      grid[i][j] = [];
    }
  }
}
