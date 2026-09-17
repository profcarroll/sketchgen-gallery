let shapes = [];
let particles = [];

class Shape {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(20, 80);
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
    this.life = random(100, 300);
    this.maxLife = this.life;
    this.color = color(random(100, 255), random(100, 255), 255, 200);
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
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(this.x, this.y));
    }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 6);
    this.speedY = random(0.5, 2);
    this.speedX = random(-1, 1);
    this.life = random(50, 100);
    this.maxLife = this.life;
    this.color = color(random(100, 255), random(100, 255), 255, 150);
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
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
  createCanvas(800, 600);
  colorMode(RGB);
  background(10);
  for (let i = 0; i < 15; i++) {
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
  if (random() < 0.02) {
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
