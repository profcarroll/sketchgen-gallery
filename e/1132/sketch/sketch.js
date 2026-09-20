let ripples = [];
let ring;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);
}

function draw() {
  background(200, 5, 90);

  // Update and display ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.update();
    ripple.display();

    if (ripple.isFinished()) {
      ripples.splice(i, 1);
    }
  }

  // Display ring if exists
  if (ring) {
    ring.update();
    ring.display();
    if (ring.isFinished()) {
      ring = null;
    }
  }
}

function mousePressed() {
  // Start audio on first click
  if (typeof userStartAudio === 'function') {
    userStartAudio();
  }

  // Create ripple at click position
  ripples.push(new Ripple(mouseX, mouseY));

  // Create temporary ring at impact point
  ring = new Ring(mouseX, mouseY);
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 150;
    this.alpha = 0.8;
    this.shrinkSpeed = 3;
    this.growthSpeed = 2;
    this.isGrowing = true;
  }

  update() {
    if (this.isGrowing) {
      this.radius += this.growthSpeed;
      if (this.radius >= this.maxRadius) {
        this.isGrowing = false;
      }
    } else {
      this.radius -= this.shrinkSpeed;
      this.alpha *= 0.95;
    }
  }

  display() {
    fill(200, 10, 80, this.alpha);
    ellipse(this.x, this.y, this.radius * 2);
  }

  isFinished() {
    return this.radius <= 0 && !this.isGrowing;
  }
}

class Ring {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.alpha = 0.5;
    this.growthSpeed = 2;
    this.fadeSpeed = 0.01;
  }

  update() {
    this.radius += this.growthSpeed;
    this.alpha -= this.fadeSpeed;
  }

  display() {
    fill(200, 10, 80, this.alpha);
    ellipse(this.x, this.y, this.radius * 2);
  }

  isFinished() {
    return this.alpha <= 0;
  }
}
