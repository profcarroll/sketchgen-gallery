let particles = [];
let latticeGrid = [];
let gridSize = 20;
let latticeSize = 10;
let isLatticeForming = false;
let latticeTimer = 0;
let latticeDuration = 120;
let particleCount = 500;

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(2, 6);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 200);
    this.acc = createVector(0, 0);
    this.prevPos = this.pos.copy();
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(5);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.pos.x > width) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = width;

    if (this.pos.y > height) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = height;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  checkCollision(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d < this.size/2 + other.size/2) {
      return true;
    }
    return false;
  }
}

function setup() {
  createCanvas(600, 400);
  colorMode(HSB, 360, 100, 100, 1);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Initialize grid
  for (let x = 0; x < width; x += gridSize) {
    latticeGrid[x] = [];
    for (let y = 0; y < height; y += gridSize) {
      latticeGrid[x][y] = false;
    }
  }
}

function draw() {
  background(10, 5, 10);

  // Occasionally form lattice
  if (!isLatticeForming && random() < 0.002) {
    isLatticeForming = true;
    latticeTimer = 0;
  }

  if (isLatticeForming) {
    latticeTimer++;
    if (latticeTimer > latticeDuration) {
      isLatticeForming = false;
    } else {
      // Draw lattice
      for (let x = 0; x < width; x += gridSize * latticeSize) {
        for (let y = 0; y < height; y += gridSize * latticeSize) {
          let alpha = map(latticeTimer, 0, latticeDuration/2, 0, 255);
          stroke(200, 100, 100, alpha);
          strokeWeight(1);
          noFill();
          rect(x, y, gridSize * latticeSize, gridSize * latticeSize);
        }
      }
    }
  }

  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // Apply some random force to make movement chaotic
    let force = p5.Vector.random2D().mult(0.01);
    p.applyForce(force);

    // Apply attraction to nearby particles
    for (let j = 0; j < particles.length; j++) {
      if (i !== j) {
        let other = particles[j];
        let d = dist(p.pos.x, p.pos.y, other.pos.x, other.pos.y);
        if (d < 50 && d > 0) {
          let force = p5.Vector.sub(p.pos, other.pos);
          force.normalize();
          force.mult(0.01);
          p.applyForce(force);
        }
      }
    }

    p.update();
    p.display();
  }
}
