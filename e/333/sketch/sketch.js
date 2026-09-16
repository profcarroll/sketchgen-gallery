let lines = [];
let nodes = [];
let flares = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize dynamic lines
  for (let i = 0; i < 20; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(50, 200)
    });
  }
  // Initialize nodes
  for (let i = 0; i < 30; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      size: random(8, 20),
      color: random() > 0.5 ? [255, 0, 0] : [0, 255, 0]
    });
  }
}

function draw() {
  background(10);
  time += 0.01;

  // Update and draw lines
  for (let line of lines) {
    line.x += line.vx;
    line.y += line.vy;
    line.size *= 1.002; // Slowly expand

    // Bounce off edges
    if (line.x < 0 || line.x > width) line.vx *= -1;
    if (line.y < 0 || line.y > height) line.vy *= -1;

    // Draw the line
    stroke(255, 100);
    noFill();
    beginShape();
    for (let i = 0; i < 50; i++) {
      let angle = time + i * 0.2;
      let x = line.x + cos(angle) * line.size * 0.5;
      let y = line.y + sin(angle) * line.size * 0.5;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Check for flare trigger
    for (let node of nodes) {
      let d = dist(line.x, line.y, node.x, node.y);
      if (d < node.size + line.size * 0.5) {
        flares.push({
          x: node.x,
          y: node.y,
          size: 0,
          max: random(40, 80),
          color: node.color
        });
      }
    }
  }

  // Update and draw nodes
  for (let node of nodes) {
    fill(node.color[0], node.color[1], node.color[2], 150);
    noStroke();
    ellipse(node.x, node.y, node.size);
  }

  // Update and draw flares
  for (let i = flares.length - 1; i >= 0; i--) {
    let flare = flares[i];
    flare.size += 2;
    let alpha = map(flare.size, 0, flare.max, 255, 0);
    stroke(flare.color[0], flare.color[1], flare.color[2], alpha);
    noFill();
    ellipse(flare.x, flare.y, flare.size);
    if (flare.size > flare.max) {
      flares.splice(i, 1);
    }
  }

  // Occasionally add new lines
  if (random() < 0.02) {
    lines.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      size: random(50, 200)
    });
  }

  // Occasionally remove old lines
  if (lines.length > 30) {
    lines.shift();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
