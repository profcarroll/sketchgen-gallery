let beamAngle = 0;
let rotationSpeed = 0.02;
let oceanParticles = [];
let particleCount = 1000;
let beamCenter;
let points;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize ocean particles
  for (let i = 0; i < particleCount; i++) {
    oceanParticles.push({
      x: random(-width * 2, width * 2),
      y: random(-height * 2, height * 2),
      z: random(-1000, 1000),
      size: random(0.5, 3),
      hue: random(200, 240), // Deep blue to teal
      saturation: random(60, 80),
      brightness: random(30, 70)
    });
  }

  beamCenter = createVector(0, 0, -100);

  // Create a point cloud for ocean particles
  points = [];
  for (let i = 0; i < particleCount; i++) {
    points.push(createVector(
      random(-width * 2, width * 2),
      random(-height * 2, height * 2),
      random(-1000, 1000)
    ));
  }
}

function draw() {
  background(200, 20, 10);

  // Draw the lighthouse tower
  drawLighthouse();

  // Update and draw the rotating beam
  beamAngle += rotationSpeed;
  drawBeam();

  // Update and draw ocean particles as a single point cloud
  updateOcean();
}

function drawLighthouse() {
  // Tower base (white)
  fill(0, 0, 95);
  noStroke();
  push();
  translate(0, 0, -100);
  box(80, 300, 20);
  pop();

  // Tower top (blue)
  fill(240, 100, 60);
  push();
  translate(0, -150, -100);
  box(60, 60, 20);
  pop();

  // Light house window
  fill(240, 100, 90);
  push();
  translate(0, -130, -100);
  box(20, 30, 20);
  pop();

  // Light house light (beam source)
  fill(240, 100, 100);
  push();
  translate(0, -170, -100);
  sphere(20);
  pop();
}

function drawBeam() {
  // Create a rotating beam using the angle
  push();
  translate(0, 0, -100);
  rotateZ(beamAngle);

  // Draw the beam as a large triangle with transparency
  noStroke();
  fill(240, 100, 100, 0.2);
  beginShape();
  vertex(0, 0, 0);
  vertex(-300, -100, 0);
  vertex(300, -100, 0);
  endShape(CLOSE);

  // Add a bright inner beam
  fill(240, 100, 100, 0.7);
  beginShape();
  vertex(0, 0, 0);
  vertex(-150, -50, 0);
  vertex(150, -50, 0);
  endShape(CLOSE);

  pop();
}

function updateOcean() {
  // Draw all particles in a single point cloud
  noStroke();
  beginShape(POINTS);
  for (let i = 0; i < oceanParticles.length; i++) {
    let p = oceanParticles[i];

    // Move particles slightly
    p.x += random(-0.5, 0.5);
    p.y += random(-0.5, 0.5);
    p.z += random(-0.5, 0.5);

    // Wrap around the canvas
    if (p.x > width * 2) p.x = -width * 2;
    if (p.x < -width * 2) p.x = width * 2;
    if (p.y > height * 2) p.y = -height * 2;
    if (p.y < -height * 2) p.y = height * 2;

    // Set color and vertex
    fill(p.hue, p.saturation, p.brightness, 0.7);
    vertex(p.x, p.y, p.z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
