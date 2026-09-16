let particles = [];
let gridSize = 20;
let grid = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize grid
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }
  
  // Create particles
  for (let i = 0; i < 1500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      hue: random(360),
      size: random(2, 8),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      targetX: random(width),
      targetY: random(height),
      stuck: false,
      trail: []
    });
  }
}

function draw() {
  background(0, 0, 10);
  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Apply flow field
    let force = getFlowField(p.x, p.y);
    p.angle += force * 0.05;
    
    // Move particle
    if (!p.stuck) {
      p.x += cos(p.angle) * p.speed;
      p.y += sin(p.angle) * p.speed;
      
      // Add to trail
      p.trail.push({x: p.x, y: p.y});
      if (p.trail.length > 10) {
        p.trail.shift();
      }
    }
    
    // Grid interaction - create pockets of stagnation
    let gridX = floor(p.x / (width / gridSize));
    let gridY = floor(p.y / (height / gridSize));
    
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      let cell = grid[gridX][gridY];
      
      // Create resistance pockets
      if (frameCount % 60 === 0 && random() < 0.1) {
        p.stuck = true;
        setTimeout(() => { p.stuck = false; }, 2000);
        
        // Add crystalline lattice formation
        for (let j = 0; j < 50; j++) {
          let angle = random(TWO_PI);
          let dist = random(10, 30);
          let x = p.x + cos(angle) * dist;
          let y = p.y + sin(angle) * dist;
          
          // Draw crystalline structure
          stroke(p.hue, 80, 90, 0.7);
          noFill();
          push();
          translate(x, y);
          rotate(time + j * 0.2);
          rect(0, 0, 5, 5);
          pop();
        }
      }
      
      // Add to grid
      cell.push(p);
    }
    
    // Draw particle trail
    if (p.trail.length > 1) {
      noFill();
      stroke(p.hue, 70, 80, 0.3);
      strokeWeight(1);
      beginShape();
      for (let j = 0; j < p.trail.length; j++) {
        vertex(p.trail[j].x, p.trail[j].y);
      }
      endShape();
    }
    
    // Draw particle
    if (!p.stuck) {
      fill(p.hue, 80, 90, 0.8);
      noStroke();
      ellipse(p.x, p.y, p.size);
    }
  }
  
  // Clear grid for next frame
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }
}

function getFlowField(x, y) {
  let n = noise(x * 0.01, y * 0.01, time);
  return map(n, 0, 1, -0.5, 0.5);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
