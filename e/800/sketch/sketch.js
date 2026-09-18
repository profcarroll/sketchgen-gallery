let particles = [];
const particleCount = 2000;
const gridSize = 50;
let grid = [];

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.acc = createVector(0, 0);
    this.size = random(1, 3);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 180);
    this.trail = [];
    this.maxTrailLength = 20;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Keep particles within canvas
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;

    // Update trail
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  display() {
    // Draw trail
    noFill();
    stroke(this.color);
    strokeWeight(this.size);
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();

    // Draw particle head
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size * 2);
  }

  attract(other) {
    const force = p5.Vector.sub(this.pos, other.pos);
    const distance = force.mag();
    
    if (distance > 0 && distance < 50) {
      const strength = (50 - distance) / 100;
      force.normalize();
      force.mult(strength);
      other.applyForce(force);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Initialize grid
  grid = new Array(gridSize);
  for (let i = 0; i < gridSize; i++) {
    grid[i] = new Array(gridSize);
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }
}

function draw() {
  background(10, 10, 20);

  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Apply orbital motion
    const center = createVector(width / 2, height / 2);
    const force = p5.Vector.sub(center, p.pos);
    force.normalize();
    force.mult(0.001);
    p.applyForce(force);

    // Apply repulsion from nearby particles
    const gridX = floor(p.pos.x / (width / gridSize));
    const gridY = floor(p.pos.y / (height / gridSize));

    for (let x = max(0, gridX - 1); x <= min(gridSize - 1, gridX + 1); x++) {
      for (let y = max(0, gridY - 1); y <= min(gridSize - 1, gridY + 1); y++) {
        const neighbors = grid[x][y];
        for (let j = 0; j < neighbors.length; j++) {
          if (neighbors[j] !== p) {
            p.attract(neighbors[j]);
          }
        }
      }
    }

    // Update and display
    p.update();
    p.display();

    // Update grid
    const indexX = floor(p.pos.x / (width / gridSize));
    const indexY = floor(p.pos.y / (height / gridSize));
    if (indexX >= 0 && indexX < gridSize && indexY >= 0 && indexY < gridSize) {
      grid[indexX][indexY].push(p);
    }
  }

  // Clear grid for next frame
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = [];
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
