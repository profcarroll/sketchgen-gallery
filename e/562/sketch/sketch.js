let particles = [];
let grid = [];
const GRID_SIZE = 20;
const PARTICLE_COUNT = 500;
const CONNECTION_DISTANCE = 100;
const TIME_SPEED = 0.01;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      pos: createVector(random(width), random(height), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      color: color(random(360), 80, 90, 0.8),
      size: random(2, 6)
    });
  }
  
  // Initialize grid
  for (let i = 0; i < GRID_SIZE; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(0, 0, 0, 0.1);
  
  // Update and display particles
  let allLines = [];
  let allPoints = [];
  
  // Clear grid
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = [];
    }
  }
  
  // Update particles and place in grid
  for (let p of particles) {
    // Update position with velocity
    p.pos.add(p.vel);
    
    // Boundary check
    if (p.pos.x < -width/2 || p.pos.x > width/2) p.vel.x *= -1;
    if (p.pos.y < -height/2 || p.pos.y > height/2) p.vel.y *= -1;
    if (p.pos.z < -100 || p.pos.z > 100) p.vel.z *= -1;
    
    // Grid placement
    let gridX = floor(map(p.pos.x, -width/2, width/2, 0, GRID_SIZE));
    let gridY = floor(map(p.pos.y, -height/2, height/2, 0, GRID_SIZE));
    gridX = constrain(gridX, 0, GRID_SIZE - 1);
    gridY = constrain(gridY, 0, GRID_SIZE - 1);
    
    grid[gridX][gridY].push(p);
    
    // Add to points
    allPoints.push({
      pos: p.pos,
      color: p.color,
      size: p.size
    });
  }
  
  // Connect particles within distance
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j].length === 0) continue;
      
      let neighbors = [];
      
      // Check neighboring cells
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          let ni = i + di;
          let nj = j + dj;
          
          if (ni >= 0 && ni < GRID_SIZE && nj >= 0 && nj < GRID_SIZE) {
            neighbors = neighbors.concat(grid[ni][nj]);
          }
        }
      }
      
      // Connect particles within range
      for (let p of grid[i][j]) {
        for (let other of neighbors) {
          if (p === other) continue;
          
          let d = dist(p.pos.x, p.pos.y, p.pos.z, other.pos.x, other.pos.y, other.pos.z);
          if (d < CONNECTION_DISTANCE) {
            allLines.push({
              a: p.pos,
              b: other.pos
            });
          }
        }
      }
    }
  }
  
  // Draw points and lines in batches
  push();
  strokeWeight(1);
  
  beginShape(POINTS);
  for (let point of allPoints) {
    fill(point.color);
    noStroke();
    vertex(point.pos.x, point.pos.y, point.pos.z);
  }
  endShape();
  
  stroke(255, 80);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let line of allLines) {
    vertex(line.a.x, line.a.y, line.a.z);
    vertex(line.b.x, line.b.y, line.b.z);
  }
  endShape();
  
  pop();
}
