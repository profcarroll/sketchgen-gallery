let particles = [];
let lattice = [];
let gridSize = 20;
let grid = [];

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(3, 7);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 200);
    this.trail = [];
    this.maxTrailLength = 10;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.98);
    
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
    this.trail.push(createVector(this.pos.x, this.pos.y));

    // Bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);

    // Draw trail
    stroke(this.color);
    strokeWeight(1);
    beginShape();
    for (let p of this.trail) {
      vertex(p.x, p.y);
    }
    endShape();
  }

  attract(other) {
    let force = p5.Vector.sub(this.pos, other.pos);
    let distance = force.mag();
    if (distance > 0 && distance < 100) {
      let strength = (100 - distance) / 100;
      force.normalize();
      force.mult(strength * 0.1);
      other.vel.add(force);
    }
  }
}

function setup() {
  createCanvas(600, 400);
  colorMode(RGB);
  noStroke();

  for (let i = 0; i < 200; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  // Initialize grid
  for (let x = 0; x < width; x += gridSize) {
    grid[x] = [];
    for (let y = 0; y < height; y += gridSize) {
      grid[x][y] = [];
    }
  }
}

function draw() {
  background(10, 10, 20);

  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();

    // Apply attraction to nearby particles
    for (let other of particles) {
      if (p !== other) {
        p.attract(other);
      }
    }

    // Grid-based spatial hashing
    let gridX = floor(p.pos.x / gridSize) * gridSize;
    let gridY = floor(p.pos.y / gridSize) * gridSize;
    if (grid[gridX] && grid[gridX][gridY]) {
      grid[gridX][gridY].push(p);
    }
  }

  // Periodically form lattice
  if (frameCount % 300 === 0) {
    createLattice();
  }

  // Display lattice if exists
  if (lattice.length > 0) {
    drawLattice();
  }

  // Occasionally reset grid for spatial hash
  if (frameCount % 100 === 0) {
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        grid[x][y] = [];
      }
    }
  }

  // Occasionally create new lattice
  if (frameCount % 600 === 0 && random() > 0.5) {
    createLattice();
  }
}

function createLattice() {
  lattice = [];
  let rows = 10;
  let cols = 15;
  let spacingX = width / (cols + 1);
  let spacingY = height / (rows + 1);
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let x = (j + 1) * spacingX;
      let y = (i + 1) * spacingY;
      lattice.push(createVector(x, y));
    }
  }

  // Pulse the lattice
  pulseLattice();
}

function pulseLattice() {
  let t = frameCount % 200;
  if (t < 100) {
    for (let i = 0; i < lattice.length; i++) {
      let p = lattice[i];
      let pulse = sin(t * 0.1) * 2;
      fill(255, 255, 255, 100);
      ellipse(p.x, p.y, 10 + pulse);
    }
  }
}

function drawLattice() {
  // Draw lattice points
  for (let i = 0; i < lattice.length; i++) {
    let p = lattice[i];
    fill(255, 255, 255, 100);
    ellipse(p.x, p.y, 5);
  }

  // Draw connecting lines
  stroke(255, 255, 255, 30);
  strokeWeight(1);
  for (let i = 0; i < lattice.length; i++) {
    for (let j = i + 1; j < lattice.length; j++) {
      let p1 = lattice[i];
      let p2 = lattice[j];
      let d = dist(p1.x, p1.y, p2.x, p2.y);
      if (d < 50) {
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }
  }

  // Emit trails from lattice points
  for (let i = 0; i < lattice.length; i++) {
    let p = lattice[i];
    let trailLength = 5;
    for (let j = 0; j < trailLength; j++) {
      let offset = random(20);
      let angle = random(TWO_PI);
      let x = p.x + cos(angle) * offset;
      let y = p.y + sin(angle) * offset;
      fill(255, 255, 255, 30);
      ellipse(x, y, 2);
    }
  }
}
