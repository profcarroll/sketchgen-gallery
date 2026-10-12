let shapes = [];
let particles = [];

class Shape {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(30, 120);
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(-0.5, 0.5);
    this.life = random(200, 400);
    this.maxLife = this.life;
    this.color = color(random(150, 255), random(100, 200), 255, 180);
    this.vertices = [];
    this.generateVertices();
  }

  generateVertices() {
    const numVerts = floor(random(5, 12));
    for (let i = 0; i < numVerts; i++) {
      const angle = map(i, 0, numVerts, 0, TWO_PI);
      const radius = random(this.size * 0.6, this.size * 0.9);
      this.vertices.push({
        x: cos(angle) * radius,
        y: sin(angle) * radius
      });
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > width) this.speedX *= -1;
    if (this.y < 0 || this.y > height) this.speedY *= -1;

    this.life--;
    if (this.life <= 0) {
      this.createParticles();
      return false;
    }
    return true;
  }

  createParticles() {
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle(this.x, this.y));
    }
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(2);
    beginShape();
    for (let v of this.vertices) {
      vertex(v.x + this.x, v.y + this.y);
    }
    endShape(CLOSE);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(0.5, 2);
    this.speedY = random(0.3, 1.2);
    this.speedX = random(-0.8, 0.8);
    this.life = random(60, 120);
    this.maxLife = this.life;
    this.color = color(random(150, 255), random(100, 200), 255, 120);
    this.type = floor(random(3)); // 0 for falling, 1 for clustering, 2 for drifting
    if (this.type === 1) {
      this.clusterSize = random(4, 10);
      this.clusterCenterX = this.x;
      this.clusterCenterY = this.y;
      this.angle = random(TWO_PI);
      this.radius = random(5, 30);
    } else if (this.type === 2) {
      this.driftAngle = random(TWO_PI);
      this.driftSpeed = random(0.1, 0.5);
    }
  }

  update() {
    if (this.type === 0) {
      this.x += this.speedX;
      this.y += this.speedY;
    } else if (this.type === 1) {
      this.angle += 0.03;
      this.x = this.clusterCenterX + cos(this.angle) * this.radius;
      this.y = this.clusterCenterY + sin(this.angle) * this.radius;
    } else {
      this.driftAngle += random(-0.1, 0.1);
      this.x += cos(this.driftAngle) * this.driftSpeed;
      this.y += sin(this.driftAngle) * this.driftSpeed;
    }
    
    this.life--;
    if (this.life <= 0) return false;
    return true;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(RGB);
  background(10);
  for (let i = 0; i < 20; i++) {
    shapes.push(new Shape());
  }
}

function draw() {
  background(10, 10, 20, 30);

  // Update and display shapes
  for (let i = shapes.length - 1; i >= 0; i--) {
    if (!shapes[i].update()) {
      shapes.splice(i, 1);
    } else {
      shapes[i].display();
    }
  }

  // Add new shapes occasionally
  if (random() < 0.03) {
    shapes.push(new Shape());
  }

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].update()) {
      particles.splice(i, 1);
    } else {
      particles[i].display();
    }
  }
}
