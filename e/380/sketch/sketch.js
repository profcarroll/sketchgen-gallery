let shapes = [];
let connections = [];
let trails = [];

class Shape {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
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
    if (this.trail.length > 20) this.trail.shift();
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);

    // Draw trail
    stroke(255, 100);
    noFill();
    beginShape();
    for (let p of this.trail) {
      vertex(p.x, p.y);
    }
    endShape();

    // Draw connections to nearby shapes
    for (let other of shapes) {
      if (other !== this) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < 150) {
          stroke(255, 50);
          line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        }
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  for (let i = 0; i < 10; i++) {
    shapes.push(new Shape());
  }

  // Initialize some static connections for a web-like effect
  for (let i = 0; i < 50; i++) {
    let from = random(shapes);
    let to = random(shapes);
    if (from !== to) {
      connections.push({ from, to });
    }
  }
}

function draw() {
  background(10, 10, 30);

  for (let shape of shapes) {
    shape.update();
    shape.display();
  }

  // Draw static webbing
  stroke(255, 30);
  noFill();
  beginShape(LINES);
  for (let conn of connections) {
    vertex(conn.from.pos.x, conn.from.pos.y);
    vertex(conn.to.pos.x, conn.to.pos.y);
  }
  endShape();

  // Occasionally add new trails
  if (random() < 0.1) {
    let newTrail = {
      pos: createVector(random(width), random(height)),
      size: random(5, 20),
      color: color(255, 255, 255, 100)
    };
    trails.push(newTrail);
  }

  // Update and draw trails
  for (let i = trails.length - 1; i >= 0; i--) {
    let t = trails[i];
    t.size *= 0.95;
    fill(t.color);
    noStroke();
    ellipse(t.pos.x, t.pos.y, t.size);

    if (t.size < 0.5) {
      trails.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
