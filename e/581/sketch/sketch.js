let microbes = [];
let flowField;
let resolution = 20;
let cols, rows;

function setup() {
  createCanvas(600, 600);
  cols = width / resolution;
  rows = height / resolution;
  flowField = new Array(cols * rows);
  
  for (let i = 0; i < 500; i++) {
    microbes.push(new Microbe(random(width), random(height)));
  }
}

function draw() {
  background(20, 30, 40);
  
  updateFlowField();
  renderFlowField();
  
  for (let microbe of microbes) {
    microbe.update();
    microbe.display();
  }
}

function updateFlowField() {
  let time = millis() * 0.0005;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(x * 0.02, y * 0.02, time) * TWO_PI * 2;
      flowField[index] = p5.Vector.fromAngle(angle);
    }
  }
}

function renderFlowField() {
  stroke(100, 150, 200, 30);
  noFill();
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let v = flowField[index];
      push();
      translate(x * resolution, y * resolution);
      rotate(v.heading());
      line(0, 0, resolution * 0.5, 0);
      pop();
    }
  }
}

class Microbe {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.size = random(2, 6);
    this.lifespan = 255;
    this.color = color(random(100, 255), random(150, 255), random(200, 255), 200);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    let x = floor(this.pos.x / resolution);
    let y = floor(this.pos.y / resolution);
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      let index = x + y * cols;
      let force = flowField[index];
      this.applyForce(force);
    }

    this.lifespan -= 0.5;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}
