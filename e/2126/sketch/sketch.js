let crystals = [];
let particles = [];
let beamAngle = 0;
let rotationSpeed = 0.005;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Create crystal formations
  for (let i = 0; i < 150; i++) {
    crystals.push({
      x: random(-width * 1.5, width * 1.5),
      y: random(-height * 1.5, height * 1.5),
      z: random(-1000, -200),
      size: random(20, 80),
      hue: random(200, 260),
      saturation: random(70, 90),
      brightness: random(60, 90),
      angle: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }

  // Create mineral particles
  for (let i = 0; i < 1000; i++) {
    particles.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, 1000),
      size: random(0.5, 3),
      hue: random(180, 220),
      saturation: random(60, 80),
      brightness: random(40, 70),
      speed: random(0.1, 0.5)
    });
  }
}

function draw() {
  background(200, 20, 10);
  
  time += 0.01;
  beamAngle += rotationSpeed;

  // Draw the deep sea environment
  drawDeepSea();

  // Draw crystal formations
  for (let crystal of crystals) {
    drawCrystal(crystal);
  }

  // Draw mineral particles
  drawParticles();
}

function drawDeepSea() {
  // Draw background ocean particles as a single point cloud
  noStroke();
  beginShape(POINTS);
  for (let p of particles) {
    fill(p.hue, p.saturation, p.brightness, 0.7);
    vertex(p.x, p.y, p.z);
  }
  endShape();
}

function drawCrystal(crystal) {
  push();
  translate(crystal.x, crystal.y, crystal.z);
  
  // Apply beam effect
  let distToBeam = abs(atan2(crystal.x, crystal.z) - beamAngle) % TWO_PI;
  let intensity = map(cos(distToBeam * 3), -1, 1, 0.5, 1);
  
  // Crystal structure with fractal effect
  fill(crystal.hue, crystal.saturation, crystal.brightness * intensity, 0.8);
  stroke(240, 50, 90, 0.5);
  strokeWeight(0.5);
  
  // Create a simpler crystal shape to avoid performance issues
  drawSimpleCrystal(crystal.size * intensity);
  
  pop();
}

function drawSimpleCrystal(size) {
  // Draw main crystal as a few spheres and lines
  let s = size;
  push();
  rotateX(time * 0.5);
  rotateY(time * 0.3);
  sphere(s, 4, 3);
  pop();
  
  // Add some connecting lines to simulate lattice structure
  push();
  stroke(240, 50, 90, 0.3);
  strokeWeight(0.5);
  beginShape(LINES);
  for (let i = 0; i < 6; i++) {
    let a = map(i, 0, 6, 0, TWO_PI);
    vertex(cos(a) * s * 0.8, 0, sin(a) * s * 0.8);
    vertex(cos(a + TWO_PI/6) * s * 0.8, 0, sin(a + TWO_PI/6) * s * 0.8);
  }
  endShape();
  pop();
}

function drawParticles() {
  // Update and draw ocean particles
  noStroke();
  beginShape(POINTS);
  
  for (let p of particles) {
    // Move particles with subtle current
    p.x += sin(time * 0.2 + p.z * 0.001) * p.speed;
    p.y += cos(time * 0.3 + p.z * 0.001) * p.speed;
    p.z += random(-0.5, 0.5);
    
    // Wrap around the canvas
    if (p.x > width * 2) p.x = -width * 2;
    if (p.x < -width * 2) p.x = width * 2;
    if (p.y > height * 2) p.y = -height * 2;
    if (p.y < -height * 2) p.y = height * 2;
    
    // Draw particle
    fill(p.hue, p.saturation, p.brightness, 0.7);
    vertex(p.x, p.y, p.z);
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
