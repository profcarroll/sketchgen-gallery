let shapes = [];
let gridSize = 20;
let grid = [];
let mouseRadius = 100;

class Shape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 15);
    this.color = color(random(100, 255), random(100, 255), random(100, 255), 200);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.05, 0.05);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;

    // Bounce off edges
    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size, this.size);
    pop();
  }

  applyForce(force) {
    this.vx += force.x * 0.1;
    this.vy += force.y * 0.1;
  }
}

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 255);

  // Initialize grid
  for (let x = 0; x < width; x += gridSize) {
    grid[x] = [];
    for (let y = 0; y < height; y += gridSize) {
      if (random() > 0.3) {
        shapes.push(new Shape(x, y));
      }
    }
  }

  noStroke();
}

function draw() {
  background(20);

  // Mouse interaction
  let mouseForce = createVector(0, 0);
  for (let shape of shapes) {
    let d = dist(shape.x, shape.y, mouseX, mouseY);
    if (d < mouseRadius) {
      let force = p5.Vector.sub(createVector(mouseX, mouseY), createVector(shape.x, shape.y));
      force.normalize();
      force.mult(map(d, 0, mouseRadius, 2, 0));
      shape.applyForce(force);
    }
    shape.update();
    shape.display();
  }

  // Add some randomness to keep it chaotic
  if (frameCount % 30 === 0) {
    for (let i = 0; i < 5; i++) {
      let x = random(width);
      let y = random(height);
      shapes.push(new Shape(x, y));
    }
  }

  // Remove old shapes to keep it performant
  if (shapes.length > 1000) {
    shapes.splice(0, 100);
  }
}
