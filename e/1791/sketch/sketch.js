let particles = [];
const numParticles = 300;
let center;
let forceMagnitude = 0.001;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  center = createVector(0, 0);

  for (let i = 0; i < numParticles; i++) {
    const angle = random(TWO_PI);
    const radius = random(100, 300);
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;

    particles.push({
      pos: createVector(x, y, 0),
      vel: createVector(0, 0, 0),
      acc: createVector(0, 0, 0),
      color: color(random(100, 255), random(100, 255), random(200, 255), 180),
      trail: [],
      trailLength: 40
    });
  }
}

function draw() {
  background(10, 30); // Dark background with slight fade for trails

  time += 0.005;

  // Apply centripetal force to all particles
  for (let p of particles) {
    const dir = p5.Vector.sub(center, p.pos);
    const distance = dir.mag();
    
    if (distance > 0) {
      dir.normalize();
      dir.mult(forceMagnitude * 100);
      p.acc.add(dir);
    }

    // Add subtle perturbation to orbital path
    const perturbation = sin(time + p.pos.x * 0.01 + p.pos.y * 0.01) * 0.002;
    p.acc.x += perturbation;
    p.acc.y += perturbation;

    // Update velocity and position
    p.vel.add(p.acc);
    p.pos.add(p.vel);

    // Add current position to trail
    p.trail.push(p.pos.copy());
    if (p.trail.length > p.trailLength) {
      p.trail.shift();
    }

    // Reset acceleration
    p.acc.mult(0);
  }

  // Draw trails and particles in batches
  beginShape(POINTS);
  for (let p of particles) {
    for (let i = 0; i < p.trail.length; i++) {
      const pos = p.trail[i];
      const alpha = map(i, 0, p.trail.length, 0, 180);
      stroke(red(p.color), green(p.color), blue(p.color), alpha);
      vertex(pos.x, pos.y, pos.z);
    }
  }
  endShape();

  // Draw particles as points
  beginShape(POINTS);
  for (let p of particles) {
    fill(p.color);
    noStroke();
    vertex(p.pos.x, p.pos.y, p.pos.z);
  }
  endShape();

  // Draw central point
  fill(255, 200);
  noStroke();
  push();
  translate(center.x, center.y, center.z);
  sphere(4);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
}
