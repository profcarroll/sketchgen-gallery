let particles = [];
const particleCount = 300;
const repulsionRadius = 80;
const repulsionStrength = 0.5;
const trailLength = 20;

class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = p5.Vector.random2D().mult(random(1, 3));
    this.trail = [];
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 150);
  }

  update() {
    // Update trail
    this.trail.push(this.position.copy());
    if (this.trail.length > trailLength) {
      this.trail.shift();
    }

    // Apply velocity
    this.position.add(this.velocity);

    // Boundary check - wrap around
    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }

  applyRepulsion(other) {
    const distance = p5.Vector.dist(this.position, other.position);
    if (distance < repulsionRadius && distance > 0) {
      const force = p5.Vector.sub(this.position, other.position);
      force.normalize();
      force.mult(repulsionStrength * (1 - distance / repulsionRadius));
      this.velocity.add(force);
    }
  }

  display() {
    // Draw trail
    noFill();
    stroke(this.color);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = map(i, 0, this.trail.length, 0, 255);
      stroke(red(this.color), green(this.color), blue(this.color), alpha);
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();

    // Draw particle
    fill(this.color);
    noStroke();
    ellipse(this.position.x, this.position.y, 4, 4);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(10, 10, 25);

  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Apply repulsion from other particles
    for (let j = 0; j < particles.length; j++) {
      if (i !== j) {
        p.applyRepulsion(particles[j]);
      }
    }

    p.update();
    p.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
