let particles = [];
let lattice = [];
let gridSize = 20;
let grid = [];
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let time = 0;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.size = random(2, 6);
    this.color = color(random(100, 255), random(100, 255), random(255));
    this.targetX = x;
    this.targetY = y;
    this.lerpAmount = 0.02;
  }

  update() {
    if (isDragging) {
      let dx = this.x - dragStart.x;
      let dy = this.y - dragStart.y;
      let d = sqrt(dx * dx + dy * dy);
      if (d < 100) {
        let force = map(d, 0, 100, 5, 0);
        this.vx += dx * force * 0.001;
        this.vy += dy * force * 0.001;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    // Apply some damping
    this.vx *= 0.98;
    this.vy *= 0.98;

    // Boundary check
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 255);

  // Create particles
  for (let i = 0; i < 800; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  // Initialize grid
  for (let x = 0; x < width; x += gridSize) {
    grid[x] = [];
    for (let y = 0; y < height; y += gridSize) {
      grid[x][y] = false;
    }
  }
}

function draw() {
  background(0, 0, 10);

  time++;

  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }

  // Occasionally form a lattice
  if (time % 100 === 0 && !isDragging) {
    createLattice();
  }

  // Draw lattice if exists
  if (lattice.length > 0) {
    for (let l of lattice) {
      stroke(255, 100);
      noFill();
      beginShape();
      for (let i = 0; i < l.length; i++) {
        vertex(l[i].x, l[i].y);
      }
      endShape(CLOSE);
    }

    // Fade out lattice over time
    if (time % 5 === 0) {
      for (let i = 0; i < lattice.length; i++) {
        if (lattice[i].length > 0) {
          lattice[i].pop();
        }
        if (lattice[i].length === 0) {
          lattice.splice(i, 1);
          i--;
        }
      }
    }
  }

  // Connect nearby particles occasionally
  if (time % 30 === 0 && !isDragging) {
    connectNearbyParticles();
  }
}

function createLattice() {
  let centerX = random(width);
  let centerY = random(height);
  let points = [];
  let numPoints = 20 + floor(random(10));
  for (let i = 0; i < numPoints; i++) {
    let angle = map(i, 0, numPoints, 0, TWO_PI);
    let radius = 30 + random(50);
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    points.push({ x, y });
  }
  lattice.push(points);
}

function connectNearbyParticles() {
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      let dx = p1.x - p2.x;
      let dy = p1.y - p2.y;
      let d = sqrt(dx * dx + dy * dy);
      if (d < 50) {
        stroke(255, 30);
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }
  }
}

function mousePressed() {
  isDragging = true;
  dragStart.x = mouseX;
  dragStart.y = mouseY;

  // Scatter particles
  for (let p of particles) {
    let dx = p.x - dragStart.x;
    let dy = p.y - dragStart.y;
    let d = sqrt(dx * dx + dy * dy);
    if (d < 100) {
      let force = map(d, 0, 100, 5, 0);
      p.vx += dx * force * 0.01;
      p.vy += dy * force * 0.01;
    }
  }

  // Create a temporary lattice at the drag point
  createLattice();
}

function mouseReleased() {
  isDragging = false;
}
