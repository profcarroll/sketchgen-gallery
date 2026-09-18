let particles1 = [];
let particles2 = [];
let pulseSpeed = 0;
let pulseDirection = 1;

class Particle {
  constructor(x, y, color, size) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.color = color;
    this.size = size;
    this.targetSize = size;
  }

  update() {
    // Apply velocity
    this.pos.add(this.vel);

    // Bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    // Slowly approach target size for pulsing effect
    this.size += (this.targetSize - this.size) * 0.05;
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  // Repel from other particles in same group
  repel(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d < 50 && d > 0) {
      let force = p5.Vector.sub(this.pos, other.pos);
      force.normalize();
      force.div(d); // Stronger force at closer distances
      this.vel.add(force);
    }
  }

  // Attract to particles in the other group
  attract(other) {
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d < 150 && d > 0) {
      let force = p5.Vector.sub(other.pos, this.pos);
      force.normalize();
      force.mult(0.2 / (d * 0.01)); // Attraction decreases with distance
      this.vel.add(force);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < 150; i++) {
    particles1.push(new Particle(random(width), random(height),
      color(random(60, 120), 80, 90),
      random(3, 7)));
  }

  for (let i = 0; i < 150; i++) {
    particles2.push(new Particle(random(width), random(height),
      color(random(240, 300), 80, 90),
      random(3, 7)));
  }
}

function draw() {
  background(0, 0, 0, 0.1); // Semi-transparent background for trail effect

  // Update and display particles
  for (let p of particles1) {
    p.update();
    p.display();
  }

  for (let p of particles2) {
    p.update();
    p.display();
  }

  // Apply interactions between groups
  for (let p1 of particles1) {
    for (let p2 of particles2) {
      p1.attract(p2);
    }
  }

  // Apply interactions within each group
  for (let i = 0; i < particles1.length; i++) {
    for (let j = i + 1; j < particles1.length; j++) {
      particles1[i].repel(particles1[j]);
    }
  }

  for (let i = 0; i < particles2.length; i++) {
    for (let j = i + 1; j < particles2.length; j++) {
      particles2[i].repel(particles2[j]);
    }
  }

  // Pulsing effect on one group
  pulseSpeed += 0.05 * pulseDirection;
  if (pulseSpeed > 3 || pulseSpeed < 0) {
    pulseDirection *= -1;
  }

  for (let p of particles1) {
    p.targetSize = map(pulseSpeed, 0, 3, 3, 12);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
