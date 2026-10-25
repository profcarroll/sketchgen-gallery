function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(15);

  // Grid parameters
  gridSpacing = 40;
  cols = ceil(width / gridSpacing) + 2;
  rows = ceil(height / gridSpacing) + 2;

  // Initialize mycelium network
  network = [];
  for (let i = 0; i < 50; i++) {
    network.push({
      x: random(width),
      y: random(height),
      segments: [],
      age: 0,
      maxAge: 100 + floor(random(200)),
      hue: 20 + floor(random(30)),
      alpha: 0.7 + random(0.3)
    });
  }

  // Create initial grid
  grid = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      grid.push({
        x: x * gridSpacing - gridSpacing,
        y: y * gridSpacing - gridSpacing,
        active: random() > 0.7
      });
    }
  }
}

function draw() {
  background(240, 10, 5, 1);

  // Draw grid
  stroke(180, 20, 80, 0.3);
  strokeWeight(0.5);
  for (let i = 0; i < grid.length; i++) {
    const cell = grid[i];
    if (cell.active) {
      line(cell.x, cell.y, cell.x + gridSpacing, cell.y + gridSpacing);
      line(cell.x + gridSpacing, cell.y, cell.x, cell.y + gridSpacing);
    }
  }

  // Update and draw mycelium
  for (let i = 0; i < network.length; i++) {
    const node = network[i];
    node.age++;

    if (node.age > node.maxAge) {
      // Reset dead node
      node.x = random(width);
      node.y = random(height);
      node.segments = [];
      node.age = 0;
      node.maxAge = 100 + floor(random(200));
    }

    // Add new segment occasionally
    if (random() > 0.95 && node.segments.length < 50) {
      const angle = random(TWO_PI);
      const length = 5 + random(15);
      const newX = node.x + cos(angle) * length;
      const newY = node.y + sin(angle) * length;

      node.segments.push({
        x: node.x,
        y: node.y,
        endX: newX,
        endY: newY,
        hue: node.hue,
        alpha: node.alpha
      });
    }

    // Draw segments
    for (let j = 0; j < node.segments.length; j++) {
      const seg = node.segments[j];
      stroke(seg.hue, 80, 90, seg.alpha);
      strokeWeight(1 + random(1));
      line(seg.x, seg.y, seg.endX, seg.endY);
    }

    // Update node position slightly
    node.x += random(-0.5, 0.5);
    node.y += random(-0.5, 0.5);

    // Keep within bounds
    if (node.x < 0) node.x = width;
    if (node.x > width) node.x = 0;
    if (node.y < 0) node.y = height;
    if (node.y > height) node.y = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = ceil(width / gridSpacing) + 2;
  rows = ceil(height / gridSpacing) + 2;
}
