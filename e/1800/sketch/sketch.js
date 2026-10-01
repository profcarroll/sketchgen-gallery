let time = 0;
let patterns = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  // Initialize spirograph patterns with sapphire blue and emerald green
  for (let i = 0; i < 12; i++) {
    patterns.push({
      radius: random(30, 120),
      speed: random(0.001, 0.008),
      phase: random(TWO_PI),
      color: i % 2 === 0 ? color(0, 100, 200, 180) : color(0, 200, 80, 180),
      detail: random(50, 150)
    });
  }
}

function draw() {
  background(5, 10, 30);

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
