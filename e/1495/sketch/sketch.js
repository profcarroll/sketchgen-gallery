let time = 0;
let orbits = [];
let colors = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);

  // Initialize orbits with different parameters
  for (let i = 0; i < 6; i++) {
    orbits.push({
      radius: random(50, 150),
      speed: random(0.01, 0.03),
      phase: random(TWO_PI),
      color: color(random(100, 255), random(100, 255), random(200, 255), 200)
    });
  }

  // Precompute some colors for vibrant space effect
  for (let i = 0; i < 100; i++) {
    colors.push(color(random(100, 255), random(100, 255), random(200, 255), 180));
  }
}

function draw() {
  background(10, 10, 30);

  // Center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw spirograph patterns
  for (let i = 0; i < orbits.length; i++) {
    const orbit = orbits[i];
    time += orbit.speed;

    // Calculate positions of two celestial bodies
    const x1 = centerX + cos(time * 2 + orbit.phase) * orbit.radius;
    const y1 = centerY + sin(time * 2 + orbit.phase) * orbit.radius;
    const x2 = centerX + cos(time * 2 + orbit.phase + PI) * orbit.radius;
    const y2 = centerY + sin(time * 2 + orbit.phase + PI) * orbit.radius;

    // Draw arcs between the two points
    stroke(orbit.color);
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.05) {
      const x = centerX + cos(a) * orbit.radius;
      const y = centerY + sin(a) * orbit.radius;
      vertex(x, y);
    }
    endShape();

    // Draw connecting lines between orbits
    stroke(orbit.color);
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      const x = centerX + cos(a) * orbit.radius;
      const y = centerY + sin(a) * orbit.radius;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Draw central point
    fill(255);
    noStroke();
    ellipse(centerX, centerY, 10);
  }

  // Add some random particles for cosmic feel
  strokeWeight(1);
  for (let i = 0; i < 100; i++) {
    const x = random(width);
    const y = random(height);
    const c = colors[i % colors.length];
    fill(c);
    noStroke();
    ellipse(x, y, random(1, 3));
  }

  // Update time for next frame
  time += 0.005;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
