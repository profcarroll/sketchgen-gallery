let particles = [];
const maxParticles = 1000;
const fadeSpeed = 0.95;
const spawnRate = 5;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 6);
    this.alpha = 255;
    this.color = color(random(100, 255), random(100, 255), random(255), this.alpha);
  }

  update() {
    this.alpha *= fadeSpeed;
    this.size *= 0.98;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }

  isDead() {
    return this.alpha < 5 || this.size < 0.5;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
}

function draw() {
  background(0, 0, 0, 30); // Semi-transparent background for trail effect

  if (mouseIsPressed) {
    for (let i = 0; i < spawnRate; i++) {
      particles.push(new Particle(mouseX, mouseY));
    }
  }

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();

    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  // Cap the number of particles to avoid performance issues
  if (particles.length > maxParticles) {
    particles.splice(0, particles.length - maxParticles);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
