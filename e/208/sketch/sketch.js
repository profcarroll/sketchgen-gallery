let lines = [];
let nodes = [];
const NODE_COUNT = 100;
const LINE_COUNT = 200;
const MAX_CONNECTIONS_PER_FRAME = 300;

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 40);
    this.color = random() > 0.5 ? [255, 50, 50] : [50, 255, 50];
    this.pulse = 0;
    this.pulseSpeed = random(0.02, 0.05);
    this.pulseDirection = 1;
  }

  update() {
    this.pulse += this.pulseSpeed * this.pulseDirection;
    if (this.pulse > 1) {
      this.pulse = 1;
      this.pulseDirection = -1;
    } else if (this.pulse < 0) {
      this.pulse = 0;
      this.pulseDirection = 1;
    }
  }

  display() {
    const intensity = map(this.pulse, 0, 1, 0.5, 1);
    fill(this.color[0], this.color[1], this.color[2], 200 * intensity);
    noStroke();
    ellipse(this.x, this.y, this.size * intensity);
  }
}

class Line {
  constructor() {
    this.start = { x: random(width), y: random(height) };
    this.end = { x: random(width), y: random(height) };
    this.speed = random(0.1, 0.5);
    this.progress = 0;
    this.color = [255, 255, 255];
  }

  update() {
    this.progress += this.speed;
    if (this.progress > 1) {
      this.progress = 0;
      this.start = { x: random(width), y: random(height) };
      this.end = { x: random(width), y: random(height) };
    }
  }

  display() {
    const x1 = lerp(this.start.x, this.end.x, this.progress);
    const y1 = lerp(this.start.y, this.end.y, this.progress);
    const x2 = lerp(this.start.x, this.end.x, this.progress + 0.1);
    const y2 = lerp(this.start.y, this.end.y, this.progress + 0.1);

    stroke(this.color[0], this.color[1], this.color[2], 150);
    strokeWeight(1);
    line(x1, y1, x2, y2);
  }
}

function setup() {
  createCanvas(800, 600);
  colorMode(RGB);

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push(new Node(random(width), random(height)));
  }

  for (let i = 0; i < LINE_COUNT; i++) {
    lines.push(new Line());
  }
}

function draw() {
  background(10, 10, 20);

  // Update and display nodes
  for (let node of nodes) {
    node.update();
    node.display();
  }

  // Update and display lines
  for (let line of lines) {
    line.update();
    line.display();
  }

  // Connect lines to nearby nodes with pulse effect
  let connections = 0;
  for (let node of nodes) {
    for (let line of lines) {
      if (connections > MAX_CONNECTIONS_PER_FRAME) break;

      const x1 = lerp(line.start.x, line.end.x, line.progress);
      const y1 = lerp(line.start.y, line.end.y, line.progress);

      const d = dist(x1, y1, node.x, node.y);
      if (d < node.size * 1.5) {
        connections++;

        // Brighten line
        stroke(255, 255, 255, map(d, 0, node.size * 1.5, 255, 50));
        strokeWeight(2);

        // Draw connection from line to node
        lineToNode(x1, y1, node.x, node.y);
      }
    }
  }

  // Re-render all lines with normal intensity after connections
  for (let line of lines) {
    line.display();
  }
}

function lineToNode(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
}
