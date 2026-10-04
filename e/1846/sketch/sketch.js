let spirals = [];
let triangles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  
  // Create spirals with varying parameters
  for (let i = 0; i < 12; i++) {
    spirals.push({
      radius: random(150, 400),
      speed: random(0.001, 0.005),
      phase: random(TWO_PI),
      color: color(random(180, 255), random(180, 255), random(220, 255), 200),
      detail: random(40, 100)
    });
  }

  // Create triangular patterns
  for (let i = 0; i < 30; i++) {
    triangles.push({
      size: random(30, 80),
      speed: random(0.002, 0.008),
      phase: random(TWO_PI),
      color: color(random(180, 255), random(180, 255), random(220, 255), 180)
    });
  }
}

function draw() {
  background(10, 15, 40);

  const centerX = width / 2;
  const centerY = height / 2;

  // Draw spirals
  for (let i = 0; i < spirals.length; i++) {
    const spiral = spirals[i];
    const time = frameCount * spiral.speed;

    stroke(spiral.color);
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI * 6; a += 0.02) {
      const r = spiral.radius * (1 - a / (TWO_PI * 6));
      const x = centerX + cos(a + time + spiral.phase) * r;
      const y = centerY + sin(a + time + spiral.phase) * r;
      vertex(x, y);
    }
    endShape();
  }

  // Draw triangular patterns
  for (let i = 0; i < triangles.length; i++) {
    const tri = triangles[i];
    const time = frameCount * tri.speed;

    push();
    translate(centerX, centerY);
    rotate(time + tri.phase);

    fill(tri.color);
    noStroke();
    beginShape();
    for (let j = 0; j < 3; j++) {
      const angle = TWO_PI / 3 * j;
      const x = cos(angle) * tri.size;
      const y = sin(angle) * tri.size;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Draw connecting lines for triangles
    stroke(tri.color);
    noFill();
    beginShape();
    for (let j = 0; j < 3; j++) {
      const angle = TWO_PI / 3 * j;
      const x = cos(angle) * tri.size;
      const y = sin(angle) * tri.size;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }

  // Add interlocking lines between spirals and triangles
  stroke(255, 100);
  noFill();
  beginShape();
  for (let i = 0; i < spirals.length; i++) {
    const spiral = spirals[i];
    const time = frameCount * spiral.speed;
    const r = spiral.radius * 0.5;
    const x = centerX + cos(time) * r;
    const y = centerY + sin(time) * r;
    vertex(x, y);
  }
  endShape(CLOSE);

  // Add more interlocking geometry
  for (let i = 0; i < triangles.length; i++) {
    const tri = triangles[i];
    const time = frameCount * tri.speed;

    push();
    translate(centerX, centerY);
    rotate(time + tri.phase);

    stroke(255, 150);
    noFill();
    beginShape();
    for (let j = 0; j < 3; j++) {
      const angle = TWO_PI / 3 * j;
      const x = cos(angle) * tri.size * 0.7;
      const y = sin(angle) * tri.size * 0.7;
      vertex(x, y);
    }
    endShape(CLOSE);

    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
