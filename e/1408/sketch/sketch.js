let particles = [];
const numParticles = 200;
let center;
let forceMagnitude = 0.001;

function setup() {
  createCanvas(windowWidth, windowHeight);
  center = createVector(width / 2, height / 2);

  for (let i = 0; i < numParticles; i++) {
    const angle = random(TWO_PI);
    const radius = random(50, 200);
    const x = center.x + cos(angle) * radius;
    const y = center.y + sin(angle) * radius;

    particles.push({
      pos: createVector(x, y),
      vel: createVector(0, 0),
      acc: createVector(0, 0),
      color: color(random(100, 255), random(100, 255), random(200, 255), 200),
      trail: []
    });
  }
}

function draw() {
  background(10);

  // Apply centripetal force to all particles
  for (let p of particles) {
    const dir = p5.Vector.sub(center, p.pos);
    const distance = dir.mag();
    if (distance > 0) {
      dir.normalize();
      dir.mult(forceMagnitude * 100);
      p.acc.add(dir);
    }

    // Update velocity and position
    p.vel.add(p.acc);
    p.pos.add(p.vel);

    // Add current position to trail
    p.trail.push(p.pos.copy());
    if (p.trail.length > 20) {
      p.trail.shift();
    }

    // Reset acceleration
    p.acc.mult(0);
  }

  // Draw trails and particles
  for (let p of particles) {
    noFill();
    stroke(p.color);
    beginShape();
    for (let pos of p.trail) {
      vertex(pos.x, pos.y);
    }
    endShape();

    fill(p.color);
    noStroke();
    ellipse(p.pos.x, p.pos.y, 6, 6);
  }

  // Draw central point
  fill(255, 200);
  noStroke();
  ellipse(center.x, center.y, 10, 10);
}

function mouseDragged() {
  const dragVector = createVector(mouseX - pmouseX, mouseY - pmouseY);
  forceMagnitude += dragVector.mag() * 0.000001;
  forceMagnitude = constrain(forceMagnitude, 0.0001, 0.01);
}
