let paintParticles = [];
let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  background(0, 0, 0);
  noStroke();
}

function draw() {
  // Simulate viscosity by adjusting particle behavior
  for (let i = paintParticles.length - 1; i >= 0; i--) {
    let p = paintParticles[i];
    p.applyForce(p.gravity);
    p.update();
    p.display();

    // Remove particles that are too old or too small
    if (p.lifespan < 0 || p.size < 0.5) {
      paintParticles.splice(i, 1);
    }
  }
}

function mouseDragged() {
  // Add new paint particles at mouse position with viscosity effects
  for (let i = 0; i < 5; i++) {
    let size = random(2, 8);
    let hue = random(360);
    let saturation = random(70, 100);
    let brightness = random(70, 100);
    let alpha = random(0.3, 0.8);

    paintParticles.push(
      new PaintParticle(
        mouseX,
        mouseY,
        size,
        hue,
        saturation,
        brightness,
        alpha
      )
    );
  }
}

class PaintParticle {
  constructor(x, y, size, hue, saturation, brightness, alpha) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.acc = createVector(0, 0);
    this.size = size;
    this.hue = hue;
    this.saturation = saturation;
    this.brightness = brightness;
    this.alpha = alpha;
    this.lifespan = 255;
    this.gravity = createVector(0, 0.05);
    this.viscosity = random(0.95, 0.99);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.mult(this.viscosity); // Viscosity effect
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.lifespan -= 2;
    this.size *= 0.98; // Gradual shrinkage for paint spreading
  }

  display() {
    fill(this.hue, this.saturation, this.brightness, this.alpha);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
