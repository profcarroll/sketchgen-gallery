let hexagonVertices;
let time = 0;
let particles = [];
let lines = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Precompute hexagon vertices
  hexagonVertices = [];
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI * i / 6;
    hexagonVertices.push(createVector(cos(angle), sin(angle)));
  }

  // Initialize particles
  for (let i = 0; i < 200; i++) {
    particles.push({
      pos: createVector(random(-1, 1), random(-1, 1)),
      vel: p5.Vector.random2D().mult(random(0.001, 0.005)),
      size: random(2, 8),
      color: color(random(100, 255), random(100, 255), random(200, 255), 180)
    });
  }

  // Precompute lines
  for (let i = 0; i < 300; i++) {
    lines.push({
      a: p5.Vector.random2D(),
      b: p5.Vector.random2D(),
      alpha: random(0.1, 0.4)
    });
  }
}

function draw() {
  background(0);
  time += 0.002;

  // Rotate the whole scene
  rotateX(time * 0.2);
  rotateY(time * 0.3);

  // Draw kaleidoscopic effect using hexagonal mask
  push();
  stroke(255, 100);
  noFill();
  beginShape();
  for (let i = 0; i < 6; i++) {
    const v = hexagonVertices[i];
    vertex(v.x * 200, v.y * 200);
  }
  endShape(CLOSE);
  pop();

  // Draw fractal network
  stroke(255, 150);
  noFill();
  beginShape(LINES);
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const a = l.a.copy().mult(100);
    const b = l.b.copy().mult(100);

    // Animate the line positions
    a.rotate(time * 0.5 + i * 0.1);
    b.rotate(time * 0.7 + i * 0.1);

    vertex(a.x, a.y, a.z);
    vertex(b.x, b.y, b.z);
  }
  endShape();

  // Update and draw particles
  for (let p of particles) {
    // Move the particle
    p.pos.add(p.vel);

    // Wrap around edges
    if (p.pos.mag() > 1.2) {
      p.pos.normalize().mult(1.2);
      p.vel.mult(-1);
    }

    // Animate particle color and size
    const hue = (time * 50 + p.pos.x * 100) % 360;
    fill(hue, 100, 255, 180);
    noStroke();
    push();
    translate(p.pos.x * 100, p.pos.y * 100, 0);
    sphere(p.size);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
