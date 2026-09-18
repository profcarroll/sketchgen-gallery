let cells = [];
let trails = [];
const cellCount = 500;
const trailLength = 100;

class Cell {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(2, 6);
    this.color = color(random(100, 255), random(100, 255), 255, 200);
    this.trail = [];
  }

  update() {
    this.pos.add(this.vel);
    
    // Bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    // Add current position to trail
    this.trail.push(this.pos.copy());
    if (this.trail.length > trailLength) {
      this.trail.shift();
    }
  }

  display() {
    // Draw trail
    noFill();
    stroke(this.color);
    strokeWeight(1);
    beginShape();
    for (let p of this.trail) {
      vertex(p.x, p.y);
    }
    endShape();

    // Draw cell
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  
  for (let i = 0; i < cellCount; i++) {
    cells.push(new Cell());
  }
}

function draw() {
  background(0, 0, 0, 30); // Semi-transparent background for trail fading
  
  for (let cell of cells) {
    cell.update();
    cell.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
