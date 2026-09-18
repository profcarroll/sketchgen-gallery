let cells = [];
let trails = [];
const CELL_COUNT = 200;
const TRAIL_LENGTH = 30;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 1.0;
    this.decay = random(0.001, 0.005);
    this.size = random(5, 15);
    this.color = color(random(100, 255), random(100, 255), 255, 200);
    this.trail = [];
  }

  update() {
    if (this.life > 0) {
      this.life -= this.decay;
    } else {
      // Add to trails when dead
      if (this.trail.length < TRAIL_LENGTH) {
        this.trail.push({x: this.x, y: this.y});
      }
    }

    // Random movement
    this.x += random(-0.5, 0.5);
    this.y += random(-0.5, 0.5);

    // Keep within bounds
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  display() {
    if (this.life > 0) {
      fill(this.color);
      noStroke();
      ellipse(this.x, this.y, this.size * this.life);
    } else {
      // Draw trail
      for (let i = 0; i < this.trail.length; i++) {
        const t = this.trail[i];
        const alpha = map(i, 0, this.trail.length, 0, 100);
        fill(red(this.color), green(this.color), blue(this.color), alpha);
        noStroke();
        ellipse(t.x, t.y, this.size * (i / this.trail.length));
      }
    }
  }
}

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < CELL_COUNT; i++) {
    cells.push(new Cell(random(width), random(height)));
  }
}

function draw() {
  background(10, 10, 20);

  // Update and display cells
  for (let cell of cells) {
    cell.update();
    cell.display();

    // Connect to nearby cells
    for (let other of cells) {
      if (cell !== other) {
        const d = dist(cell.x, cell.y, other.x, other.y);
        if (d < 100) {
          stroke(255, 100);
          strokeWeight(map(d, 0, 100, 0.5, 0));
          line(cell.x, cell.y, other.x, other.y);
        }
      }
    }

    // Occasionally create new cell
    if (random() < 0.001) {
      cells.push(new Cell(random(width), random(height)));
    }

    // Remove dead cells that have decayed
    if (cell.life <= 0 && cell.trail.length >= TRAIL_LENGTH) {
      cells.splice(cells.indexOf(cell), 1);
    }
  }
}
