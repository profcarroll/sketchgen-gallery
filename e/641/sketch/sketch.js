let cells = [];
let connections = [];
let bgPulse = 0;
const CELL_COUNT = 150;
const MAX_CONNECTIONS = 300;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 0;
    this.maxLife = random(100, 200);
    this.growth = 0;
    this.decay = 0;
    this.color = color(random(100, 255), random(100, 255), 255, 200);
    this.size = 0;
  }

  update() {
    if (this.life < this.maxLife) {
      this.growth += 0.02;
      this.size = map(this.growth, 0, 1, 0, 8);
    } else {
      this.decay += 0.01;
      this.size = map(this.decay, 0, 1, 8, 0);
    }
    this.life++;
    return this.life < this.maxLife * 1.5;
  }

  draw() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  for (let i = 0; i < CELL_COUNT; i++) {
    cells.push(new Cell(random(width), random(height)));
  }
}

function draw() {
  bgPulse += 0.01;
  background(0, 0, 10 + sin(bgPulse) * 5);
  
  // Update and draw connections
  connections = [];
  for (let i = 0; i < cells.length; i++) {
    for (let j = i + 1; j < cells.length; j++) {
      let d = dist(cells[i].x, cells[i].y, cells[j].x, cells[j].y);
      if (d < 150) {
        connections.push([i, j]);
      }
    }
  }

  // Draw connections
  stroke(255, 100);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < min(connections.length, MAX_CONNECTIONS); i++) {
    let [a, b] = connections[i];
    vertex(cells[a].x, cells[a].y);
    vertex(cells[b].x, cells[b].y);
  }
  endShape();

  // Update and draw cells
  for (let i = cells.length - 1; i >= 0; i--) {
    if (!cells[i].update()) {
      cells.splice(i, 1);
      if (cells.length < CELL_COUNT * 0.7) {
        cells.push(new Cell(random(width), random(height)));
      }
    } else {
      cells[i].draw();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
