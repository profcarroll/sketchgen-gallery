let lines = [];
let nodes = [];
let rings = [];
let afterglows = [];

class Line {
  constructor() {
    this.points = [];
    this.length = 100;
    this.pulse = 0;
    this.oscillation = 0;
    this.oscillationSpeed = random(0.02, 0.05);
    this.color = color(random(200, 255), random(200, 255), 255);
    this.init();
  }

  init() {
    let x = random(width);
    let y = random(height);
    for (let i = 0; i < this.length; i++) {
      this.points.push({x: x, y: y});
      x += random(-10, 10);
      y += random(-10, 10);
    }
  }

  update() {
    // Move the line
    for (let i = this.points.length - 1; i > 0; i--) {
      this.points[i].x = this.points[i - 1].x;
      this.points[i].y = this.points[i - 1].y;
    }
    this.points[0].x += random(-2, 2);
    this.points[0].y += random(-2, 2);

    // Pulsate
    this.pulse = (this.pulse + 0.05) % TWO_PI;
    this.oscillation = sin(this.oscillation + this.oscillationSpeed) * 3;

    // Check for node interaction
    for (let node of nodes) {
      let d = dist(this.points[0].x, this.points[0].y, node.x, node.y);
      if (d < 50) {
        rings.push(new Ring(node.x, node.y));
        this.pulse = 0;
        this.oscillation = 0;
      }
    }
  }

  display() {
    // Draw the line with oscillation
    push();
    translate(this.oscillation, this.oscillation);
    stroke(this.color);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let p of this.points) {
      vertex(p.x, p.y);
    }
    endShape();
    pop();

    // Draw pulse effect
    let pulseSize = sin(this.pulse) * 5 + 10;
    fill(this.color);
    noStroke();
    ellipse(this.points[0].x, this.points[0].y, pulseSize);
  }
}

class Node {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(3, 8);
    this.color = random() > 0.5 ? color(255, 50, 50) : color(50, 255, 50);
    this.pulse = 0;
  }

  update() {
    this.pulse = (this.pulse + 0.1) % TWO_PI;
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size + sin(this.pulse) * 2);
  }
}

class Ring {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 50;
    this.alpha = 255;
    this.decay = random(0.5, 1.5);
  }

  update() {
    this.radius += 2;
    this.alpha -= this.decay;
  }

  display() {
    noFill();
    stroke(255, this.alpha);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

class Afterglow {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 30);
    this.alpha = 255;
    this.decay = random(0.8, 1.5);
    this.color = color(random(200, 255), random(200, 255), 255);
  }

  update() {
    this.size *= 0.97;
    this.alpha -= this.decay;
  }

  display() {
    noStroke();
    fill(this.color, this.alpha);
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Create initial lines
  for (let i = 0; i < 10; i++) {
    lines.push(new Line());
  }

  // Create initial nodes
  for (let i = 0; i < 20; i++) {
    nodes.push(new Node());
  }
}

function draw() {
  background(0);

  // Update and display lines
  for (let line of lines) {
    line.update();
    line.display();
  }

  // Update and display nodes
  for (let node of nodes) {
    node.update();
    node.display();
  }

  // Update and display rings
  for (let i = rings.length - 1; i >= 0; i--) {
    rings[i].update();
    rings[i].display();
    if (rings[i].alpha <= 0) {
      rings.splice(i, 1);
    }
  }

  // Update and display afterglows
  for (let i = afterglows.length - 1; i >= 0; i--) {
    afterglows[i].update();
    afterglows[i].display();
    if (afterglows[i].alpha <= 0) {
      afterglows.splice(i, 1);
    }
  }

  // Occasionally add new lines or nodes
  if (random() < 0.02) {
    lines.push(new Line());
    if (lines.length > 20) lines.shift();
  }

  if (random() < 0.05) {
    nodes.push(new Node());
    if (nodes.length > 30) nodes.shift();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
