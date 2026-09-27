let particles = [];
const numParticles = 300;
let center;
let forceMagnitude = 0.001;

function setup() {
  createCanvas(windowWidth, windowHeight);
  center = createVector(width / 2, height / 2);

  for (let i = 0; i < numParticles; i++) {
    const angle = random(TWO_PI);
    const radius = random(100, 300);
    const x = center.x + cos(angle) * radius;
    const y = center.y + sin(angle) * radius;

    particles.push({
      pos: createVector(x, y),
      vel: createVector(0, 0),
      acc: createVector(0, 0),
      color: color(random(100, 255), random(100, 255), random(200, 255), 180),
      trail: [],
      trailLength: 40,
      decay: []
    });
  }
}

function draw() {
  background(10, 30); // Dark background with slight fade for trails

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
    if (p.trail.length > p.trailLength) {
      p.trail.shift();
    }

    // Add decayed particles
    p.decay.push({
      pos: p.pos.copy(),
      color: color(red(p.color), green(p.color), blue(p.color), 200),
      size: random(0.5, 1.5),
      age: 0
    });

    if (p.decay.length > 20) {
      p.decay.shift();
    }

    // Reset acceleration
    p.acc.mult(0);
  }

  // Draw trails and particles
  for (let p of particles) {
    noFill();
    
    // Draw trail with fading opacity
    beginShape();
    for (let i = 0; i < p.trail.length; i++) {
      const pos = p.trail[i];
      const alpha = map(i, 0, p.trail.length, 0, 180);
      stroke(red(p.color), green(p.color), blue(p.color), alpha);
      vertex(pos.x, pos.y);
    }
    endShape();

    // Draw particle
    fill(p.color);
    noStroke();
    ellipse(p.pos.x, p.pos.y, 3, 3);

    // Draw decayed particles
    for (let d of p.decay) {
      d.age++;
      const alpha = map(d.age, 0, 20, 200, 0);
      fill(red(d.color), green(d.color), blue(d.color), alpha);
      noStroke();
      ellipse(d.pos.x, d.pos.y, d.size, d.size);
    }
  }

  // Draw central point
  fill(255, 200);
  noStroke();
  ellipse(center.x, center.y, 6, 6);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  center.set(width / 2, height / 2);
}
