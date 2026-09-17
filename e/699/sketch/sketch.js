let flock1, flock2;
let particles = [];

class Particle {
  constructor(x, y, color) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 2));
    this.acc = createVector(0, 0);
    this.color = color;
    this.size = random(4, 8);
    this.maxSpeed = random(2, 4);
    this.maxForce = 0.05;
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  flock(particles) {
    let sep = this.separate(particles);
    let ali = this.align(particles);
    let coh = this.cohesion(particles);

    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  separate(particles) {
    let steer = createVector(0, 0);
    let count = 0;
    for (let other of particles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < 50) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count);
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }

    return steer;
  }

  align(particles) {
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of particles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < 80) {
        sum.add(other.vel);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  cohesion(particles) {
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of particles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < 80) {
        sum.add(other.pos);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    } else {
      return createVector(0, 0);
    }
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    let d = desired.mag();
    if (d > 0) {
      desired.normalize();
      if (d < 100) {
        desired.mult(map(d, 0, 100, 0, this.maxSpeed));
      } else {
        desired.mult(this.maxSpeed);
      }

      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  checkEdges() {
    if (this.pos.x > width) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = height;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create two flocks
  flock1 = [];
  flock2 = [];

  for (let i = 0; i < 150; i++) {
    flock1.push(new Particle(random(width), random(height), color(255, 100, 100, 200)));
    flock2.push(new Particle(random(width), random(height), color(100, 150, 255, 200)));
  }
}

function draw() {
  background(20);

  // Update and display flock1
  for (let p of flock1) {
    p.flock(flock1);
    p.update();
    p.checkEdges();
  }

  // Update and display flock2
  for (let p of flock2) {
    p.flock(flock2);
    p.update();
    p.checkEdges();
  }

  // Apply avoidance between flocks
  for (let p1 of flock1) {
    for (let p2 of flock2) {
      let d = p5.Vector.dist(p1.pos, p2.pos);
      if (d > 0 && d < 80) {
        let diff = p5.Vector.sub(p1.pos, p2.pos);
        diff.normalize();
        diff.div(d); // Weight by distance
        p1.applyForce(diff.mult(0.5));
        p2.applyForce(diff.mult(-0.5));
      }
    }
  }

  // Draw all particles
  for (let p of flock1) {
    p.display();
  }

  for (let p of flock2) {
    p.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
