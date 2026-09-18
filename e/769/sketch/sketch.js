let nodes = [];
let connections = [];
const GRID_SIZE = 40;
const NODE_COUNT = 150;
const MAX_CONNECTIONS = 300;
let grid = [];

class Node {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(8, 20);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 200);
    this.pulse = random(TWO_PI);
  }

  update() {
    this.pos.add(this.vel);
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    this.pulse += 0.03;
  }

  display() {
    const pulseSize = this.size + sin(this.pulse) * 3;
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, pulseSize);
  }
}

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 255);
  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push(new Node());
  }
  initGrid();
}

function initGrid() {
  grid = [];
  for (let i = 0; i < width / GRID_SIZE + 1; i++) {
    grid[i] = [];
    for (let j = 0; j < height / GRID_SIZE + 1; j++) {
      grid[i][j] = [];
    }
  }
}

function updateGrid() {
  initGrid();
  for (let node of nodes) {
    const i = floor(node.pos.x / GRID_SIZE);
    const j = floor(node.pos.y / GRID_SIZE);
    if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
      grid[i][j].push(node);
    }
  }
}

function draw() {
  background(10, 5);

  updateGrid();
  connections = [];

  for (let node of nodes) {
    node.update();
    node.display();
  }

  for (let i = 0; i < nodes.length; i++) {
    const nodeA = nodes[i];
    const gridX = floor(nodeA.pos.x / GRID_SIZE);
    const gridY = floor(nodeA.pos.y / GRID_SIZE);

    for (let x = max(0, gridX - 1); x <= min(grid.length - 1, gridX + 1); x++) {
      for (let y = max(0, gridY - 1); y <= min(grid[0].length - 1, gridY + 1); y++) {
        for (let nodeB of grid[x][y]) {
          if (nodeA === nodeB) continue;
          const d = p5.Vector.dist(nodeA.pos, nodeB.pos);
          if (d < 120 && connections.length < MAX_CONNECTIONS) {
            connections.push([nodeA, nodeB]);
          }
        }
      }
    }
  }

  stroke(255, 100);
  noFill();
  for (let [a, b] of connections) {
    const alpha = map(p5.Vector.dist(a.pos, b.pos), 0, 120, 255, 30);
    stroke(255, alpha);
    const angle = atan2(b.pos.y - a.pos.y, b.pos.x - a.pos.x);
    const len = p5.Vector.dist(a.pos, b.pos);
    push();
    translate(a.pos.x, a.pos.y);
    rotate(angle);
    line(0, 0, len, 0);
    pop();
  }
}
