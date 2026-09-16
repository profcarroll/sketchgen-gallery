let blossoms = [];
const numBlossoms = 150;
let hueOffset = 0;

class Blossom {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(20, 60);
    this.hue = random(250, 310); // purples to pinks
    this.sat = random(40, 80);
    this.bri = random(60, 90);
    this.pulseSpeed = random(0.01, 0.03);
    this.pulsePhase = random(TWO_PI);
    this.driftSpeed = random(0.001, 0.005);
    this.driftAngle = random(TWO_PI);
    this.originalSize = this.size;
  }

  update() {
    // Subtle drifting
    this.x += cos(this.driftAngle) * this.driftSpeed * 100;
    this.y += sin(this.driftAngle) * this.driftSpeed * 100;

    // Pulsing
    let pulse = sin(frameCount * this.pulseSpeed + this.pulsePhase);
    this.size = this.originalSize + pulse * 5;

    // Boundary check
    if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
      this.reset();
    }
  }

  display() {
    noStroke();
    fill(this.hue, this.sat, this.bri);
    ellipse(this.x, this.y, this.size);

    // Inner highlight
    fill(this.hue + 10, this.sat + 20, this.bri + 20);
    ellipse(this.x - this.size/4, this.y - this.size/4, this.size/3);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < numBlossoms; i++) {
    blossoms.push(new Blossom());
  }
}

function draw() {
  background(240, 5, 95); // soft lavender background

  // Update and display blossoms
  for (let blossom of blossoms) {
    blossom.update();
    blossom.display();
  }

  hueOffset += 0.1;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
