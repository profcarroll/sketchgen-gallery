let forms = [];
let particles = [];
let grid = [];

class Form {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(20, 60);
    this.glow = random(0.8, 1);
    this.color = color(255, 255, 255, 200);
    this.pulse = 0;
    this.life = 1;
  }

  update() {
    this.pulse += 0.03;
    this.glow = map(sin(this.pulse), -1, 1, 0.7, 1);
    this.life -= 0.002;
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), 255 * this.glow * this.life);
    ellipse(this.pos.x, this.pos.y, this.size * this.glow, this.size * this.glow);
  }

  isDead() {
    return this.life <= 0;
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(2, 6);
    this.alpha = 255;
    this.life = 1;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.mult(0.98);
    this.alpha -= 2;
    this.life -= 0.005;
  }

  display() {
    noStroke();
    fill(255, 255, 255, this.alpha * this.life);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  isDead() {
    return this.alpha <= 0 || this.life <= 0;
  }
}

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  for (let i = 0; i < 20; i++) {
    forms.push(new Form(random(width), random(height)));
  }
  grid = new Array(40).fill().map(() => new Array(30).fill([]));
}

function draw() {
  background(0, 0, 0);

  // Update and display forms
  for (let i = forms.length - 1; i >= 0; i--) {
    forms[i].update();
    forms[i].display();

    if (forms[i].isDead()) {
      // Break into particles
      for (let j = 0; j < 20; j++) {
        particles.push(new Particle(forms[i].pos.x, forms[i].pos.y));
      }
      forms.splice(i, 1);
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

  // Occasionally spawn new forms
  if (random() < 0.05 && forms.length < 30) {
    forms.push(new Form(random(width), random(height)));
  }
}
