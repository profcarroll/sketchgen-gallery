let nodes = [];
let lines = [];
let rings = [];

class Node {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.radius = random(3, 7);
    this.color = random([color(255, 50, 50), color(50, 255, 50)]);
    this.vx = random(-0.5, 0.5);
    this.vy = random(-0.5, 0.5);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.radius * 2);
  }
}

class Line {
  constructor() {
    this.x1 = random(width);
    this.y1 = random(height);
    this.x2 = random(width);
    this.y2 = random(height);
    this.vx1 = random(-0.3, 0.3);
    this.vy1 = random(-0.3, 0.3);
    this.vx2 = random(-0.3, 0.3);
    this.vy2 = random(-0.3, 0.3);
    this.color = color(200, 200, 200, 150);
  }

  update() {
    this.x1 += this.vx1;
    this.y1 += this.vy1;
    this.x2 += this.vx2;
    this.y2 += this.vy2;

    if (this.x1 < 0 || this.x1 > width) this.vx1 *= -1;
    if (this.y1 < 0 || this.y1 > height) this.vy1 *= -1;
    if (this.x2 < 0 || this.x2 > width) this.vx2 *= -1;
    if (this.y2 < 0 || this.y2 > height) this.vy2 *= -1;
  }

  display() {
    stroke(this.color);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}

class Ring {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.alpha = 255;
  }

  update() {
    this.radius += 3;
    this.alpha -= 5;
  }

  display() {
    noFill();
    stroke(255, 255, 200, this.alpha);
    ellipse(this.x, this.y, this.radius * 2);
  }
}

function setup() {
  createCanvas(600, 400);

  for (let i = 0; i < 15; i++) {
    nodes.push(new Node());
  }

  for (let i = 0; i < 10; i++) {
    lines.push(new Line());
  }
}

function draw() {
  background(20);

  // Update and display lines
  for (let line of lines) {
    line.update();
    line.display();

    // Check collision with nodes
    for (let node of nodes) {
      let d = dist(line.x1, line.y1, node.x, node.y);
      if (d < node.radius + 5) {
        rings.push(new Ring(node.x, node.y));
      }
    }
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
}
