let crystals = [];
let particles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create crystal lattice structures
  for (let i = 0; i < 20; i++) {
    crystals.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, -300),
      size: random(30, 100),
      rotation: random(TWO_PI),
      speed: random(0.001, 0.005),
      hue: random(180, 240), // Blue-green hues for bioluminescent minerals
      saturation: random(60, 90),
      brightness: random(70, 90)
    });
  }

  // Create floating particles that scatter like light
  for (let i = 0; i < 1500; i++) {
    particles.push({
      x: random(-width * 3, width * 3),
      y: random(-height * 3, height * 3),
      z: random(-2000, 2000),
      size: random(0.5, 2),
      speed: random(0.001, 0.008),
      hue: random(180, 240),
      brightness: random(80, 100)
    });
  }
}

function draw() {
  background(20, 5, 5); // Deep sea darkness
  time += 0.01;

  // Draw the bioluminescent crystal lattice
  for (let crystal of crystals) {
    drawCrystal(crystal);
  }

  // Draw floating particles as a batched point cloud
  beginShape(POINTS);
  for (let particle of particles) {
    drawParticle(particle);
  }
  endShape();
}

function drawCrystal(crystal) {
  push();
  translate(crystal.x, crystal.y, crystal.z);

  // Rotate the crystal
  crystal.rotation += crystal.speed;
  rotateX(crystal.rotation);
  rotateY(crystal.rotation * 0.5);

  // Draw crystal structure with multiple facets
  fill(crystal.hue, crystal.saturation, crystal.brightness, 0.8);
  stroke(180, 30, 90, 0.5);
  strokeWeight(0.5);

  // Create a geometric crystal shape
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = map(i, 0, 6, 0, TWO_PI);
    let x = cos(angle) * crystal.size;
    let y = sin(angle) * crystal.size;
    vertex(x, y, 0);
  }
  endShape(CLOSE);

  // Add internal facets
  for (let i = 0; i < 3; i++) {
    let angle = map(i, 0, 3, 0, TWO_PI);
    let x1 = cos(angle) * crystal.size * 0.5;
    let y1 = sin(angle) * crystal.size * 0.5;
    let x2 = cos(angle + PI/3) * crystal.size * 0.5;
    let y2 = sin(angle + PI/3) * crystal.size * 0.5;
    
    line(x1, y1, 0, x2, y2, 0);
  }

  pop();
}

function drawParticle(particle) {
  // Animate particle
  particle.z += particle.speed * sin(time * 0.5);
  particle.x += sin(time * 0.3 + particle.z * 0.01) * 0.5;
  particle.y += cos(time * 0.2 + particle.z * 0.01) * 0.5;

  // Set color and position for the point
  noStroke();
  fill(particle.hue, 80, particle.brightness, 0.7);
  vertex(particle.x, particle.y, particle.z);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
