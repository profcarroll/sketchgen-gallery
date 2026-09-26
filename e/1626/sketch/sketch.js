let time = 0;
let orbits = [];
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  // Initialize orbits with different parameters for celestial dance
  for (let i = 0; i < 8; i++) {
    orbits.push({
      radius: random(60, 200),
      speed: random(0.005, 0.02),
      phase: random(TWO_PI),
      color: color(random(150, 255), random(100, 255), random(200, 255), 200)
    });
  }

  // Precompute some vibrant neon colors for space effect
  for (let i = 0; i < 50; i++) {
    colors.push(color(random(150, 255), random(100, 255), random(200, 255), 180));
  }
}

function draw() {
  background(10, 5, 20);

  // Center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw spirograph patterns with glowing orbits
  for (let i = 0; i < orbits.length; i++) {
    const orbit = orbits[i];
    time += orbit.speed;

    // Calculate positions of two celestial bodies in orbit
    const x1 = centerX + cos(time * 2 + orbit.phase) * orbit.radius;
    const y1 = centerY + sin(time * 2 + orbit.phase) * orbit.radius;
    const x2 = centerX + cos(time * 2 + orbit.phase + PI) * orbit.radius;
    const y2 = centerY + sin(time * 2 + orbit.phase + PI) * orbit.radius;

    // Draw orbit path
    stroke(orbit.color);
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      const x = centerX + cos(a) * orbit.radius;
      const y = centerY + sin(a) * orbit.radius;
      vertex(x, y);
    }
    endShape();

    // Draw connecting lines between celestial points
    stroke(orbit.color);
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      const x = centerX + cos(a) * orbit.radius;
      const y = centerY + sin(a) * orbit.radius;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Draw glowing celestial bodies
    fill(orbit.color);
    noStroke();
    ellipse(x1, y1, 8);
    ellipse(x2, y2, 8);
  }

  // Add cosmic particles for nebula effect
  strokeWeight(1);
  for (let i = 0; i < 150; i++) {
    const x = random(width);
    const y = random(height);
    const c = colors[i % colors.length];
    fill(c);
    noStroke();
    ellipse(x, y, random(0.5, 2));
  }

  // Update time for next frame
  time += 0.002;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
