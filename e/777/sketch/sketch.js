let particles = [];
let connections = [];
let grid = [];
const GRID_SIZE = 20;
const PARTICLE_COUNT = 300;
const MAX_CONNECTIONS = 500;
const CONNECTION_DISTANCE = 150;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      pos: createVector(random(width), random(height), random(-100, 100)),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(2, 6),
      hue: random(360),
      alpha: random(0.5, 1),
      life: 1,
      decay: random(0.001, 0.005)
    });
  }

  // Initialize grid
  for (let x = 0; x < width; x += GRID_SIZE) {
    grid[x] = [];
    for (let y = 0; y < height; y += GRID_SIZE) {
      grid[x][y] = [];
    }
  }
}

function draw() {
  background(0, 0, 10);

  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.pos.add(p.vel);
    
    // Boundary check
    if (p.pos.x < 0 || p.pos.x > width) p.vel.x *= -1;
    if (p.pos.y < 0 || p.pos.y > height) p.vel.y *= -1;
    if (p.pos.z < -100 || p.pos.z > 100) p.vel.z *= -1;

    // Decay life
    p.life -= p.decay;
    
    // Reset dead particles
    if (p.life <= 0) {
      p.pos = createVector(random(width), random(height), random(-100, 100));
      p.vel = p5.Vector.random3D().mult(random(0.5, 2));
      p.hue = random(360);
      p.life = 1;
    }
    
    // Draw particle
    push();
    translate(p.pos.x - width/2, p.pos.y - height/2, p.pos.z);
    noStroke();
    fill(p.hue, 80, 90, p.alpha * p.life);
    sphere(p.size);
    pop();
  }

  // Build grid connections
  connections = [];
  for (let x = 0; x < width; x += GRID_SIZE) {
    for (let y = 0; y < height; y += GRID_SIZE) {
      grid[x][y] = [];
    }
  }

  // Assign particles to grid cells
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let gx = floor(p.pos.x / GRID_SIZE) * GRID_SIZE;
    let gy = floor(p.pos.y / GRID_SIZE) * GRID_SIZE;
    
    if (gx >= 0 && gx < width && gy >= 0 && gy < height) {
      grid[gx][gy].push(i);
    }
  }

  // Connect particles in grid cells and nearby cells
  beginShape(LINES);
  for (let x = 0; x < width; x += GRID_SIZE) {
    for (let y = 0; y < height; y += GRID_SIZE) {
      let cellParticles = grid[x][y];
      
      // Connect particles within same cell and nearby cells
      for (let i = 0; i < cellParticles.length; i++) {
        let p1 = particles[cellParticles[i]];
        
        for (let j = i + 1; j < cellParticles.length; j++) {
          let p2 = particles[cellParticles[j]];
          
          let d = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
          if (d < CONNECTION_DISTANCE) {
            stroke(hue(p1.hue), 80, 90, map(d, 0, CONNECTION_DISTANCE, 0.8, 0));
            vertex(p1.pos.x - width/2, p1.pos.y - height/2, p1.pos.z);
            vertex(p2.pos.x - width/2, p2.pos.y - height/2, p2.pos.z);
          }
        }
        
        // Check neighboring cells
        for (let dx = -GRID_SIZE; dx <= GRID_SIZE; dx += GRID_SIZE) {
          for (let dy = -GRID_SIZE; dy <= GRID_SIZE; dy += GRID_SIZE) {
            let nx = x + dx;
            let ny = y + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              let neighborParticles = grid[nx][ny];
              
              for (let k = 0; k < neighborParticles.length; k++) {
                let p2 = particles[neighborParticles[k]];
                
                let d = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
                if (d < CONNECTION_DISTANCE) {
                  stroke(hue(p1.hue), 80, 90, map(d, 0, CONNECTION_DISTANCE, 0.8, 0));
                  vertex(p1.pos.x - width/2, p1.pos.y - height/2, p1.pos.z);
                  vertex(p2.pos.x - width/2, p2.pos.y - height/2, p2.pos.z);
                }
              }
            }
          }
        }
      }
    }
  }
  endShape();
}
