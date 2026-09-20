let particles = [];
let grid;
let gridSize = 20;
let maxParticles = 1000;
let structureFormed = false;
let time = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize particles
  for (let i = 0; i < maxParticles; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      size: random(2, 6),
      hue: random(360),
      alpha: random(0.5, 1),
      target: null,
      attracted: false
    });
  }
  
  // Initialize grid for spatial hashing
  grid = new Array(width / gridSize).fill().map(() => 
    new Array(height / gridSize).fill().map(() => [])
  );
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time++;
  
  if (time > 300 && !structureFormed) {
    structureFormed = true;
  }
  
  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    if (!structureFormed) {
      // Random motion before organization
      p.vel.add(p5.Vector.random2D().mult(0.1));
      p.vel.limit(3);
      p.pos.add(p.vel);
      
      // Boundary check
      if (p.pos.x < 0 || p.pos.x > width) p.vel.x *= -1;
      if (p.pos.y < 0 || p.pos.y > height) p.vel.y *= -1;
      
      // Apply some attraction to center
      let center = createVector(width/2, height/2);
      let dir = p5.Vector.sub(center, p.pos);
      dir.normalize();
      dir.mult(0.01);
      p.vel.add(dir);
    } else {
      // Organized motion into lattice
      if (!p.attracted) {
        // Find closest particle in grid
        let cellX = floor(p.pos.x / gridSize);
        let cellY = floor(p.pos.y / gridSize);
        
        let minDist = Infinity;
        let closest = null;
        
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            let nx = cellX + i;
            let ny = cellY + j;
            
            if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
              for (let other of grid[nx][ny]) {
                if (other !== p) {
                  let d = p.pos.dist(other.pos);
                  if (d < minDist) {
                    minDist = d;
                    closest = other;
                  }
                }
              }
            }
          }
        }
        
        if (closest && minDist < 100) {
          p.target = closest;
          p.attracted = true;
        }
      }
      
      // Move towards target
      if (p.target) {
        let dir = p5.Vector.sub(p.target.pos, p.pos);
        dir.normalize();
        dir.mult(0.05);
        p.vel.add(dir);
        p.vel.limit(2);
      }
      
      p.pos.add(p.vel);
    }
    
    // Update grid
    let cellX = floor(p.pos.x / gridSize);
    let cellY = floor(p.pos.y / gridSize);
    
    if (cellX >= 0 && cellX < grid.length && cellY >= 0 && cellY < grid[0].length) {
      grid[cellX][cellY].push(p);
    }
    
    // Draw particle
    push();
    translate(p.pos.x - width/2, p.pos.y - height/2);
    rotate(time * 0.01);
    fill(p.hue, 80, 90, p.alpha);
    
    if (structureFormed) {
      sphere(p.size * 2);
    } else {
      ellipse(0, 0, p.size, p.size);
    }
    pop();
  }
  
  // Draw lattice lines
  if (structureFormed) {
    stroke(180, 50, 90, 0.7);
    noFill();
    
    beginShape(LINES);
    for (let x = 0; x < width; x += 30) {
      vertex(x - width/2, -height/2, 0);
      vertex(x - width/2, height/2, 0);
      
      vertex(-width/2, x - height/2, 0);
      vertex(width/2, x - height/2, 0);
    }
    endShape();
    
    // Draw glow effect
    blendMode(ADD);
    fill(180, 50, 90, 0.05);
    sphere(300);
    blendMode(BLEND);
  }
  
  // Clear grid for next frame
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = [];
    }
  }
}
