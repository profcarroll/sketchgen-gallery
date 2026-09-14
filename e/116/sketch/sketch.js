let streams = [];
let nodes = [];

class Stream {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.trail = [];
    this.maxTrailLength = 20;
    this.color = color(random(100, 255), random(100, 255), 255, 150);
    this.size = random(2, 6);
  }

  update() {
    this.pos.add(this.vel);
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }

    // Bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }

  display() {
    noFill();
    stroke(this.color);
    strokeWeight(this.size);

    // Draw trail
    beginShape();
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length, 0, 150);
      stroke(red(this.color), green(this.color), blue(this.color), alpha);
      vertex(this.trail[i].x, this.trail[i].y);
    }
    endShape();

    // Draw head
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size * 2);
  }
}

class Node {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(30, 60);
    this.color = color(100, 150, 255, 80);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function setup() {
  createCanvas(800, 600);
  colorMode(RGB);

  // Create nodes
  for (let i = 0; i < 30; i++) {
    nodes.push(new Node(random(width), random(height)));
  }

  // Create streams
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    streams.push(new Stream(x, y));
  }
}

function draw() {
  background(10, 10, 20);

  // Draw lattice lines
  stroke(50, 80, 150, 40);
  strokeWeight(0.5);
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let d = dist(nodes[i].pos.x, nodes[i].pos.y, nodes[j].pos.x, nodes[j].pos.y);
      if (d < 200) {
        line(nodes[i].pos.x, nodes[i].pos.y, nodes[j].pos.x, nodes[j].pos.y);
      }
    }
  }

  // Update and display streams
  for (let stream of streams) {
    stream.update();
    stream.display();
  }

  // Draw nodes
  for (let node of nodes) {
    node.display();
  }
}
