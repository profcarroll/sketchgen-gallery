let particles = [];
let grid = [];
let time = 0;
let particleCount = 1500;
let gridResolution = 20;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pos: createVector(
        random(-width/2, width/2),
        random(-height/2, height/2),
        random(-500, 500)
      ),
      vel: p5.Vector.random3D().mult(random(0.5, 2)),
      size: random(1, 5),
      hue: random(360),
      pulse: random(TWO_PI)
    });
  }
  
  // Initialize grid
  let gridSize = ceil(width / gridResolution);
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  time += 0.02;
  
  // Camera movement
  let camX = sin(time * 0.3) * 100;
  let camY = cos(time * 0.2) * 50;
  let camZ = -200 + sin(time * 0.1) * 100;
  
  // Camera positioning
  camera(
    camX, camY, camZ,
    camX, camY, 0,
    0, 1, 0
  );
  
  // Draw pulsing bioluminescent base
  drawBase();
  
  // Update and draw particles
  updateAndDrawParticles();
}

function drawBase() {
  noStroke();
  for (let i = 0; i < 50; i++) {
    let angle = time * 0.1 + i * 0.2;
    let radius = 300 + sin(time + i) * 50;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let z = sin(time * 0.5 + i) * 100;
    
    fill((time * 20 + i * 10) % 360, 80, 60, 0.1);
    sphere(10 + sin(time + i) * 5);
  }
}

function updateAndDrawParticles() {
  // Clear grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = [];
    }
  }
  
  beginShape(POINTS);
  
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update position
    p.pos.add(p.vel);
    
    // Apply acceleration towards center
    let center = createVector(0, 0, 0);
    let dir = p5.Vector.sub(center, p.pos);
    dir.normalize();
    dir.mult(0.01);
    p.vel.add(dir);
    
    // Wrap around edges
    if (p.pos.x > width/2) p.pos.x = -width/2;
    if (p.pos.x < -width/2) p.pos.x = width/2;
    if (p.pos.y > height/2) p.pos.y = -height/2;
    if (p.pos.y < -height/2) p.pos.y = height/2;
    
    // Update pulse
    p.pulse += 0.1;
    
    // Grid positioning
    let gridX = floor((p.pos.x + width/2) / gridResolution);
    let gridY = floor((p.pos.y + height/2) / gridResolution);
    
    if (gridX >= 0 && gridX < grid.length && 
        gridY >= 0 && gridY < grid[0].length) {
      grid[gridX][gridY].push(i);
    }
    
    // Draw particle
    let brightness = 50 + sin(p.pulse) * 30;
    let saturation = 80 + sin(p.pulse * 1.5) * 20;
    fill(p.hue, saturation, brightness, 0.8);
    
    vertex(p.pos.x, p.pos.y, p.pos.z);
  }
  
  endShape();
  
  // Draw connections between nearby particles
  beginShape(LINES);
  
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    
    // Check neighboring grid cells
    let gridX = floor((p1.pos.x + width/2) / gridResolution);
    let gridY = floor((p1.pos.y + height/2) / gridResolution);
    
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        let checkX = gridX + dx;
        let checkY = gridY + dy;
        
        if (checkX >= 0 && checkX < grid.length && 
            checkY >= 0 && checkY < grid[0].length) {
          
          for (let j = 0; j < grid[checkX][checkY].length; j++) {
            let otherIndex = grid[checkX][checkY][j];
            if (otherIndex !== i) {
              let p2 = particles[otherIndex];
              
              // Calculate distance
              let d = dist(p1.pos.x, p1.pos.y, p1.pos.z,
                          p2.pos.x, p2.pos.y, p2.pos.z);
              
              if (d < 100 && d > 0) {
                let alpha = map(d, 0, 100, 0.8, 0);
                
                // Draw connection with diffraction effect
                stroke(
                  (time * 30 + i * 20 + otherIndex * 15) % 360,
                  80, 
                  70,
                  alpha * 0.3
                );
                
                vertex(p1.pos.x, p1.pos.y, p1.pos.z);
                vertex(p2.pos.x, p2.pos.y, p2.pos.z);
              }
            }
          }
        }
      }
    }
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
