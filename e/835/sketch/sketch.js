let lines = [];
let points = [];
let flowField = [];

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noFill();
  strokeWeight(1);

  // Create flow field
  let resolution = 20;
  let cols = width / resolution;
  let rows = height / resolution;
  flowField = new Array(cols * rows);

  for (let i = 0; i < flowField.length; i++) {
    flowField[i] = random(TWO_PI);
  }

  // Create initial lines
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height);
    lines.push({
      x: x,
      y: y,
      angle: flowField[Math.floor(y / resolution) * cols + Math.floor(x / resolution)],
      length: random(5, 30),
      hue: random(20, 40),
      sat: random(70, 90),
      bri: random(80, 100),
      alpha: random(0.3, 0.7)
    });
  }

  // Create flower points
  for (let i = 0; i < 150; i++) {
    let x = random(width);
    let y = random(height);
    points.push({
      x: x,
      y: y,
      size: random(2, 8),
      hue: random(20, 40),
      sat: random(70, 90),
      bri: random(80, 100),
      alpha: random(0.5, 1),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 5);

  // Update flow field
  let resolution = 20;
  let cols = width / resolution;
  let rows = height / resolution;

  for (let i = 0; i < flowField.length; i++) {
    let x = (i % cols) * resolution;
    let y = Math.floor(i / cols) * resolution;
    let angle = flowField[i];
    let force = p5.Vector.fromAngle(angle);
    force.mult(0.01);
    stroke((angle * 180 / PI + frameCount * 0.5) % 360, 70, 90, 0.2);
    line(x, y, x + force.x * 10, y + force.y * 10);
  }

  // Draw lines
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    let x = l.x;
    let y = l.y;
    let angle = l.angle;

    stroke(l.hue, l.sat, l.bri, l.alpha);
    push();
    translate(x, y);
    rotate(angle);
    line(0, 0, l.length, 0);
    pop();

    // Update position
    let force = p5.Vector.fromAngle(angle);
    l.x += force.x * 0.5;
    l.y += force.y * 0.5;

    // Reset if out of bounds
    if (l.x < -10 || l.x > width + 10 || l.y < -10 || l.y > height + 10) {
      l.x = random(width);
      l.y = random(height);
      let col = Math.floor(l.x / resolution);
      let row = Math.floor(l.y / resolution);
      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        l.angle = flowField[row * cols + col];
      }
    }

    // Occasionally change angle
    if (random() < 0.01) {
      let col = Math.floor(l.x / resolution);
      let row = Math.floor(l.y / resolution);
      if (col >= 0 && col < cols && row >= 0 && row < rows) {
        l.angle = flowField[row * cols + col];
      }
    }

    // Bloom at intersections
    if (random() < 0.02) {
      let size = random(1, 3);
      stroke(l.hue, l.sat, l.bri, l.alpha);
      for (let j = 0; j < 8; j++) {
        push();
        rotate(TWO_PI * j / 8);
        line(0, 0, size, 0);
        pop();
      }
    }
  }

  // Draw points
  for (let i = 0; i < points.length; i++) {
    let p = points[i];
    let x = p.x;
    let y = p.y;

    stroke(p.hue, p.sat, p.bri, p.alpha);
    push();
    translate(x, y);
    rotate(p.angle);
    ellipse(0, 0, p.size, p.size * 2);
    pop();

    // Occasionally bloom
    if (random() < 0.01) {
      stroke((p.hue + 180) % 360, p.sat, p.bri, p.alpha * 0.5);
      for (let j = 0; j < 12; j++) {
        push();
        rotate(TWO_PI * j / 12);
        line(0, 0, p.size, 0);
        pop();
      }
    }

    // Update angle
    p.angle += 0.05;
  }
}
