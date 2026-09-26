let particles = [];
let noiseScale = 0.002;
let noiseStrength = 0.1;
let grid = [];
let gridSize = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Preallocate particles
  for (let i = 0; i < 1500; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: createVector(0, 0),
      size: random(1, 3),
      hue: random(180, 240),
      alpha: random(0.05, 0.2),
      age: random(100),
      life: random(100, 300),
      formed: false,
      formationTime: 0,
      glow: 0
    });
  }
  
  // Initialize grid
  let cols = ceil(width / gridSize);
  let rows = ceil(height / gridSize);
  grid = new Array(cols * rows).fill().map(() => []);
}

function draw() {
  // Semi-transparent background for trail effect
  background(0, 0, 0, 0.05);
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Noise-based movement
    let nx = noise(p.pos.x * noiseScale, p.pos.y * noiseScale) - 0.5;
    let ny = noise(p.pos.x * noiseScale + 1000, p.pos.y * noiseScale + 1000) - 0.5;
    
    p.vel.x += nx * noiseStrength;
    p.vel.y += ny * noiseStrength;
    
    // Apply velocity
    p.pos.add(p.vel);
    
    // Add some damping
    p.vel.mult(0.95);
    
    // Boundary check and reset
    if (p.pos.x < 0 || p.pos.x > width ||
        p.pos.y < 0 || p.pos.y > height) {
      p.pos.set(random(width), random(height));
      p.vel.set(0, 0);
    }
    
    // Age the particle
    p.age++;
    if (p.age > p.life) {
      p.age = 0;
      p.pos.set(random(width), random(height));
      p.life = random(100, 300);
      p.formed = false;
      p.glow = 0;
    }
    
    // Update grid
    let col = floor(p.pos.x / gridSize);
    let row = floor(p.pos.y / gridSize);
    if (col >= 0 && col < grid.length && row >= 0 && row < grid[0].length) {
      grid[col][row] = p;
    }
    
    // Draw particle
    noStroke();
    if (p.formed) {
      // Glow effect for formed particles
      p.glow += 0.01;
      let glowIntensity = sin(p.glow) * 0.5 + 0.5;
      fill(p.hue, 50, 90, p.alpha * glowIntensity);
      ellipse(p.pos.x, p.pos.y, p.size * 2);
    } else {
      fill(p.hue, 50, 90, p.alpha);
      ellipse(p.pos.x, p.pos.y, p.size);
    }
  }
  
  // Check for word formation using grid-based spatial hash
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    if (!p.formed && p.age > 50) {
      let nearby = 0;
      let col = floor(p.pos.x / gridSize);
      let row = floor(p.pos.y / gridSize);
      
      // Check neighbors in the grid
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          let nx = col + dx;
          let ny = row + dy;
          
          if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
            let cell = grid[nx][ny];
            if (cell && cell !== p) {
              let d = dist(p.pos.x, p.pos.y, cell.pos.x, cell.pos.y);
              if (d < 30 && cell.formed) {
                nearby++;
              }
            }
          }
        }
      }
      
      // If enough nearby particles are formed, start forming a word
      if (nearby > 5 && random() < 0.001) {
        p.formed = true;
        p.formationTime = frameCount;
        p.glow = 0;
      }
    }
    
    // Fade out words over time
    if (p.formed) {
      let age = frameCount - p.formationTime;
      if (age > 300) {
        p.formed = false;
        p.glow = 0;
        p.pos.set(random(width), random(height));
        p.age = 0;
        p.life = random(100, 300);
      }
    }
  }
  
  // Occasionally form new words
  if (frameCount % 30 === 0) {
    let formedCount = particles.filter(p => p.formed).length;
    if (formedCount < 100) {
      for (let i = 0; i < 5; i++) {
        let p = particles[int(random(particles.length))];
        if (!p.formed && random() < 0.3) {
          p.formed = true;
          p.formationTime = frameCount;
          p.glow = 0;
        }
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  // Reinitialize grid with new dimensions
  let cols = ceil(width / gridSize);
  let rows = ceil(height / gridSize);
  grid = new Array(cols * rows).fill().map(() => []);
}
