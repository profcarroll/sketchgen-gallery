let time = 0;
let patterns = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  // Initialize spirograph patterns with golden and lilac tones
  for (let i = 0; i < 8; i++) {
    patterns.push({
      radius: random(50, 150),
      speed: random(0.002, 0.01),
      phase: random(TWO_PI),
      color: i % 2 === 0 ? color(255, 215, 0, 150) : color(138, 43, 226, 150),
      detail: random(30, 100)
    });
  }
}

function draw() {
  background(10, 5, 20);

  // Center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw intricate spirograph patterns
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    time += pattern.speed;

    // Calculate positions for spirograph points
    const x1 = centerX + cos(time * 3 + pattern.phase) * pattern.radius;
    const y1 = centerY + sin(time * 3 + pattern.phase) * pattern.radius;
    const x2 = centerX + cos(time * 3 + pattern.phase + PI) * pattern.radius;
    const y2 = centerY + sin(time * 3 + pattern.phase + PI) * pattern.radius;

    // Draw spirograph path
    stroke(pattern.color);
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      const x = centerX + cos(a) * pattern.radius;
      const y = centerY + sin(a) * pattern.radius;
      vertex(x, y);
    }
    endShape();

    // Draw connecting lines for spirograph
    stroke(pattern.color);
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      const x = centerX + cos(a) * pattern.radius;
      const y = centerY + sin(a) * pattern.radius;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Draw glowing celestial points
    fill(pattern.color);
    noStroke();
    ellipse(x1, y1, 6);
    ellipse(x2, y2, 6);
  }

  // Update time for next frame
  time += 0.001;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
