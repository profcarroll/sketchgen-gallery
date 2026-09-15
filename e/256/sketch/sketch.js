let cells = [];
const cellCount = 20;
let grid = [];

class Cell {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.size = random(10, 20);
    this.growthRate = random(0.1, 0.3);
    this.maxSize = random(40, 60);
    this.dividing = false;
    this.constriction = 0;
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
  }

  update() {
    if (!this.dividing) {
      this.size += this.growthRate;
      if (this.size > this.maxSize) {
        this.dividing = true;
        this.constriction = 0;
      }
    } else {
      this.constriction += 0.1;
      if (this.constriction > 1) {
        this.divide();
      }
    }
  }

  divide() {
    const daughter1 = new Cell(this.pos.x, this.pos.y);
    const daughter2 = new Cell(this.pos.x, this.pos.y);
    daughter1.size = this.size / 2;
    daughter2.size = this.size / 2;
    daughter1.pos.add(createVector(random(-5, 5), random(-5, 5)));
    daughter2.pos.add(createVector(random(-5, 5), random(-5, 5)));
    cells.push(daughter1);
    cells.push(daughter2);
    this.size = 0;
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(this.color);
    if (this.dividing) {
      ellipse(0, 0, this.size * (1 - this.constriction));
      fill(color(red(this.color), green(this.color), blue(this.color), 100));
      ellipse(0, 0, this.size * (0.5 - this.constriction / 2));
    } else {
      ellipse(0, 0, this.size);
    }
    pop();
  }
}

function setup() {
  createCanvas(600, 400);
  for (let i = 0; i < cellCount; i++) {
    cells.push(new Cell(random(width), random(height)));
  }
}

function draw() {
  background(20);

  for (let i = 0; i < cells.length; i++) {
    cells[i].update();
    cells[i].display();

    if (cells[i].size <= 0) {
      cells.splice(i, 1);
      i--;
    }
  }
}
