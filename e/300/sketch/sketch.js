let cells = [];
let maxCells = 500;
let separationSpeed = 1;

class Cell {
  constructor(x, y, color) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(15, 30);
    this.color = color;
    this.originalSize = this.size;
    this.growthRate = random(0.05, 0.1);
    this.divided = false;
    this.splitAngle = random(TWO_PI);
    this.splitSpeed = random(0.02, 0.05);
    this.stable = false;
  }

  update() {
    if (!this.divided) {
      // Grow until ready to divide
      this.size += this.growthRate;
      if (this.size > this.originalSize * 1.8 && cells.length < maxCells) {
        this.divide();
      }
    } else {
      // Move away from parent cell
      this.pos.add(this.vel);
      this.size *= 0.995;
      if (this.size < this.originalSize * 0.8) {
        this.stable = true;
      }
    }
  }

  divide() {
    this.divided = true;
    const angle1 = this.splitAngle + random(-PI/4, PI/4);
    const angle2 = this.splitAngle + random(PI - PI/4, PI + PI/4);

    const newCell1 = new Cell(
      this.pos.x + cos(angle1) * this.size,
      this.pos.y + sin(angle1) * this.size,
      this.color
    );
    newCell1.vel = p5.Vector.fromAngle(angle1).mult(separationSpeed);
    newCell1.splitAngle = angle1;

    const newCell2 = new Cell(
      this.pos.x + cos(angle2) * this.size,
      this.pos.y + sin(angle2) * this.size,
      this.color
    );
    newCell2.vel = p5.Vector.fromAngle(angle2).mult(separationSpeed);
    newCell2.splitAngle = angle2;

    cells.push(newCell1, newCell2);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  background(0);

  // Start with a few cells
  for (let i = 0; i < 5; i++) {
    const x = random(width);
    const y = random(height);
    const hue = random(360);
    cells.push(new Cell(x, y, color(hue, 80, 90)));
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect

  for (let i = cells.length - 1; i >= 0; i--) {
    cells[i].update();
    cells[i].display();

    // Remove cells that are too small or too far
    if (cells[i].size < 5 || cells[i].pos.mag() > 1000) {
      cells.splice(i, 1);
    }
  }

  // Add new cells occasionally to keep it dynamic
  if (random() < 0.02 && cells.length < maxCells) {
    const x = random(width);
    const y = random(height);
    const hue = random(360);
    cells.push(new Cell(x, y, color(hue, 80, 90)));
  }
}
