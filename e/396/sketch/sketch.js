let structures = [];
let particles = [];

function setup() {
  createCanvas(400, 400, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create structures with sharp, asymmetrical planes
  for (let i = 0; i < 8; i++) {
    let s = {
      x: random(-200, 200),
      y: random(-200, 200),
      z: random(-300, 300),
      size: random(50, 150),
      rotX: random(TWO_PI),
      rotY: random(TWO_PI),
      rotZ: random(TWO_PI),
      color: color(random(180, 240), 70, 60, 0.7)
    };
    structures.push(s);
  }

  // Create particles that dissolve into mist
  for (let i = 0; i < 500; i++) {
    let p = {
      x: random(-300, 300),
      y: random(-300, 300),
      z: random(-300, 300),
      speed: random(0.1, 0.5),
      life: random(1)
    };
    particles.push(p);
  }
}

function draw() {
  background(180, 20, 10); // Muted teal background

  // Slow camera drift
  let time = millis() / 5000;
  camera(
    sin(time) * 400,
    cos(time * 0.7) * 200,
    cos(time) * 400 + 300,
    0, 0, 0,
    0, 1, 0
  );

  // Draw structures with stress lines
  for (let s of structures) {
    push();
    translate(s.x, s.y, s.z);
    rotateX(s.rotX + time * 0.2);
    rotateY(s.rotY + time * 0.3);
    rotateZ(s.rotZ + time * 0.1);

    // Draw asymmetrical planes
    fill(s.color);
    noStroke();
    beginShape();
    vertex(-s.size, -s.size, 0);
    vertex(s.size, -s.size, 0);
    vertex(s.size, s.size, 0);
    vertex(-s.size, s.size, 0);
    endShape(CLOSE);

    // Add structural stress lines
    stroke(240, 50, 90, 0.5);
    noFill();
    beginShape(LINES);
    vertex(-s.size, -s.size, 0);
    vertex(s.size, s.size, 0);
    vertex(s.size, -s.size, 0);
    vertex(-s.size, s.size, 0);
    endShape();

    pop();
  }

  // Draw dissolving particles
  noStroke();
  fill(180, 30, 90, 0.2);
  beginShape(POINTS);
  for (let p of particles) {
    p.x += sin(time + p.x * 0.01) * p.speed;
    p.y += cos(time + p.y * 0.01) * p.speed;
    p.z += sin(time * 0.5 + p.z * 0.01) * p.speed;
    p.life -= 0.001;

    if (p.life <= 0) {
      p.x = random(-300, 300);
      p.y = random(-300, 300);
      p.z = random(-300, 300);
      p.life = 1;
    }

    vertex(p.x, p.y, p.z);
  }
  endShape();
}
