let particles = [];
let gridSize = 20;
let grid = [];
let plasmaBursts = [];

function setup() {
  createCanvas(400, 400, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize particles
  for (let i = 0; i < 500; i++) {
    particles.push({
      pos: createVector(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(2, 6),
      hue: random(360),
      life: 1,
      decay: random(0.001, 0.005)
    });
  }
  
  // Initialize grid
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(0);
  
  // Update and display particles
  let points = [];
  let lines = [];
  
  // Clear grid
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }
  
  // Update particles and add to grid
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Move particle
    p.pos.add(p.vel);
    
    // Apply some drift
    p.vel.add(p5.Vector.random3D().mult(0.01));
    
    // Wrap around edges
    if (p.pos.x > width/2) p.pos.x = -width/2;
    if (p.pos.x < -width/2) p.pos.x = width/2;
    if (p.pos.y > height/2) p.pos.y = -height/2;
    if (p.pos.y < -height/2) p.pos.y = height/2;
    
    // Update life
    p.life -= p.decay;
    
    // Respawn dead particles
    if (p.life <= 0) {
      p.pos.set(random(-width/2, width/2), random(-height/2, height/2), random(-100, 100));
      p.vel = p5.Vector.random3D().mult(random(0.5, 2));
      p.hue = random(360);
      p.life = 1;
    }
    
    // Add to grid
    let gridX = floor(map(p.pos.x, -width/2, width/2, 0, gridSize));
    let gridY = floor(map(p.pos.y, -height/2, height/2, 0, gridSize));
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      grid[gridX][gridY].push(i);
    }
    
    // Add to points
    points.push(p.pos);
  }
  
  // Draw plasma bursts
  for (let i = plasmaBursts.length - 1; i >= 0; i--) {
    let burst = plasmaBursts[i];
    burst.age++;
    if (burst.age > 50) {
      plasmaBursts.splice(i, 1);
    } else {
      noFill();
      stroke(255, 200, 100, 1 - burst.age / 50);
      ellipse(burst.x, burst.y, burst.size * (1 - burst.age / 50));
    }
  }
  
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    
    // Get grid neighbors
    let gridX = floor(map(p1.pos.x, -width/2, width/2, 0, gridSize));
    let gridY = floor(map(p1.pos.y, -height/2, height/2, 0, gridSize));
    
    for (let x = max(0, gridX - 1); x <= min(gridSize - 1, gridX + 1); x++) {
      for (let y = max(0, gridY - 1); y <= min(gridSize - 1, gridY + 1); y++) {
        let neighbors = grid[x][y];
        for (let j = 0; j < neighbors.length; j++) {
          let idx = neighbors[j];
          if (idx !== i) {
            let p2 = particles[idx];
            let d = p5.Vector.dist(p1.pos, p2.pos);
            if (d < 80) {
              // Draw line with alpha based on distance
              let alpha = map(d, 0, 80, 0.5, 0);
              stroke(p1.hue, 100, 100, alpha);
              line(p1.pos.x, p1.pos.y, p1.pos.z, p2.pos.x, p2.pos.y, p2.pos.z);
            }
          }
        }
      }
    }
  }
  
  // Draw points
  stroke(255, 100, 100);
  beginShape(POINTS);
  for (let i = 0; i < points.length; i++) {
    vertex(points[i].x, points[i].y, points[i].z);
  }
  endShape();
  
  // Occasionally add a plasma burst
  if (frameCount % 100 === 0) {
    plasmaBursts.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      size: random(30, 80),
      age: 0
    });
  }
}
