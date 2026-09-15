let particles = [];
let gridSize = 20;
let grid = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  for (let i = 0; i < width / gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < height / gridSize; j++) {
      grid[i][j] = { hue: random(360), sat: random(80, 100), bri: random(70, 100) };
    }
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }

  // Randomly generate new particles occasionally
  if (frameCount % 5 === 0) {
    let x = random(width);
    let y = random(height);
    particles.push(new Particle(x, y));
  }

  // Grid animation
  if (frameCount % 20 === 0) {
    for (let i = 0; i < width / gridSize; i++) {
      for (let j = 0; j < height / gridSize; j++) {
        grid[i][j].hue = (grid[i][j].hue + 1) % 360;
      }
    }
  }

  // Draw grid
  for (let i = 0; i < width / gridSize; i++) {
    for (let j = 0; j < height / gridSize; j++) {
      fill(grid[i][j].hue, grid[i][j].sat, grid[i][j].bri);
      rect(i * gridSize, j * gridSize, gridSize, gridSize);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 15);
    this.hue = random(360);
    this.sat = random(80, 100);
    this.bri = random(70, 100);
    this.alpha = 1;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.lifespan = random(60, 120);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.01;
    this.lifespan--;
  }

  display() {
    fill(this.hue, this.sat, this.bri, this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  isDead() {
    return this.alpha <= 0 || this.lifespan <= 0;
  }
}

function mouseDragged() {
  for (let i = 0; i < 5; i++) {
    particles.push(new Particle(mouseX, mouseY));
  }
}
