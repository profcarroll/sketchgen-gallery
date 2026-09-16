function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(15);
}

function draw() {
  // Background sky with gradient
  drawSky();

  // Distant rock formations
  drawDistantRocks();

  // Ground with detailed cracks and textures
  drawGround();

  // Dust devils drifting across the scene
  drawDustDevils();
}

function drawSky() {
  // Beige sky with terracotta gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let b = lerp(95, 20, inter); // From beige to darker
    fill(40, 10, b, 1); // HSB: terracotta hue
    rect(0, y, width, 1);
  }
}

function drawDistantRocks() {
  // Jagged silhouette of distant rocks
  let rockHeight = height * 0.35;
  let rockY = height - rockHeight;

  // Draw multiple rock shapes
  for (let i = 0; i < 10; i++) {
    let x = map(i, 0, 9, 0, width);
    let h = random(20, 60);
    let w = random(40, 100);

    beginShape();
    vertex(x, rockY);
    for (let j = 0; j < 10; j++) {
      let px = x + j * w / 10;
      let py = rockY - random(0, h);
      vertex(px, py);
    }
    vertex(x + w, rockY);
    endShape(CLOSE);
  }

  // Fill with terracotta color
  fill(15, 60, 40); // Darker terracotta
}

function drawGround() {
  // Base ground texture with cracks and fissures
  fill(20, 30, 35); // Rich terracotta base
  rect(0, height * 0.35, width, height * 0.65);

  // Add crack details
  stroke(10, 40, 20); // Darker crack color
  strokeWeight(1);
  for (let i = 0; i < 1000; i++) {
    let x1 = random(width);
    let y1 = height * 0.35 + random(height * 0.65);
    let x2 = x1 + random(-20, 20);
    let y2 = y1 + random(-20, 20);
    line(x1, y1, x2, y2);
  }

  // Add texture with small rectangles
  noStroke();
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = height * 0.35 + random(height * 0.65);
    let w = random(2, 8);
    let h = random(1, 4);
    fill(15, 25, 30); // Slightly darker for texture
    rect(x, y, w, h);
  }
}

function drawDustDevils() {
  // Faint dust devils drifting across the canvas
  noStroke();
  for (let i = 0; i < 15; i++) {
    let x = (frameCount * 0.2 + i * 30) % width;
    let y = height * 0.4 + sin(frameCount * 0.01 + i) * 30;
    let size = map(sin(frameCount * 0.02 + i), -1, 1, 5, 15);
    
    // Soft dust devil
    fill(30, 20, 60, 0.1); // Light brown with transparency
    ellipse(x, y, size, size * 0.5);
    
    // Add glow effect
    fill(40, 10, 70, 0.05);
    ellipse(x, y, size * 1.5, size * 0.75);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
