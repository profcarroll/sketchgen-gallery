let particles = [];
let flowers = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Create some abstract flower shapes
  for (let i = 0; i < 20; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let size = random(30, 80);
    flowers.push({x, y, size});
  }

  // Create initial particles
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      speed: random(0.5, 2),
      size: random(2, 6)
    });
  }
}

function draw() {
  background(10, 20, 30);

  // Animate particles
  for (let p of particles) {
    p.x += sin(frameCount * 0.01 + p.z * 0.01) * p.speed;
    p.y += cos(frameCount * 0.01 + p.z * 0.01) * p.speed;
    p.z += random(-1, 1);

    // Wrap around edges
    if (p.x > width/2 + 100) p.x = -width/2 - 100;
    if (p.x < -width/2 - 100) p.x = width/2 + 100;
    if (p.y > height/2 + 100) p.y = -height/2 - 100;
    if (p.y < -height/2 - 100) p.y = height/2 + 100;

    fill(255, 200, 100, 180);
    push();
    translate(p.x, p.y, p.z);
    sphere(p.size);
    pop();
  }

  // Draw flowers
  for (let f of flowers) {
    let hue = (frameCount * 0.5 + f.x * 0.1) % 360;
    fill(hue, 80, 90, 200);
    push();
    translate(f.x, f.y, 0);
    sphere(f.size);
    pop();

    // Draw petals
    for (let i = 0; i < 5; i++) {
      let angle = TWO_PI * i / 5;
      let px = f.x + cos(angle) * f.size * 1.2;
      let py = f.y + sin(angle) * f.size * 1.2;
      fill(hue, 90, 80, 180);
      push();
      translate(px, py, 0);
      sphere(f.size * 0.6);
      pop();
    }
  }

  // Connect particles to flowers
  for (let p of particles) {
    for (let f of flowers) {
      let d = dist(p.x, p.y, f.x, f.y);
      if (d < f.size * 2) {
        stroke(255, 100);
        strokeWeight(0.5);
        line(p.x, p.y, p.z, f.x, f.y, 0);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
