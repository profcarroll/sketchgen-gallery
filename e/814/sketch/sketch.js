let particles = [];
const maxParticles = 1000;
const particleCount = 5;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 2;
    this.maxSize = random(8, 15);
    this.color = color(random(255), random(255), random(255));
    this.alpha = 255;
    this.life = 1.0;
    this.angle = random(TWO_PI);
    this.speed = random(0.5, 2);
    this.growthRate = random(0.05, 0.1);
    this.fadeRate = random(0.5, 1.5);
    this.waveOffset = random(TWO_PI);
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    this.size += this.growthRate;
    this.life -= this.fadeRate / 255.0;
    this.alpha = map(this.life, 0, 1, 0, 255);

    if (this.size > this.maxSize) {
      this.angle += random(-0.1, 0.1);
    }

    if (this.life <= 0) {
      return false;
    }
    return true;
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 255);
  noCursor();
}

function draw() {
  background(0, 0, 0, 20);

  if (mouseIsPressed) {
    for (let i = 0; i < particleCount; i++) {
      const angle = random(TWO_PI);
      const dist = random(5, 10);
      const x = mouseX + cos(angle) * dist;
      const y = mouseY + sin(angle) * dist;
      particles.push(new Particle(x, y));
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].update()) {
      particles.splice(i, 1);
    } else {
      particles[i].display();
    }
  }

  if (particles.length > maxParticles) {
    particles.splice(0, particles.length - maxParticles);
  }
}
