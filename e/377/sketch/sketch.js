let lines = [];
let nodes = [];
let glows = [];
let time = 0;

class Line {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.life = random(100, 300);
    this.color = color(random(100, 255), random(100, 255), 255, 150);
  }

  update() {
    this.pos.add(this.vel);
    this.life--;
    if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
      this.vel.mult(-1);
    }
  }

  draw() {
    stroke(this.color);
    point(this.pos.x, this.pos.y);
  }

  checkNode(node) {
    let d = dist(this.pos.x, this.pos.y, node.pos.x, node.pos.y);
    if (d < node.radius * 2) {
      return true;
    }
    return false;
  }
}

class Node {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.radius = random(10, 30);
    this.color = random() > 0.5 ? color(255, 0, 0, 200) : color(0, 255, 0, 200);
    this.pulse = 0;
  }

  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
    // Pulsing effect
    this.pulse += 0.1;
    let pulseRadius = this.radius + sin(this.pulse) * 5;
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 50);
    ellipse(this.pos.x, this.pos.y, pulseRadius * 2);
  }
}

class Glow {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.radius = 0;
    this.maxRadius = random(50, 100);
    this.life = 30;
    this.color = color(random(255), random(255), random(255), 100);
  }

  update() {
    this.radius += (this.maxRadius - this.radius) * 0.1;
    this.life--;
  }

  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  noCursor();

  // Create initial lines
  for (let i = 0; i < 100; i++) {
    lines.push(new Line());
  }

  // Create nodes
  for (let i = 0; i < 15; i++) {
    nodes.push(new Node());
  }
}

function draw() {
  background(10, 10, 20);

  time++;

  // Update and draw lines
  for (let i = lines.length - 1; i >= 0; i--) {
    let line = lines[i];
    line.update();
    line.draw();

    // Check node interaction
    for (let node of nodes) {
      if (line.checkNode(node)) {
        // Trigger flare effect
        glows.push(new Glow(line.pos.x, line.pos.y));
        // Intensify the line
        line.vel.mult(2);
        break;
      }
    }

    // Remove dead lines
    if (line.life <= 0) {
      lines.splice(i, 1);
    }
  }

  // Add new lines occasionally
  if (random() < 0.05) {
    lines.push(new Line());
  }

  // Update and draw nodes
  for (let node of nodes) {
    node.draw();
  }

  // Update and draw glows
  for (let i = glows.length - 1; i >= 0; i--) {
    let glow = glows[i];
    glow.update();
    glow.draw();

    if (glow.life <= 0) {
      glows.splice(i, 1);
    }
  }

  // Add some movement to nodes occasionally
  if (random() < 0.01) {
    for (let node of nodes) {
      node.pos.add(p5.Vector.random2D().mult(5));
      node.pos.x = constrain(node.pos.x, 0, width);
      node.pos.y = constrain(node.pos.y, 0, height);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
