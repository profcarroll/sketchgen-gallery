let particles = [];
let springs = [];
let tensionLines = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create initial particles in a lattice pattern
  for (let i = 0; i < 150; i++) {
    let x = random(width);
    let y = random(height);
    let vx = random(-0.5, 0.5);
    let vy = random(-0.5, 0.5);
    particles.push({ x, y, vx, vy, prevX: x, prevY: y });
  }

  // Create springs between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let distance = sqrt(dx * dx + dy * dy);
      if (distance < 80) {
        springs.push({ i, j, restLength: distance });
      }
    }
  }

  // Initialize tension lines
  for (let i = 0; i < 50; i++) {
    tensionLines.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      strength: random(0.5, 1)
    });
  }
}

function draw() {
  background(0, 0, 10);
  time += 0.01;

  // Update particles with spring forces
  for (let i = 0; i < springs.length; i++) {
    let s = springs[i];
    let p1 = particles[s.i];
    let p2 = particles[s.j];
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;
    let distance = sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      let force = (distance - s.restLength) * 0.05;
      let tx = dx / distance * force;
      let ty = dy / distance * force;
      p1.vx += tx;
      p1.vy += ty;
      p2.vx -= tx;
      p2.vy -= ty;
    }
  }

  // Apply forces and update positions
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.prevX = p.x;
    p.prevY = p.y;
    p.x += p.vx;
    p.y += p.vy;

    // Boundary damping
    if (p.x < 0 || p.x > width) p.vx *= -0.8;
    if (p.y < 0 || p.y > height) p.vy *= -0.8;

    // Slow down particles
    p.vx *= 0.95;
    p.vy *= 0.95;
  }

  // Draw tension lines with dynamic strength
  stroke(200, 80, 100, 0.6);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < tensionLines.length; i++) {
    let t = tensionLines[i];
    let dx = t.x2 - t.x1;
    let dy = t.y2 - t.y1;
    let distance = sqrt(dx * dx + dy * dy);
    let strength = t.strength * (0.5 + 0.5 * sin(time + i));
    strokeWeight(strength * 2);

    // Update tension line positions
    t.x1 += (random(-1, 1) * 0.1) * strength;
    t.y1 += (random(-1, 1) * 0.1) * strength;
    t.x2 += (random(-1, 1) * 0.1) * strength;
    t.y2 += (random(-1, 1) * 0.1) * strength;

    vertex(t.x1, t.y1);
    vertex(t.x2, t.y2);
  }
  endShape();

  // Draw globular splines using particle positions
  stroke(180, 60, 90, 0.3);
  noFill();
  beginShape();
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    if (i === 0) {
      curveVertex(p.x, p.y);
    } else if (i === particles.length - 1) {
      curveVertex(p.x, p.y);
    } else {
      curveVertex(p.x, p.y);
    }
  }
  endShape(CLOSE);

  // Draw crystalline lattice lines
  stroke(240, 70, 95, 0.4);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let distance = sqrt(dx * dx + dy * dy);
      if (distance < 60) {
        vertex(particles[i].x, particles[i].y);
        vertex(particles[j].x, particles[j].y);
      }
    }
  }
  endShape();
}
