let sandParticles = [];
let shells = [];
let ripplePatterns = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Create sand particles
  for (let i = 0; i < 2000; i++) {
    sandParticles.push({
      x: random(width),
      y: random(height * 0.7, height),
      size: random(1, 3),
      hue: random(40, 60),
      sat: random(10, 30),
      bri: random(80, 95)
    });
  }

  // Create shells
  for (let i = 0; i < 15; i++) {
    shells.push({
      x: random(width * 0.2, width * 0.8),
      y: random(height * 0.6, height * 0.9),
      size: random(8, 20),
      rotation: random(TWO_PI),
      hue: random(30, 50),
      sat: random(20, 40),
      bri: random(70, 90)
    });
  }

  // Create ripple patterns
  for (let i = 0; i < 100; i++) {
    ripplePatterns.push({
      x: random(width),
      y: random(height * 0.6, height),
      maxRadius: random(20, 80),
      speed: random(0.01, 0.03),
      alpha: random(0.05, 0.15)
    });
  }
}

function draw() {
  background(20, 5, 95);

  // Draw sand mound
  noStroke();
  for (let particle of sandParticles) {
    fill(particle.hue, particle.sat, particle.bri);
    ellipse(particle.x, particle.y, particle.size);
  }

  // Draw shells
  for (let shell of shells) {
    push();
    translate(shell.x, shell.y);
    rotate(shell.rotation);
    fill(shell.hue, shell.sat, shell.bri);
    stroke(0, 0, 80);
    strokeWeight(0.5);
    drawShell(shell.size);
    pop();
  }

  // Draw ripples
  for (let ripple of ripplePatterns) {
    ripple.maxRadius += ripple.speed;
    if (ripple.maxRadius > 120) ripple.maxRadius = 0;
    noFill();
    stroke(200, 10, 90, ripple.alpha);
    strokeWeight(0.5);
    ellipse(ripple.x, ripple.y, ripple.maxRadius);
  }

  noLoop(); // Ensure no motion
}

function drawShell(size) {
  beginShape();
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI);
    let r = size * (0.8 + sin(angle * 3) * 0.2);
    let x = r * cos(angle);
    let y = r * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}
