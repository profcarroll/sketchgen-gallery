let particles = [];
let lines = [];
let time = 0;
let bgGradient;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a gradient background from midnight blue to deep violet
  bgGradient = drawingContext.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, '#000428');
  bgGradient.addColorStop(1, '#004e92');

  // Create particles for the nebula
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(20, 100),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      pulse: random(TWO_PI),
      hue: random(240, 280)
    });
  }

  // Create lines for the luminous flows
  for (let i = 0; i < 300; i++) {
    lines.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      opacity: random(30, 80)
    });
  }
}

function draw() {
  // Draw gradient background
  drawingContext.fillStyle = bgGradient;
  rect(0, 0, width, height);

  time += 0.01;

  // Update and display particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // Move particle
    p.x += p.speedX;
    p.y += p.speedY;

    // Wrap around edges
    if (p.x > width + 50) p.x = -50;
    if (p.x < -50) p.x = width + 50;
    if (p.y > height + 50) p.y = -50;
    if (p.y < -50) p.y = height + 50;

    // Pulsing effect
    p.pulse += 0.03;

    // Calculate pulsing size and opacity
    let pulseSize = sin(p.pulse) * 10 + p.size;
    let alpha = map(sin(p.pulse), -1, 1, 50, 150);

    // Draw nebulous particle
    noStroke();
    fill(p.hue, 80, 90, alpha);
    ellipse(p.x, p.y, pulseSize);

    // Add a subtle glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(p.hue, 100, 100, alpha * 0.5);
    ellipse(p.x, p.y, pulseSize * 1.5);
    drawingContext.shadowBlur = 0;
  }

  // Draw luminous lines
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];

    // Animate line opacity
    l.opacity = map(sin(time + i * 0.01), -1, 1, 30, 100);

    stroke(200, 100, 255, l.opacity);
    strokeWeight(1);
    line(l.x1, l.y1, l.x2, l.y2);
  }

  // Add small glowing points
  for (let i = 0; i < 50; i++) {
    let x = sin(time * 0.3 + i) * 50 + width / 2;
    let y = cos(time * 0.4 + i) * 50 + height / 2;
    let pulse = sin(time * 2 + i) * 0.5 + 0.5;

    noStroke();
    fill(255, 255, 255, 100 * pulse);
    ellipse(x, y, 2 + pulse * 3);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
