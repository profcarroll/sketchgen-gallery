let circles = [];
let trails = [];
let flares = [];
let glowParticles = [];

class Circle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.1, 0.5));
    this.size = random(30, 80);
    this.alpha = random(30, 70);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), this.alpha);
  }

  update() {
    this.pos.add(this.vel);
    
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(1);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

class Trail {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.life = 255;
    this.size = random(1, 3);
    this.color = color(255, 255, 200, this.life);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 2;
    this.size *= 0.98;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

class Flare {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = 5;
    this.maxSize = random(30, 60);
    this.growth = 1;
    this.alpha = 255;
  }

  update() {
    this.size += this.growth;
    this.alpha -= 2;
  }

  display() {
    noFill();
    stroke(255, 255, 200, this.alpha);
    strokeWeight(1);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

class GlowParticle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.1, 0.5));
    this.life = random(100, 200);
    this.size = random(1, 3);
    this.color = color(100, 150, 255, this.life);
  }

  update() {
    this.pos.add(this.vel);
    this.life -= 0.5;
    this.size *= 0.99;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Create initial circles
  for (let i = 0; i < 20; i++) {
    circles.push(new Circle());
  }

  // Create some stars
  for (let i = 0; i < 50; i++) {
    let starX = random(width);
    let starY = random(height);
    trails.push(new Trail(starX, starY));
  }
}

function draw() {
  background(10, 10, 20);

  // Update and display circles
  for (let circle of circles) {
    circle.update();
    circle.display();
  }

  // Update and display trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let trail = trails[i];
    trail.update();
    trail.display();

    if (trail.life <= 0) {
      trails.splice(i, 1);
    }
  }

  // Add new stars occasionally
  if (random() < 0.05) {
    trails.push(new Trail(random(width), random(height)));
  }

  // Update and display flares
  for (let i = flares.length - 1; i >= 0; i--) {
    let flare = flares[i];
    flare.update();
    flare.display();

    if (flare.alpha <= 0) {
      flares.splice(i, 1);
    }
  }

  // Check for interactions between circles and trails
  for (let circle of circles) {
    for (let trail of trails) {
      let d = dist(circle.pos.x, circle.pos.y, trail.pos.x, trail.pos.y);
      if (d < circle.size / 2 + trail.size) {
        flares.push(new Flare(trail.pos.x, trail.pos.y));
      }
    }
  }

  // Update and display glow particles
  for (let i = glowParticles.length - 1; i >= 0; i--) {
    let particle = glowParticles[i];
    particle.update();
    particle.display();

    if (particle.life <= 0) {
      glowParticles.splice(i, 1);
    }
  }

  // Occasionally add new glow particles
  if (random() < 0.1) {
    glowParticles.push(new GlowParticle(random(width), random(height)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
