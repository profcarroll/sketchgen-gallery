let particles = [];
const maxParticles = 1000;
const hueRange = 255;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, hueRange, 100, 100, 1);
}

function draw() {
  background(0, 0, 0, 1);

  if (mouseIsPressed) {
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(mouseX, mouseY));
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.display();

    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.acc = createVector(0, 0);
    this.hue = random(hueRange);
    this.sat = 100;
    this.bri = 100;
    this.alpha = 1;
    this.size = random(2, 6);
    this.lifespan = 255;
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.lifespan -= 2;
    this.alpha = map(this.lifespan, 0, 255, 0, 1);
    this.bri = map(this.lifespan, 0, 255, 30, 100);
  }

  display() {
    noStroke();
    fill(this.hue, this.sat, this.bri, this.alpha);
    ellipse(this.pos.x, this.pos.y, this.size);
  }

  isDead() {
    return this.lifespan < 0;
  }
}
