let lines = [];
let particles = [];
let time = 0;
const GRID_SIZE = 40;
const PARTICLE_COUNT = 500;
const LINE_COUNT = 800;

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(1, 3);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 200);
  }

  update() {
    this.pos.add(this.vel);
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

class LineSegment {
  constructor() {
    this.start = createVector(random(width), random(height));
    this.end = createVector(random(width), random(height));
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 150);
    this.alpha = random(50, 150);
    this.broken = false;
    this.burstTime = 0;
    this.burstDuration = random(30, 60);
  }

  update() {
    if (this.broken) {
      this.alpha -= 2;
      if (this.alpha <= 0) {
        this.reset();
      }
    } else {
      // Subtle breathing effect
      this.alpha = map(sin(time * 0.01 + frameCount * 0.001), -1, 1, 80, 150);
      
      // Occasionally break
      if (random() < 0.0002) {
        this.broken = true;
        this.burstTime = frameCount;
      }
    }
  }

  reset() {
    this.start = createVector(random(width), random(height));
    this.end = createVector(random(width), random(random(100, 300)));
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 150);
    this.broken = false;
    this.alpha = random(50, 150);
  }

  display() {
    stroke(this.color);
    strokeWeight(1);
    if (this.broken) {
      // Fade out burst
      stroke(red(this.color), green(this.color), blue(this.color), this.alpha);
    } else {
      stroke(red(this.color), green(this.color), blue(this.color), this.alpha);
    }
    
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  
  // Initialize particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Initialize lines
  for (let i = 0; i < LINE_COUNT; i++) {
    lines.push(new LineSegment());
  }
}

function draw() {
  background(10, 10, 10);
  
  time++;
  
  // Update and display particles
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  // Update and display lines
  for (let l of lines) {
    l.update();
    l.display();
  }
  
  // Occasionally reorganize the lattice structure
  if (frameCount % 120 === 0) {
    // Reorganize some lines to create new connections
    for (let i = 0; i < 5; i++) {
      const idx = floor(random(lines.length));
      lines[idx].reset();
    }
  }
  
  // Occasionally add bursts
  if (frameCount % 300 === 0) {
    for (let i = 0; i < 10; i++) {
      const idx = floor(random(lines.length));
      lines[idx].broken = true;
      lines[idx].burstTime = frameCount;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
