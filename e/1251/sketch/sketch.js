let flockA = [];
let flockB = [];
const FLOCK_SIZE = 55;

class Boid {
  constructor(x, y, type) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 3.5));
    this.acc = createVector(0, 0);
    this.type = type; // 0 for amber, 1 for cyan
    this.maxSpeed = 3.5;
    this.maxForce = 0.12;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Toroidal wrapping with smooth margins
    let pad = 20;
    if (this.pos.x < -pad) this.pos.x = width + pad;
    if (this.pos.x > width + pad) this.pos.x = -pad;
    if (this.pos.y < -pad) this.pos.y = height + pad;
    if (this.pos.y > height + pad) this.pos.y = -pad;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  flock(myFlock, otherFlock) {
    let sep = createVector();
    let ali = createVector();
    let coh = createVector();
    let rep = createVector();

    let sepCount = 0;
    let aliCount = 0;
    let cohCount = 0;
    let repCount = 0;

    // Same-flock rules
    for (let other of myFlock) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (other !== this && d > 0) {
        if (d < 28) {
          let diff = p5.Vector.sub(this.pos, other.pos).normalize().div(d);
          sep.add(diff);
          sepCount++;
        }
        if (d < 65) {
          ali.add(other.vel);
          aliCount++;
          coh.add(other.pos);
          cohCount++;
        }
      }
    }

    // Inter-flock avoidance
    for (let enemy of otherFlock) {
      let d = p5.Vector.dist(this.pos, enemy.pos);
      if (d > 0 && d < 90) {
        let push = p5.Vector.sub(this.pos, enemy.pos).normalize().div(d);
        rep.add(push);
        repCount++;
      }
    }

    if (sepCount > 0) sep.div(sepCount).setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce * 1.5);
    if (aliCount > 0) ali.div(aliCount).setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce);
    if (cohCount > 0) {
      coh.div(cohCount).sub(this.pos).setMag(this.maxSpeed).sub(this.vel).limit(this.maxForce);
    }
    if (repCount > 0) {
      rep.div(repCount).setMag(this.maxSpeed * 1.4).sub(this.vel).limit(this.maxForce * 2.8);
    }

    this.applyForce(sep.mult(1.5));
    this.applyForce(ali.mult(1.0));
    this.applyForce(coh.mult(1.0));
    this.applyForce(rep.mult(2.5));
  }

  draw() {
    let angle = this.vel.heading() + HALF_PI;
    push();
    translate(this.pos.x, this.pos.y);
    rotate(angle);

    if (this.type === 0) {
      fill(245, 140, 45, 220); // Amber
    } else {
      fill(45, 205, 240, 220); // Cyan
    }

    beginShape();
    vertex(0, -9);
    vertex(-4, 6);
    vertex(0, 3);
    vertex(4, 6);
    endShape(CLOSE);
    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < FLOCK_SIZE; i++) {
    flockA.push(new Boid(random(width * 0.1, width * 0.45), random(height), 0));
    flockB.push(new Boid(random(width * 0.55, width * 0.9), random(height), 1));
  }
}

function draw() {
  // Semi-transparent wash for motion trails
  background(20, 24, 30, 80);

  for (let b of flockA) {
    b.flock(flockA, flockB);
    b.update();
    b.draw();
  }

  for (let b of flockB) {
    b.flock(flockB, flockA);
    b.update();
    b.draw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
