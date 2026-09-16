let lines = [];
let nodes = [];
let tickerSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
let tickerPositions = [];

class Line {
  constructor() {
    this.points = [];
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
    this.speed = random(0.5, 2);
    this.size = random(1, 3);
    this.growth = 0;
    this.pulse = 0;
    this.reset();
  }

  reset() {
    this.points = [];
    for (let i = 0; i < 50; i++) {
      this.points.push({
        x: random(width),
        y: random(height),
        age: i * 0.1
      });
    }
  }

  update() {
    // Move points forward
    for (let p of this.points) {
      p.x += random(-this.speed, this.speed);
      p.y += random(-this.speed, this.speed);
      p.age += 0.1;
    }

    // Keep within bounds
    for (let p of this.points) {
      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        this.reset();
        break;
      }
    }

    // Update pulse effect
    if (this.pulse > 0) {
      this.pulse -= 0.05;
      this.growth += 0.1;
    } else {
      this.growth = 0;
    }
  }

  draw() {
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let p = this.points[i];
      let alpha = map(p.age, 0, 5, 0, 255);
      stroke(red(this.color), green(this.color), blue(this.color), alpha);
      strokeWeight(this.size + this.growth);
      vertex(p.x, p.y);
    }
    endShape();

    // Draw pulse effect
    if (this.pulse > 0) {
      noFill();
      stroke(red(this.color), green(this.color), blue(this.color), this.pulse * 50);
      strokeWeight(2 + this.growth);
      ellipse(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y, 30 + this.growth * 10);
    }
  }

  checkNodeCollision(node) {
    for (let p of this.points) {
      let d = dist(p.x, p.y, node.x, node.y);
      if (d < node.size / 2 + 20) {
        this.pulse = 1;
        return true;
      }
    }
    return false;
  }
}

class Node {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(10, 30);
    this.color = random() > 0.5 ? color(255, 0, 0) : color(0, 255, 0); // Red or green
    this.pulse = 0;
    this.decay = random(0.98, 0.99);
  }

  update() {
    if (this.pulse > 0) {
      this.pulse *= this.decay;
    }
  }

  draw() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size + this.pulse * 20);

    // Draw pulsating ring
    if (this.pulse > 0) {
      noFill();
      stroke(red(this.color), green(this.color), blue(this.color), this.pulse * 100);
      strokeWeight(2);
      ellipse(this.x, this.y, this.size + this.pulse * 40);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // Initialize lines
  for (let i = 0; i < 15; i++) {
    lines.push(new Line());
  }

  // Initialize nodes
  for (let i = 0; i < 8; i++) {
    nodes.push(new Node());
  }

  // Set ticker positions
  for (let i = 0; i < tickerSymbols.length; i++) {
    tickerPositions.push({
      x: random(width),
      y: random(height),
      text: tickerSymbols[i],
      size: random(12, 24)
    });
  }
}

function draw() {
  background(0);

  // Draw ticker symbols
  for (let pos of tickerPositions) {
    fill(255);
    noStroke();
    textSize(pos.size);
    textAlign(CENTER, CENTER);
    text(pos.text, pos.x, pos.y);
  }

  // Update and draw nodes
  for (let node of nodes) {
    node.update();
    node.draw();
  }

  // Update and draw lines
  for (let line of lines) {
    line.update();
    line.draw();

    // Check for collisions with nodes
    for (let node of nodes) {
      if (line.checkNodeCollision(node)) {
        node.pulse = 1;
      }
    }
  }

  // Occasionally add new lines
  if (random() < 0.02 && lines.length < 30) {
    lines.push(new Line());
  }

  // Remove old lines occasionally
  if (lines.length > 20 && random() < 0.05) {
    lines.shift();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
