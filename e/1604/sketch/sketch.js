let planes = [];
const numPlanes = 150;
const flockingRadius = 80;
const separationDistance = 25;
const maxSpeed = 2;
const maxForce = 0.05;
let target;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize paper airplane shapes
  for (let i = 0; i < numPlanes; i++) {
    planes.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(1, maxSpeed)),
      acc: createVector(0, 0),
      size: random(8, 14),
      angle: random(TWO_PI)
    });
  }
  target = createVector(width / 2, height / 2);
}

function draw() {
  background(240);

  // Update target to follow mouse
  target.set(mouseX, mouseY);

  for (let plane of planes) {
    // Apply flocking behaviors
    let sep = separate(plane);
    let ali = align(plane);
    let coh = cohesion(plane);
    let arr = arrive(plane, target);

    // Weight the forces
    sep.mult(2.5);
    ali.mult(1.0);
    coh.mult(1.0);
    arr.mult(1.5);

    // Apply forces
    plane.acc.add(sep);
    plane.acc.add(ali);
    plane.acc.add(coh);
    plane.acc.add(arr);

    // Update velocity and position
    plane.vel.add(plane.acc);
    plane.vel.limit(maxSpeed);
    plane.pos.add(plane.vel);
    plane.acc.mult(0);

    // Wrap around edges
    if (plane.pos.x > width + 20) plane.pos.x = -20;
    else if (plane.pos.x < -20) plane.pos.x = width + 20;
    if (plane.pos.y > height + 20) plane.pos.y = -20;
    else if (plane.pos.y < -20) plane.pos.y = height + 20;

    // Draw the paper airplane
    push();
    translate(plane.pos.x, plane.pos.y);
    rotate(plane.vel.heading());
    fill(255);
    stroke(0);
    strokeWeight(1);
    beginShape();
    vertex(plane.size, 0);
    vertex(-plane.size/2, -plane.size/3);
    vertex(-plane.size/2, plane.size/3);
    endShape(CLOSE);
    pop();
  }
}

function separate(plane) {
  let steer = createVector(0, 0);
  let count = 0;
  for (let other of planes) {
    let d = p5.Vector.dist(plane.pos, other.pos);
    if (d > 0 && d < separationDistance) {
      let diff = p5.Vector.sub(plane.pos, other.pos);
      diff.normalize();
      diff.div(d); // Weight by distance
      steer.add(diff);
      count++;
    }
  }

  if (count > 0) {
    steer.div(count);
    steer.normalize();
    steer.mult(maxSpeed);
    steer.sub(plane.vel);
    steer.limit(maxForce);
  }

  return steer;
}

function align(plane) {
  let sum = createVector(0, 0);
  let count = 0;
  for (let other of planes) {
    let d = p5.Vector.dist(plane.pos, other.pos);
    if (d > 0 && d < flockingRadius) {
      sum.add(other.vel);
      count++;
    }
  }

  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(maxSpeed);
    let steer = p5.Vector.sub(sum, plane.vel);
    steer.limit(maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

function cohesion(plane) {
  let sum = createVector(0, 0);
  let count = 0;
  for (let other of planes) {
    let d = p5.Vector.dist(plane.pos, other.pos);
    if (d > 0 && d < flockingRadius) {
      sum.add(other.pos);
      count++;
    }
  }

  if (count > 0) {
    sum.div(count);
    return arrive(plane, sum);
  } else {
    return createVector(0, 0);
  }
}

function arrive(plane, target) {
  let desired = p5.Vector.sub(target, plane.pos);
  let d = desired.mag();
  if (d > 0) {
    desired.normalize();
    if (d < 100) {
      let m = map(d, 0, 100, 0, maxSpeed);
      desired.mult(m);
    } else {
      desired.mult(maxSpeed);
    }
    let steer = p5.Vector.sub(desired, plane.vel);
    steer.limit(maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
