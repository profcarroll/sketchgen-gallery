let shapes = [];
let trails = [];
const numShapes = 20;
const numTrailsPerShape = 5;

class CosmicShape {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.size = random(20, 60);
    this.color = color(random(100, 255), random(100, 255), random(255), 200);
    this.trail = [];
  }

  update() {
    this.pos.add(this.vel);
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    // Add current position to trail
    this.trail.push(this.pos.copy());
    if (this.trail.length > numTrailsPerShape * 2) {
      this.trail.shift();
    }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);

    // Draw trail
    for (let i = 0; i < this.trail.length - 1; i++) {
      const alpha = map(i, 0, this.trail.length - 1, 0, 100);
      const c = color(red(this.color), green(this.color), blue(this.color), alpha);
      stroke(c);
      line(this.trail[i].x, this.trail[i].y,
           this.trail[i+1].x, this.trail[i+1].y);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  for (let i = 0; i < numShapes; i++) {
    shapes.push(new CosmicShape());
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Very light fade for trails

  for (let shape of shapes) {
    shape.update();
    shape.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
