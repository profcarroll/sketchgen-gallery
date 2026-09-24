let shells = [];
let sandParticles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  // Create sand particles
  for (let i = 0; i < 5000; i++) {
    sandParticles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      hue: random(40, 60), // Pale yellow range
      sat: random(10, 20),
      bri: random(80, 95)
    });
  }

  // Create shells
  for (let i = 0; i < 60; i++) {
    shells.push({
      x: random(width),
      y: random(height),
      size: random(15, 40),
      rotation: random(TWO_PI),
      hue: random(30, 50), // Creamy white to pink
      sat: random(20, 40),
      bri: random(70, 90),
      type: floor(random(3)) // Different shell shapes
    });
  }
}

function draw() {
  background(240);

  // Draw sand mound
  drawSandMound();

  // Draw shells
  for (let shell of shells) {
    drawShell(shell);
  }

  // Draw sand particles on top
  drawSandParticles();
}

function drawSandMound() {
  // Create a gentle mound shape
  let moundHeight = height * 0.6;
  let moundWidth = width * 0.8;

  noStroke();
  fill(255, 255, 240);
  
  // Draw base sand layer
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = map(noise(x * 0.01), 0, 1, height * 0.7, height);
    let size = random(2, 6);
    fill(255, 255, 240, 150);
    ellipse(x, y, size, size);
  }
}

function drawSandParticles() {
  noStroke();
  for (let particle of sandParticles) {
    fill(particle.hue, particle.sat, particle.bri, 180);
    ellipse(particle.x, particle.y, particle.size, particle.size);
  }
}

function drawShell(shell) {
  push();
  translate(shell.x, shell.y);
  rotate(shell.rotation);
  
  noStroke();
  fill(shell.hue, shell.sat, shell.bri, 220);
  
  // Draw different shell types
  switch (shell.type) {
    case 0: // Spiral shell
      drawSpiralShell(shell.size);
      break;
    case 1: // Curved shell
      drawCurvedShell(shell.size);
      break;
    case 2: // Flat shell
      drawFlatShell(shell.size);
      break;
  }
  
  pop();
}

function drawSpiralShell(size) {
  let points = [];
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 9, 0, TWO_PI * 2.5);
    let radius = size * 0.8 + sin(angle * 3) * size * 0.1;
    points.push(createVector(cos(angle) * radius, sin(angle) * radius));
  }
  
  beginShape();
  for (let p of points) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
}

function drawCurvedShell(size) {
  let points = [];
  for (let i = 0; i < 15; i++) {
    let angle = map(i, 0, 14, 0, PI);
    let radius = size * 0.7 + sin(angle * 2) * size * 0.2;
    points.push(createVector(cos(angle) * radius, sin(angle) * radius));
  }
  
  beginShape();
  for (let p of points) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
}

function drawFlatShell(size) {
  let points = [];
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 11, 0, TWO_PI);
    let radius = size * 0.6 + sin(angle * 4) * size * 0.1;
    points.push(createVector(cos(angle) * radius, sin(angle) * radius));
  }
  
  beginShape();
  for (let p of points) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
