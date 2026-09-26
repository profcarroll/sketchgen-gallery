let seeds = [];
let flowers = [];
let skyGradient;

class Seed {
  constructor() {
    this.reset();
    this.size = random(2, 5);
    this.color = color(255, 255, 200, 200);
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
    this.trail = [];
    this.maxTrailLength = 10;
  }

  update() {
    // Apply gentle floating motion
    this.x += this.vx + random(-0.1, 0.1);
    this.y += this.vy + random(-0.1, 0.1);

    // Add to trail
    this.trail.push({x: this.x, y: this.y});
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;

    // Reset if out of bounds
    if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
      this.reset();
    }
  }

  display() {
    // Draw trail
    noFill();
    stroke(this.color);
    strokeWeight(1);
    beginShape();
    for (let p of this.trail) {
      vertex(p.x, p.y);
    }
    endShape();

    // Draw seed
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  burst() {
    flowers.push(new Flower(this.x, this.y));
    this.reset();
  }
}

class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.growth = 0;
    this.maxGrowth = 100;
    this.petalCount = 8;
    this.colors = [
      color(255, 100, 100),
      color(255, 200, 100),
      color(100, 200, 255),
      color(200, 100, 255),
      color(100, 255, 200)
    ];
  }

  update() {
    this.growth++;
  }

  display() {
    if (this.growth > this.maxGrowth) return;

    push();
    translate(this.x, this.y);

    // Draw stem
    stroke(100, 200, 100);
    strokeWeight(2);
    line(0, 0, 0, -30);

    // Draw flower head
    noStroke();
    for (let i = 0; i < this.petalCount; i++) {
      let angle = TWO_PI * i / this.petalCount;
      let petalSize = map(this.growth, 0, this.maxGrowth, 5, 20);
      fill(this.colors[i % this.colors.length]);
      ellipse(cos(angle) * 10, sin(angle) * 10, petalSize, petalSize * 1.5);
    }

    // Draw center
    fill(255, 255, 0);
    ellipse(0, 0, map(this.growth, 0, this.maxGrowth, 5, 15));

    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  windowResized();

  // Create sky gradient
  skyGradient = createGraphics(width, height);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(135, 206, 235), color(255, 255, 255), inter);
    skyGradient.stroke(c);
    skyGradient.line(0, y, width, y);
  }

  // Create initial seeds
  for (let i = 0; i < 100; i++) {
    seeds.push(new Seed());
  }
}

function draw() {
  image(skyGradient, 0, 0);

  // Update and display seeds
  for (let seed of seeds) {
    seed.update();
    seed.display();
  }

  // Update and display flowers
  for (let flower of flowers) {
    flower.update();
    flower.display();
  }

  // Remove flowers that are fully grown
  flowers = flowers.filter(f => f.growth <= f.maxGrowth);
}

function mousePressed() {
  // Find the closest seed to click position
  let minDist = Infinity;
  let closestSeed = null;

  for (let seed of seeds) {
    let d = dist(mouseX, mouseY, seed.x, seed.y);
    if (d < minDist) {
      minDist = d;
      closestSeed = seed;
    }
  }

  // If we found a seed close to the click, burst it
  if (closestSeed && minDist < 30) {
    closestSeed.burst();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
