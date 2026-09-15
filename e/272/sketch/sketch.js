let time = 0;
let particles = [];
const numParticles = 300;
const hexRadius = 250;
const hexPoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
  noStroke();

  // Precompute hexagon points
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI * i / 6;
    hexPoints.push(createVector(
      width/2 + hexRadius * cos(angle),
      height/2 + hexRadius * sin(angle)
    ));
  }

  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      pos: createVector(random(width), random(height)),
      vel: p5.Vector.random2D().mult(random(0.5, 2)),
      size: random(2, 6),
      hue: random(1),
      life: 1
    });
  }
}

function draw() {
  background(0);
  time += 0.005;

  // Draw hexagon boundary
  push();
  translate(width/2, height/2);
  rotate(time * 0.2);
  fill(0, 0, 0, 0.1);
  stroke(0.5, 0.8, 0.9);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < 6; i++) {
    const v = hexPoints[i];
    vertex(v.x - width/2, v.y - height/2);
  }
  endShape(CLOSE);
  pop();

  // Update and draw particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Move particle
    p.pos.add(p.vel);

    // Boundary check with hexagon
    if (!isInsideHexagon(p.pos)) {
      p.pos.x = random(width);
      p.pos.y = random(height);
    }

    // Particle behavior
    const angle = atan2(p.pos.y - height/2, p.pos.x - width/2);
    p.vel.rotate(0.01 * sin(time + angle));

    // Color transition
    p.hue += 0.001;
    if (p.hue > 1) p.hue = 0;

    // Draw particle
    fill(p.hue, 0.8, 0.9, 0.7);
    noStroke();
    ellipse(p.pos.x, p.pos.y, p.size);

    // Connect particles with lines if close enough
    for (let j = i + 1; j < particles.length; j++) {
      const other = particles[j];
      const d = dist(p.pos.x, p.pos.y, other.pos.x, other.pos.y);
      if (d < 80) {
        stroke(p.hue, 0.7, 0.8, 0.2);
        line(p.pos.x, p.pos.y, other.pos.x, other.pos.y);
      }
    }
  }

  // Draw central kaleidoscopic pattern
  push();
  translate(width/2, height/2);
  rotate(time * 0.5);
  for (let i = 0; i < 12; i++) {
    const angle = TWO_PI * i / 12;
    const x = cos(angle) * 100;
    const y = sin(angle) * 100;
    const size = 30 + 20 * sin(time * 2 + angle);
    
    fill((time * 0.1 + i * 0.1) % 1, 0.8, 0.9, 0.5);
    ellipse(x, y, size, size);
  }
  pop();
}

function isInsideHexagon(point) {
  // Simple point-in-polygon check using ray casting
  let inside = false;
  for (let i = 0, j = hexPoints.length - 1; i < hexPoints.length; j = i++) {
    const xi = hexPoints[i].x;
    const yi = hexPoints[i].y;
    const xj = hexPoints[j].x;
    const yj = hexPoints[j].y;

    if (((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
