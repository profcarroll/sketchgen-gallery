let lines = [];
let nodes = [];
let numLines = 10;
let numNodes = 50;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize lines
  for (let i = 0; i < numLines; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      vx: random(-0.5, 0.5),
      vy: random(-0.5, 0.5),
      hue: random(360),
      size: random(10, 30),
      points: []
    });
  }

  // Initialize nodes
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      hue: random(120, 180) // Green range
    });
  }
}

function draw() {
  background(0, 0, 10);

  // Update and draw lines
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Move line
    line.x += line.vx;
    line.y += line.vy;

    // Bounce off edges
    if (line.x < 0 || line.x > width) line.vx *= -1;
    if (line.y < 0 || line.y > height) line.vy *= -1;

    // Add point to history
    line.points.push({x: line.x, y: line.y});
    if (line.points.length > 50) {
      line.points.shift();
    }

    // Draw the line with trail effect
    noFill();
    stroke(line.hue, 80, 90);
    strokeWeight(1.5);

    beginShape();
    for (let p of line.points) {
      vertex(p.x, p.y);
    }
    endShape();

    // Check proximity to nodes and flare if near
    for (let node of nodes) {
      let d = dist(line.x, line.y, node.x, node.y);
      if (d < node.size + 10) {
        stroke(line.hue, 100, 100, 0.5);
        strokeWeight(3);
        ellipse(line.x, line.y, (node.size + 10) * 2);
      }
    }
  }

  // Draw nodes
  for (let node of nodes) {
    noStroke();
    fill(node.hue, 80, 90);
    ellipse(node.x, node.y, node.size);
  }
}
