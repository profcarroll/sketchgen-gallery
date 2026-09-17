let lines = [];
let nodes = [];
let rings = [];
let tickerSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
let frameCount = 0;

class Line {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.length = random(20, 80);
    this.angle = random(TWO_PI);
    this.speed = random(0.02, 0.05);
    this.pulse = 0;
    this.color = color(random(200, 255), random(0, 50), random(0, 50));
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.speed;
    this.pulse = (sin(frameCount * 0.05) + 1) / 2;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    stroke(this.color);
    strokeWeight(2);
    line(-this.length/2, 0, this.length/2, 0);
    pop();
  }
}

class Node {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(5, 15);
    this.color = color(random(0, 50), random(200, 255), random(0, 50));
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

class Ring {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = random(50, 100);
    this.alpha = 255;
    this.color = color(random(200, 255), random(0, 50), random(0, 50));
  }

  update() {
    this.radius += 2;
    this.alpha -= 2;
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(2);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  // Create lines
  for (let i = 0; i < 50; i++) {
    lines.push(new Line());
  }

  // Create nodes
  for (let i = 0; i < 20; i++) {
    nodes.push(new Node());
  }
}

function draw() {
  background(10);

  // Draw ticker symbols
  fill(255);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < tickerSymbols.length; i++) {
    const x = map(i % 4, 0, 3, width * 0.1, width * 0.9);
    const y = map(floor(i / 4), 0, 1, height * 0.1, height * 0.9);
    text(tickerSymbols[i], x, y);
  }

  // Update and display lines
  for (let line of lines) {
    line.update();
    line.display();
  }

  // Display nodes
  for (let node of nodes) {
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

  frameCount++;
}

function mousePressed() {
  // Add a ring effect at the mouse position
  rings.push(new Ring(mouseX, mouseY));
}
