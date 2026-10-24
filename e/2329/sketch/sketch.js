let particles = [];
const numParticles = 200;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  for (let i = 0; i < numParticles; i++) {
    const angle = random(TWO_PI);
    const radius = random(150, 400);
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;

    particles.push({
      pos: createVector(x, y, 0),
      vel: createVector(0, 0, 0),
      acc: createVector(0, 0, 0),
      color: color(random(150, 255), random(150, 255), random(200, 255), 200),
      trail: [],
      trailLength: 40
    });
  }
}

function draw() {
  background(0, 0); // Deep black background

  time += 0.003;

  // Apply centripetal force to all particles
  for (let p of particles) {
    const dir = p5.Vector.sub(createVector(0, 0), p.pos);
    const distance = dir.mag();
    
    if (distance > 0) {
      dir.normalize();
      dir.mult(0.0005 * 100);
      p.acc.add(dir);
    }

    // Add subtle perturbation to orbital path
    const perturbation = sin(time + p.pos.x * 0.005 + p.pos.y * 0.005) * 0.001;
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
  beginShape(LINES);
  for (let p of particles) {
    for (let i = 0; i < p.trail.length - 1; i++) {
      const pos1 = p.trail[i];
      const pos2 = p.trail[i + 1];
      const alpha = map(i, 0, p.trail.length, 0, 200);
      stroke(red(p.color), green(p.color), blue(p.color), alpha);
      vertex(pos1.x, pos1.y, pos1.z);
      vertex(pos2.x, pos2.y, pos2.z);
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
}
