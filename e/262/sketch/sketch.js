let dustDevils = [];
let scrubShapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);

  // Create dust devils
  for (let i = 0; i < 8; i++) {
    dustDevils.push({
      x: random(width),
      y: random(height * 0.7, height * 0.9),
      size: random(20, 60),
      speed: random(0.5, 1.5),
      angle: random(TWO_PI),
      sway: random(-0.02, 0.02)
    });
  }

  // Create scrub shapes
  for (let i = 0; i < 30; i++) {
    scrubShapes.push({
      x: random(width),
      y: random(height * 0.7, height),
      size: random(10, 40),
      sway: random(-0.01, 0.01)
    });
  }
}

function draw() {
  // Draw sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(200, 150, 100), color(180, 120, 80), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Draw ground
  fill(139, 69, 19); // Brown
  noStroke();
  rect(0, height * 0.7, width, height * 0.3);

  // Draw scrub shapes
  fill(101, 67, 33); // Darker brown
  for (let shape of scrubShapes) {
    shape.x += shape.sway;
    ellipse(shape.x, shape.y, shape.size, shape.size * 0.6);
  }

  // Draw dust devils
  for (let devil of dustDevils) {
    // Update position
    devil.x += cos(devil.angle) * devil.speed;
    devil.y += sin(devil.angle) * devil.speed;
    devil.angle += devil.sway;

    // Wrap around edges
    if (devil.x > width + 100) devil.x = -100;
    if (devil.x < -100) devil.x = width + 100;
    if (devil.y > height + 100) devil.y = -100;

    // Draw dust devil
    noFill();
    stroke(255, 255, 255, 150);
    strokeWeight(1);
    ellipse(devil.x, devil.y, devil.size);

    // Draw inner swirl
    stroke(200, 100, 50, 100);
    strokeWeight(1);
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let x = devil.x + cos(angle + devil.angle) * devil.size * 0.3;
      let y = devil.y + sin(angle + devil.angle) * devil.size * 0.3;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
