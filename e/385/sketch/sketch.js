let particles = [];
let gridSize = 20;
let grid = [];
let time = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  noStroke();
  
  // Initialize grid
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }
  
  // Create particles
  for (let i = 0; i < 500; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-100, 100);
    particles.push(createVector(x, y, z));
  }
}

function draw() {
  background(0);
  ambientLight(30);
  pointLight(255, 255, 255, 0, 0, 0);
  
  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Subtle wave motion
    let offset = sin(time + i * 0.02) * 5;
    p.y += sin(time + i * 0.01) * 0.5;
    p.x += cos(time + i * 0.01) * 0.3;
    
    // Keep particles within bounds
    if (p.x > width/2) p.x = -width/2;
    if (p.x < -width/2) p.x = width/2;
    if (p.y > height/2) p.y = -height/2;
    if (p.y < -height/2) p.y = height/2;
    
    // Update grid
    let gridX = floor(map(p.x, -width/2, width/2, 0, gridSize));
    let gridY = floor(map(p.y, -height/2, height/2, 0, gridSize));
    if (gridX >= 0 && gridX < gridSize && gridY >= 0 && gridY < gridSize) {
      grid[gridX][gridY].push(p);
    }
    
    // Draw particle
    push();
    translate(p.x, p.y, p.z);
    fill(0, 255, 100, 180);
    sphere(2);
    pop();
  }
  
  // Draw energy seams
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j].length > 0) {
        let x = map(i, 0, gridSize-1, -width/2, width/2);
        let y = map(j, 0, gridSize-1, -height/2, height/2);
        
        // Pulse effect
        let pulse = sin(time + i * 0.1 + j * 0.1) * 0.5 + 0.5;
        let size = 10 + pulse * 30;
        
        push();
        translate(x, y, 0);
        fill(0, 255, 100, 100);
        sphere(size);
        pop();
      }
    }
  }
  
  // Clear grid for next frame
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }
}
