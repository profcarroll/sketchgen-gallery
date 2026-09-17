let pixels = [];
let lattices = [];
let gridSize = 20;
let grid = [];

class Pixel {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 6);
    this.color = color(random(100, 255), random(100, 255), random(100, 255));
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.life = random(100, 300);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}

class Lattice {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.pulse = 0;
    this.active = true;
    this.size = random(30, 60);
    this.points = [];
    this.generatePoints();
  }

  generatePoints() {
    const numPoints = 12;
    for (let i = 0; i < numPoints; i++) {
      const angle = map(i, 0, numPoints, 0, TWO_PI);
      const radius = this.size * 0.5;
      const px = this.x + cos(angle) * radius;
      const py = this.y + sin(angle) * radius;
      this.points.push({ x: px, y: py });
    }
  }

  update() {
    this.pulse += 0.05;
    if (this.pulse > TWO_PI) {
      this.active = false;
    }
  }

  display() {
    const scale = 1 + sin(this.pulse) * 0.5;
    stroke(255, 200);
    noFill();
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const px = point.x;
      const py = point.y;
      vertex(px, py);
    }
    endShape(CLOSE);

    // Connect points with lines
    stroke(255, 100);
    for (let i = 0; i < this.points.length; i++) {
      const a = this.points[i];
      const b = this.points[(i + 1) % this.points.length];
      line(a.x, a.y, b.x, b.y);
    }
  }
}

function setup() {
  createCanvas(600, 400);
  pixelDensity(1);

  // Initialize pixels
  for (let i = 0; i < 300; i++) {
    pixels.push(new Pixel(random(width), random(height)));
  }

  // Initialize grid
  const cols = ceil(width / gridSize);
  const rows = ceil(height / gridSize);
  grid = new Array(cols);
  for (let x = 0; x < cols; x++) {
    grid[x] = new Array(rows).fill(0);
  }
}

function draw() {
  background(0);

  // Update and display pixels
  for (let i = 0; i < pixels.length; i++) {
    pixels[i].update();
    pixels[i].display();
  }

  // Create lattices occasionally
  if (frameCount % 120 === 0 && lattices.length < 5) {
    const x = random(100, width - 100);
    const y = random(100, height - 100);
    lattices.push(new Lattice(x, y));
  }

  // Update and display lattices
  for (let i = lattices.length - 1; i >= 0; i--) {
    lattices[i].update();
    lattices[i].display();

    if (!lattices[i].active) {
      lattices.splice(i, 1);
    }
  }

  // Simple grid-based spatial hashing for pixel interactions
  const cellSize = 30;
  for (let x = 0; x < width; x += cellSize) {
    for (let y = 0; y < height; y += cellSize) {
      const cellPixels = [];
      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];
        if (p.x >= x && p.x < x + cellSize && p.y >= y && p.y < y + cellSize) {
          cellPixels.push(p);
        }
      }

      // Connect nearby pixels
      for (let a = 0; a < cellPixels.length; a++) {
        for (let b = a + 1; b < cellPixels.length; b++) {
          const p1 = cellPixels[a];
          const p2 = cellPixels[b];
          const d = dist(p1.x, p1.y, p2.x, p2.y);
          if (d < 30) {
            stroke(255, 30);
            line(p1.x, p1.y, p2.x, p2.y);
          }
        }
      }
    }
  }
}
