let particles = [];
let trails = [];
let grid = [];
let gridSize = 20;
let maxParticles = 5000;
let particleCount = 0;
let lastX, lastY;
let speedThreshold = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  background(0);
  lastX = mouseX;
  lastY = mouseY;
  for (let i = 0; i < maxParticles; i++) {
    particles.push({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      age: 0,
      size: random(1, 3),
      hue: random(360),
      sat: random(80, 100),
      bri: random(70, 100),
      alpha: random(0.5, 1)
    });
  }
  for (let i = 0; i < width / gridSize + 1; i++) {
    grid[i] = [];
    for (let j = 0; j < height / gridSize + 1; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  // Clear with slight fade effect
  fill(0, 0, 0, 0.05);
  noStroke();
  rect(0, 0, width, height);

  let dx = mouseX - lastX;
  let dy = mouseY - lastY;
  let speed = sqrt(dx * dx + dy * dy);
  
  // Add new particles
  if (speed > 0.1) {
    let step = max(1, int(speed / 2));
    for (let i = 0; i < step; i++) {
      let t = i / step;
      let x = lerp(lastX, mouseX, t);
      let y = lerp(lastY, mouseY, t);
      
      if (particleCount < maxParticles) {
        let p = particles[particleCount];
        p.x = x;
        p.y = y;
        p.vx = dx * 0.1;
        p.vy = dy * 0.1;
        p.age = 0;
        particleCount++;
      }
    }
  }

  // Update and draw particles
  let totalParticles = min(particleCount, maxParticles);
  
  for (let i = 0; i < totalParticles; i++) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.age++;
    
    // Apply some friction
    p.vx *= 0.95;
    p.vy *= 0.95;
    
    // Draw particle with shimmer effect when moving fast
    if (speed > speedThreshold) {
      let shimmer = sin(frameCount * 0.1 + p.age * 0.1) * 20;
      fill(p.hue, p.sat, p.bri, p.alpha);
      noStroke();
      ellipse(p.x, p.y, p.size + shimmer, p.size + shimmer);
    } else {
      fill(p.hue, p.sat, p.bri, p.alpha);
      noStroke();
      ellipse(p.x, p.y, p.size, p.size);
    }
  }

  // Update grid
  for (let i = 0; i < width / gridSize + 1; i++) {
    for (let j = 0; j < height / gridSize + 1; j++) {
      grid[i][j] = [];
    }
  }

  for (let i = 0; i < totalParticles; i++) {
    let p = particles[i];
    let gridX = floor(p.x / gridSize);
    let gridY = floor(p.y / gridSize);
    
    if (gridX >= 0 && gridX < width / gridSize && 
        gridY >= 0 && gridY < height / gridSize) {
      grid[gridX][gridY].push(i);
    }
  }

  // Draw connections between nearby particles
  stroke(200, 50, 80, 0.1);
  noFill();
  beginShape(LINES);
  
  let connectionCount = 0;
  for (let i = 0; i < totalParticles; i++) {
    if (connectionCount > 500) break;
    
    let p1 = particles[i];
    let gridX = floor(p1.x / gridSize);
    let gridY = floor(p1.y / gridSize);
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (connectionCount > 500) break;
        
        let nx = gridX + dx;
        let ny = gridY + dy;
        
        if (nx >= 0 && nx < width / gridSize && 
            ny >= 0 && ny < height / gridSize) {
          for (let j = 0; j < grid[nx][ny].length; j++) {
            if (connectionCount > 500) break;
            
            let idx = grid[nx][ny][j];
            if (idx !== i) {
              let p2 = particles[idx];
              let d = dist(p1.x, p1.y, p2.x, p2.y);
              
              if (d < 40) {
                vertex(p1.x, p1.y);
                vertex(p2.x, p2.y);
                connectionCount++;
              }
            }
          }
        }
      }
    }
  }
  
  endShape();
  
  lastX = mouseX;
  lastY = mouseY;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
