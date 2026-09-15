let shapes = [];
let grid = [];
let cellSize = 40;
let cols, rows;
let pulse = 0;

class Shape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 30);
    this.growth = 0;
    this.maxGrowth = random(20, 50);
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
    this.burst = false;
    this.burstSize = 0;
    this.burstSpeed = random(2, 5);
  }

  update() {
    if (this.burst) {
      this.burstSize += this.burstSpeed;
      if (this.burstSize > 100) {
        this.burst = false;
      }
    } else {
      this.growth = min(this.growth + 0.5, this.maxGrowth);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    if (this.burst) {
      noStroke();
      fill(red(this.color), green(this.color), blue(this.color), 100);
      ellipse(0, 0, this.burstSize);
    } else {
      stroke(this.color);
      strokeWeight(2);
      noFill();
      ellipse(0, 0, this.size + this.growth);
      fill(this.color);
      noStroke();
      ellipse(0, 0, this.size * 0.5 + this.growth * 0.3);
    }
    pop();
  }

  interact(mouseX, mouseY) {
    let d = dist(this.x, this.y, mouseX, mouseY);
    if (d < 100 && !this.burst) {
      this.burst = true;
      this.burstSize = 0;
    }
  }
}

function setup() {
  createCanvas(800, 600);
  cols = ceil(width / cellSize);
  rows = ceil(height / cellSize);

  for (let y = 0; y < rows; y++) {
    grid[y] = [];
    for (let x = 0; x < cols; x++) {
      let px = x * cellSize + cellSize / 2;
      let py = y * cellSize + cellSize / 2;
      if (random() > 0.3) {
        grid[y][x] = new Shape(px, py);
        shapes.push(grid[y][x]);
      } else {
        grid[y][x] = null;
      }
    }
  }
}

function draw() {
  background(10, 10, 20);
  pulse = (pulse + 0.02) % TWO_PI;
  let p = sin(pulse) * 0.5 + 0.5;
  fill(255, 255, 255, 30);
  noStroke();
  rect(0, 0, width, height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x]) {
        grid[y][x].update();
        grid[y][x].display();
      }
    }
  }

  // Slowly move shapes around
  for (let shape of shapes) {
    shape.x += sin(frameCount * 0.01 + shape.y * 0.01) * 0.1;
    shape.y += cos(frameCount * 0.01 + shape.x * 0.01) * 0.1;
  }
}

function mouseMoved() {
  for (let shape of shapes) {
    shape.interact(mouseX, mouseY);
  }
}
