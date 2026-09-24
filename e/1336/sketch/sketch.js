let particles = [];
let grid;
let gridSize = 50;
let maxParticles = 1500;
let connectionCount = 0;
let maxConnectionsPerFrame = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  
  for (let i = 0; i < maxParticles; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(random(-0.5, 0.5), random(-0.5, 0.5)),
      hue: (i * 360 / maxParticles + frameCount * 0.5) % 360,
      size: random(2, 6)
    });
  }
  
  grid = new Array(ceil(width / gridSize));
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(ceil(height / gridSize));
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(0, 5, 5);
  
  // Update particles
  for (let p of particles) {
    p.pos.add(p.vel);
    p.hue = (p.hue + 0.1) % 360;
    
    // Bounce at edges with some randomness
    if (p.pos.x < 0 || p.pos.x > width) {
      p.vel.x *= -0.5 + random(-0.2, 0.2);
    }
    if (p.pos.y < 0 || p.pos.y > height) {
      p.vel.y *= -0.5 + random(-0.2, 0.2);
    }
    
    p.pos.x = constrain(p.pos.x, 0, width);
    p.pos.y = constrain(p.pos.y, 0, height);
  }
  
  // Clear and rebuild grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = [];
    }
  }
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let gx = floor(p.pos.x / gridSize);
    let gy = floor(p.pos.y / gridSize);
    if (gx >= 0 && gx < grid.length && gy >= 0 && gy < grid[0].length) {
      grid[gx][gy].push(i);
    }
  }
  
  // Draw connections
  let drawn = 0;
  stroke(255, 80, 100, 60);
  strokeWeight(1);
  
  for (let i = 0; i < particles.length && drawn < maxConnectionsPerFrame; i++) {
    let p1 = particles[i];
    let gx = floor(p1.pos.x / gridSize);
    let gy = floor(p1.pos.y / gridSize);
    
    for (let dx = -1; dx <= 1 && drawn < maxConnectionsPerFrame; dx++) {
      for (let dy = -1; dy <= 1 && drawn < maxConnectionsPerFrame; dy++) {
        let nx = gx + dx;
        let ny = gy + dy;
        if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
          for (let j of grid[nx][ny]) {
            if (i !== j && drawn < maxConnectionsPerFrame) {
              let p2 = particles[j];
              let d = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
              if (d < 80) {
                line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
                drawn++;
              }
            }
          }
        }
      }
    }
  }
  
  // Draw particles
  for (let p of particles) {
    fill(p.hue, 80, 100, 80);
    noStroke();
    ellipse(p.pos.x, p.pos.y, p.size);
  }
}

function mousePressed() {
  // Glitch effect: push particles outward
  for (let p of particles) {
    let dir = p5.Vector.sub(p.pos, createVector(mouseX, mouseY));
    dir.setMag(random(2, 5));
    p.vel.add(dir.mult(0.1));
  }
  
  // Brief burst of color
  for (let i = 0; i < particles.length; i++) {
    particles[i].hue = (particles[i].hue + 180) % 360;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
