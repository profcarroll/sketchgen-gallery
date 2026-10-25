let particles = [];
let grid = [];
let gridSize = 20;
let particleCount = 1500;
let crystalGrowth = [];

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.size = random(0.5, 2);
    this.color = color(200, 30, 90, 180);
    this.life = 1;
    this.growthRate = random(0.001, 0.005);
  }
  
  update() {
    // Apply gravity
    this.vel.y += 0.02;
    
    // Apply some random drift
    this.vel.x += random(-0.01, 0.01);
    
    // Update position
    this.pos.add(this.vel);
    
    // Boundary checks - bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -0.5;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -0.5;
    }
    
    // Slowly fade out
    this.life -= 0.0005;
  }
  
  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.life * 255);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
  
  isDead() {
    return this.life <= 0;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);
  colorMode(HSB, 360, 100, 100, 1);
  pixelDensity(1);
  
  // Initialize grid
  let cols = Math.ceil(width / gridSize);
  let rows = Math.ceil(height / gridSize);
  for (let i = 0; i < cols * rows; i++) {
    grid.push([]);
  }
  
  // Create initial particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(random(width), random(-50, -10)));
  }
}

function draw() {
  background(20, 20, 30);
  
  // Draw subtle gradient background
  for (let i = 0; i < height; i += 40) {
    let alpha = map(i, 0, height, 10, 40);
    stroke(30, 20, 40, alpha);
    line(0, i, width, i);
  }
  
  // Clear grid
  for (let i = 0; i < grid.length; i++) {
    grid[i] = [];
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    
    if (p.isDead()) {
      particles.splice(i, 1);
      particles.push(new Particle(random(width), random(-50, -10)));
    }
  }
  
  // Add new particles occasionally
  if (random() < 0.3 && particles.length < particleCount + 200) {
    particles.push(new Particle(random(width), random(-50, -10)));
  }
}

function mousePressed() {
  // Trigger a stress wave by adjusting all particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.vel.x += random(-2, 2);
    p.vel.y += random(-2, 2);
  }
}
