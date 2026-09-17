let lines = [];
const NUM_LINES = 150;
const MAX_TRAILS = 300;
let trails = [];

class Line {
  constructor() {
    this.start = createVector(random(width), random(height));
    this.end = createVector(random(width), random(height));
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 200);
    this.speed = random(0.2, 0.8);
    this.trail = [];
  }

  update() {
    // Move the line endpoints
    this.start.x += (random(-1, 1) * this.speed);
    this.start.y += (random(-1, 1) * this.speed);
    this.end.x += (random(-1, 1) * this.speed);
    this.end.y += (random(-1, 1) * this.speed);

    // Keep within canvas
    if (this.start.x < 0 || this.start.x > width) this.start.x = random(width);
    if (this.start.y < 0 || this.start.y > height) this.start.y = random(height);
    if (this.end.x < 0 || this.end.x > width) this.end.x = random(width);
    if (this.end.y < 0 || this.end.y > height) this.end.y = random(height);

    // Add to trail
    this.trail.push(createVector(this.start.x, this.start.y));
    if (this.trail.length > 20) {
      this.trail.shift();
    }
  }

  display() {
    stroke(this.color);
    strokeWeight(1.5);
    line(this.start.x, this.start.y, this.end.x, this.end.y);

    // Draw trail
    noFill();
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = map(i, 0, this.trail.length, 0, 150);
      stroke(red(this.color), green(this.color), blue(this.color), alpha);
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 255);
  frameRate(30);

  for (let i = 0; i < NUM_LINES; i++) {
    lines.push(new Line());
  }

  // Initialize trails
  for (let i = 0; i < MAX_TRAILS; i++) {
    trails.push({
      pos: createVector(random(width), random(height)),
      size: random(2, 8),
      alpha: random(50, 150),
      hue: random(255)
    });
  }
}

function draw() {
  background(0, 0, 0, 30); // Semi-transparent background for trail effect

  // Draw persistent trails
  for (let t of trails) {
    fill(t.hue, 100, 255, t.alpha);
    noStroke();
    ellipse(t.pos.x, t.pos.y, t.size, t.size);
    t.pos.x += random(-0.5, 0.5);
    t.pos.y += random(-0.5, 0.5);
    if (t.pos.x < 0 || t.pos.x > width || t.pos.y < 0 || t.pos.y > height) {
      t.pos.x = random(width);
      t.pos.y = random(height);
    }
  }

  // Update and draw lines
  for (let line of lines) {
    line.update();
    line.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
