let particles = [];
let connections = [];
let time = 0;
const particleCount = 1500;
const connectionCount = 300;
const gridSize = 20;
let grid = [];

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(2, 6);
    this.color = color(random(100, 255), random(100, 255), 255, 200);
    this.pulse = 0;
    this.pulseTime = 0;
  }

  update() {
    this.pos.add(this.vel);
    
    // Bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    
    // Update pulse effect
    if (this.pulse > 0) {
      this.pulse -= 0.02;
      this.pulseTime += 0.1;
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    
    // Main particle glow
    fill(this.color);
    ellipse(0, 0, this.size * (1 + this.pulse * 2));
    
    // Pulse effect
    if (this.pulse > 0) {
      const pulseSize = this.size * (1 + this.pulse * 3);
      fill(red(this.color), green(this.color), blue(this.color), 50);
      ellipse(0, 0, pulseSize);
    }
    
    pop();
  }

  // Check if this particle is near another in the grid
  checkConnections(other) {
    const d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d < 150 && connections.length < connectionCount) {
      return d;
    }
    return Infinity;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Initialize grid for spatial hashing
  const gridWidth = ceil(width / gridSize);
  const gridHeight = ceil(height / gridSize);
  grid = new Array(gridWidth * gridHeight).fill().map(() => []);
}

function draw() {
  background(0, 0, 0, 0.1);
  
  time += 0.01;
  
  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].display();
    
    // Periodically trigger pulses
    if (frameCount % 120 === 0 && random() > 0.7) {
      particles[i].pulse = 1;
    }
  }
  
  // Connect nearby particles
  beginShape(LINES);
  stroke(200, 100, 100, 0.3);
  strokeWeight(0.5);
  
  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i];
    
    // Check neighbors in grid
    const gridX = floor(p1.pos.x / gridSize);
    const gridY = floor(p1.pos.y / gridSize);
    
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const checkX = gridX + x;
        const checkY = gridY + y;
        
        if (checkX >= 0 && checkX < width / gridSize &&
            checkY >= 0 && checkY < height / gridSize) {
          
          const index = checkX + checkY * (width / gridSize);
          for (let j = 0; j < grid[index].length; j++) {
            const p2 = grid[index][j];
            if (p1 !== p2) {
              const d = p1.checkConnections(p2);
              if (d < 150 && connections.length < connectionCount) {
                vertex(p1.pos.x, p1.pos.y, 0);
                vertex(p2.pos.x, p2.pos.y, 0);
                connections.push({p1, p2});
              }
            }
          }
        }
      }
    }
    
    // Add to grid
    const index = gridX + gridY * (width / gridSize);
    if (index >= 0 && index < grid.length) {
      grid[index].push(p1);
    }
  }
  
  endShape();
  
  // Clear grid for next frame
  for (let i = 0; i < grid.length; i++) {
    grid[i] = [];
  }
}
