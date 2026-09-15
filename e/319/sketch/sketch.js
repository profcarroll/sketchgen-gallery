let marble;
let container;
let gravity;

function setup() {
  createCanvas(400, 600, WEBGL);
  gravity = createVector(0, 0.2);
  marble = new Marble(0, -200);
  container = new Container();
}

function draw() {
  background(20);
  container.display();
  marble.update();
  marble.display();
  marble.checkContainerCollision();
}

class Marble {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.radius = 10;
  }

  update() {
    this.vel.add(gravity);
    this.pos.add(this.vel);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, 0);
    noStroke();
    fill(255, 100, 100);
    sphere(this.radius);
    pop();
  }

  checkContainerCollision() {
    const containerRadius = 180;
    const distance = dist(this.pos.x, this.pos.y, 0, 0);

    if (distance + this.radius > containerRadius) {
      const normal = p5.Vector.sub(this.pos, createVector(0, 0)).normalize();
      const dot = this.vel.dot(normal);
      this.vel.sub(p5.Vector.mult(normal, 2 * dot));
      this.vel.mult(0.8); // damping
      this.pos = p5.Vector.add(createVector(0, 0), p5.Vector.mult(normal, containerRadius - this.radius));
    }
  }
}

class Container {
  constructor() {
    this.radius = 180;
    this.height = 400;
    this.segments = 100;
  }

  display() {
    push();
    stroke(200);
    noFill();
    for (let i = 0; i < this.segments; i++) {
      const angle = map(i, 0, this.segments, 0, TWO_PI);
      const x1 = cos(angle) * this.radius;
      const y1 = sin(angle) * this.radius;
      const x2 = cos(angle + TWO_PI / this.segments) * this.radius;
      const y2 = sin(angle + TWO_PI / this.segments) * this.radius;

      line(x1, y1, 0, x2, y2, 0);
    }
    pop();
  }
}
