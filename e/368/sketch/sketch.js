let circles = [];
let stars = [];
let flares = [];
let wakePoints = [];

class Circle {
  constructor() {
    this.reset();
    this.alpha = random(30, 60);
    this.size = random(20, 100);
    this.speed = random(0.2, 0.8);
  }

  reset() {
    this.x = random(-50, width + 50);
    this.y = random(-50, height + 50);
    this.vx = random(-1, 1) * 0.3;
    this.vy = random(-1, 1) * 0.3;
    this.growth = random(0.02, 0.05);
  }

  update() {
    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;
    this.size += this.growth;

    if (this.size > 300 || this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
      this.reset();
    }
  }

  display() {
    noFill();
    stroke(255, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

class Star {
  constructor() {
    this.reset();
    this.trail = [];
    this.maxTrailLength = 10;
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.size = random(1, 3);
    this.speed = random(1, 3);
    this.trail = [];
  }

  update() {
    this.x += this.vx * this.speed;
    this.y += this.vy * this.speed;

    // Add current position to trail
    this.trail.push({x: this.x, y: this.y, alpha: 255});

    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Reset if out of bounds
    if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
      this.reset();
    }
  }

  display() {
    // Draw trail
    for (let i = 0; i < this.trail.length; i++) {
      const point = this.trail[i];
      const alpha = map(i, 0, this.trail.length - 1, 0, point.alpha);
      noStroke();
      fill(255, alpha);
      ellipse(point.x, point.y, this.size * (i / this.trail.length));
    }

    // Draw star
    noStroke();
    fill(255, 200);
    ellipse(this.x, this.y, this.size);

    // Occasionally create flare
    if (random() < 0.001) {
      flares.push(new Flare(this.x, this.y));
    }
  }
}

class Flare {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = random(40, 80);
    this.alpha = 255;
  }

  update() {
    this.radius += 1.5;
    this.alpha -= 3;
  }

  display() {
    noFill();
    stroke(255, this.alpha);
    ellipse(this.x, this.y, this.radius * 2);
  }

  isFinished() {
    return this.alpha <= 0 || this.radius > this.maxRadius;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < 50; i++) {
    circles.push(new Circle());
  }

  for (let i = 0; i < 200; i++) {
    stars.push(new Star());
  }
}

function draw() {
  background(0, 0, 0, 1);

  // Update and display circles
  for (let circle of circles) {
    circle.update();
    circle.display();
  }

  // Update and display stars
  for (let star of stars) {
    star.update();
    star.display();
  }

  // Update and display flares
  for (let i = flares.length - 1; i >= 0; i--) {
    flares[i].update();
    flares[i].display();
    if (flares[i].isFinished()) {
      flares.splice(i, 1);
    }
  }

  // Create wakes
  if (frameCount % 3 === 0) {
    wakePoints.push({x: random(width), y: random(height), alpha: 255});
  }

  for (let i = wakePoints.length - 1; i >= 0; i--) {
    const p = wakePoints[i];
    p.alpha -= 1;
    noStroke();
    fill(180, 50, 100, p.alpha / 255);
    ellipse(p.x, p.y, 3);
    if (p.alpha <= 0) {
      wakePoints.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
