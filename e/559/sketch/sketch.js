let particles = [];
let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create particles for mist
  for (let i = 0; i < 2000; i++) {
    particles.push({
      pos: p5.Vector.random3D().mult(random(300, 600)),
      vel: p5.Vector.random3D().mult(random(0.1, 0.5)),
      size: random(0.5, 2),
      hue: random(180, 240)
    });
  }

  // Create structural elements
  for (let i = 0; i < 50; i++) {
    structures.push({
      pos: p5.Vector.random3D().mult(random(100, 400)),
      size: random(20, 80),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005),
      stress: random(0.5, 1)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;

  // Camera movement
  let cx = sin(time * 0.2) * 200;
  let cy = cos(time * 0.3) * 100;
  let cz = sin(time * 0.1) * 150;
  camera(0, 0, 600 + cz, cx, cy, 0, 0, 1, 0);

  // Draw particles
  push();
  noStroke();
  beginShape(POINTS);
  for (let p of particles) {
    fill(p.hue, 50, 80, 0.3);
    vertex(p.pos.x, p.pos.y, p.pos.z);
  }
  endShape();

  // Update particles
  for (let p of particles) {
    p.pos.add(p.vel);
    if (p.pos.mag() > 700) {
      p.pos = p5.Vector.random3D().mult(random(300, 600));
    }
  }
  pop();

  // Draw structures
  for (let s of structures) {
    push();
    translate(s.pos.x, s.pos.y, s.pos.z);
    rotateZ(s.rotation + time * s.speed);
    rotateX(time * s.speed * 0.5);
    rotateY(time * s.speed * 0.3);

    // Stress visualization
    let stressFactor = sin(time * 10 + s.pos.mag() * 0.01) * 0.5 + 0.5;
    let scale = s.size * (0.8 + stressFactor * 0.4);
    
    fill(190, 60, 70, 0.6);
    stroke(190, 60, 90, 0.8);
    strokeWeight(0.5);
    
    // Draw fractured planes
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI * i / 8;
      let x = cos(angle) * scale;
      let y = sin(angle) * scale;
      vertex(x, y, 0);
    }
    endShape(CLOSE);

    // Stress lines
    stroke(200, 70, 90, 0.5);
    strokeWeight(0.3);
    beginShape(LINES);
    for (let i = 0; i < 8; i++) {
      let angle1 = TWO_PI * i / 8;
      let angle2 = TWO_PI * (i + 1) / 8;
      let x1 = cos(angle1) * scale * 0.7;
      let y1 = sin(angle1) * scale * 0.7;
      let x2 = cos(angle2) * scale * 0.7;
      let y2 = sin(angle2) * scale * 0.7;
      vertex(x1, y1, 0);
      vertex(x2, y2, 0);
    }
    endShape();
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
