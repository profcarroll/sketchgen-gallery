let shapes = [];
let connections = [];
let trails = [];

class CosmicShape {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(10, 30);
    this.segments = floor(random(4, 8));
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.02, 0.02);
    this.color = color(random(100, 255), random(100, 255), random(200, 255), 200);
    this.trail = [];
    this.maxTrailLength = 20;
  }

  update() {
    this.pos.add(this.vel);
    this.rotation += this.rotationSpeed;

    // Bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    // Add current position to trail
    this.trail.push(this.pos.copy());
    if (this.trail.length > this.maxTrailLength) {
      this.trail.shift();
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);

    // Draw the crystalline shape
    fill(this.color);
    noStroke();
    beginShape();
    for (let i = 0; i < this.segments; i++) {
      let angle = map(i, 0, this.segments, 0, TWO_PI);
      let x = cos(angle) * this.size;
      let y = sin(angle) * this.size;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Draw internal luminescence
    fill(255, 200);
    noStroke();
    beginShape();
    for (let i = 0; i < this.segments; i++) {
      let angle = map(i, 0, this.segments, 0, TWO_PI) + this.rotation;
      let x = cos(angle) * this.size * 0.6;
      let y = sin(angle) * this.size * 0.6;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  displayTrail() {
    noFill();
    stroke(255, 100);
    strokeWeight(1);
    beginShape();
    for (let p of this.trail) {
      vertex(p.x, p.y);
    }
    endShape();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  frameRate(30);

  // Create initial shapes
  for (let i = 0; i < 15; i++) {
    shapes.push(new CosmicShape());
  }
}

function draw() {
  background(0);

  // Update and display shapes
  for (let shape of shapes) {
    shape.update();
    shape.display();
    shape.displayTrail();

    // Add connections between nearby shapes
    for (let other of shapes) {
      if (shape !== other) {
        let d = dist(shape.pos.x, shape.pos.y, other.pos.x, other.pos.y);
        if (d < 150) {
          connections.push({a: shape.pos, b: other.pos});
        }
      }
    }

    // Draw connections
    stroke(255, 80);
    strokeWeight(0.5);
    for (let c of connections) {
      line(c.a.x, c.a.y, c.b.x, c.b.y);
    }
    connections = [];
  }

  // Draw shadows
  for (let shape of shapes) {
    fill(0, 100);
    noStroke();
    push();
    translate(shape.pos.x, shape.pos.y);
    rotate(shape.rotation);
    beginShape();
    for (let i = 0; i < shape.segments; i++) {
      let angle = map(i, 0, shape.segments, 0, TWO_PI);
      let x = cos(angle) * shape.size;
      let y = sin(angle) * shape.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
