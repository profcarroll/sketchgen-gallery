let circles = [];
let stars = [];
let flares = [];

const CIRCLE_COUNT = 100;
const STAR_COUNT = 500;
const FLARE_COUNT = 20;

class Circle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(30, 100);
    this.speed = random(0.1, 0.3);
    this.alpha = random(30, 80);
    this.color = color(255, 255, 255, this.alpha);
  }

  update() {
    this.y += this.speed;
    if (this.y > height + this.r) {
      this.y = -this.r;
      this.x = random(width);
    }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.r * 2);
  }
}

class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(0.5, 2);
    this.brightness = random(150, 255);
    this.speed = random(0.05, 0.1);
    this.pulse = random(TWO_PI);
    this.pulseSpeed = random(0.01, 0.03);
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0;
      this.x = random(width);
    }
    this.pulse += this.pulseSpeed;
  }

  display() {
    const pulseValue = sin(this.pulse) * 50 + 100;
    noStroke();
    fill(255, 255, 255, this.brightness + pulseValue);
    ellipse(this.x, this.y, this.size);
  }
}

class Flare {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = random(10, 30);
    this.alpha = 255;
    this.color = color(255, 255, 200, this.alpha);
  }

  update() {
    this.radius += 1;
    this.alpha -= 5;
    return this.alpha <= 0;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < CIRCLE_COUNT; i++) {
    circles.push(new Circle());
  }
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push(new Star());
  }
}

function draw() {
  background(10, 10, 30);

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

  // Check for interactions between stars and circles
  for (let star of stars) {
    for (let circle of circles) {
      let dx = star.x - circle.x;
      let dy = star.y - circle.y;
      let distance = sqrt(dx * dx + dy * dy);
      if (distance < circle.r + star.size / 2) {
        flares.push(new Flare(star.x, star.y));
        break;
      }
    }
  }

  // Update and display flares
  for (let i = flares.length - 1; i >= 0; i--) {
    let flare = flares[i];
    if (flare.update()) {
      flares.splice(i, 1);
    } else {
      flare.display();
    }
  }

  // Cap flare count to prevent buildup
  if (flares.length > FLARE_COUNT) {
    flares.splice(0, flares.length - FLARE_COUNT);
  }
}
