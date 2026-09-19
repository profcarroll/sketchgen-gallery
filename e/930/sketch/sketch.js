let planes = [];
let hexGrid;
let transformTimer = 0;
const TRANSFORM_DURATION = 120; // frames

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize amorphous planes
  for (let i = 0; i < 8; i++) {
    planes.push({
      x: random(width),
      y: random(height),
      size: random(100, 300),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      color: color(random(20, 40), 80, 90, 0.7)
    });
  }
  
  // Create hexagonal grid
  hexGrid = createGraphics(width, height);
  hexGrid.colorMode(HSB, 360, 100, 100, 1);
  hexGrid.background(0, 0, 0, 0);
  hexGrid.stroke(200, 50, 80, 0.1);
  hexGrid.strokeWeight(1);
  
  const hexRadius = 60;
  const hexWidth = hexRadius * 2;
  const hexHeight = sqrt(3) * hexRadius;
  
  for (let x = -hexRadius; x < width + hexWidth; x += hexWidth) {
    for (let y = -hexRadius; y < height + hexHeight; y += hexHeight * 1.5) {
      const offset = (y / (hexHeight * 1.5)) % 2 === 0 ? hexRadius : 0;
      drawHexagon(hexGrid, x + offset, y, hexRadius);
    }
  }
}

function draw() {
  // Background with fade effect
  background(0, 0, 0, 0.05);
  
  // Draw hexagonal grid in the background
  image(hexGrid, 0, 0);
  
  // Update and draw amorphous planes
  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    
    // Animate plane
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    p.angle += random(-0.02, 0.02);
    
    // Wrap around edges
    if (p.x < -p.size) p.x = width + p.size;
    if (p.x > width + p.size) p.x = -p.size;
    if (p.y < -p.size) p.y = height + p.size;
    if (p.y > height + p.size) p.y = -p.size;
    
    // Draw plane with glow effect
    drawGlowingPlane(p);
  }
  
  // Transformation logic
  transformTimer++;
  if (transformTimer > TRANSFORM_DURATION) {
    transformTimer = 0;
  }
  
  // Occasionally show sharp transformation
  if (transformTimer > TRANSFORM_DURATION * 0.8 && transformTimer < TRANSFORM_DURATION) {
    drawSharpGrid();
  }
}

function drawGlowingPlane(p) {
  const t = transformTimer / TRANSFORM_DURATION;
  const glowFactor = map(t, 0.8, 1, 0, 1);
  
  noStroke();
  fill(p.color);
  
  // Create a soft, amorphous shape
  beginShape();
  for (let i = 0; i < 12; i++) {
    const angle = map(i, 0, 12, 0, TWO_PI);
    const dist = p.size * (0.8 + 0.4 * sin(frameCount * 0.01 + i));
    const x = p.x + cos(angle) * dist;
    const y = p.y + sin(angle) * dist;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  // Add glow effect
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = color(p.color);
  fill(p.color);
  beginShape();
  for (let i = 0; i < 12; i++) {
    const angle = map(i, 0, 12, 0, TWO_PI);
    const dist = p.size * (0.8 + 0.4 * sin(frameCount * 0.01 + i));
    const x = p.x + cos(angle) * dist;
    const y = p.y + sin(angle) * dist;
    vertex(x, y);
  }
  endShape(CLOSE);
  drawingContext.shadowBlur = 0;
}

function drawSharpGrid() {
  // Draw sharp grid transformation
  noFill();
  stroke(200, 50, 80, 0.8);
  strokeWeight(2);
  
  const hexRadius = 60;
  const hexWidth = hexRadius * 2;
  const hexHeight = sqrt(3) * hexRadius;
  
  for (let x = -hexRadius; x < width + hexWidth; x += hexWidth) {
    for (let y = -hexRadius; y < height + hexHeight; y += hexHeight * 1.5) {
      const offset = (y / (hexHeight * 1.5)) % 2 === 0 ? hexRadius : 0;
      drawHexagon(null, x + offset, y, hexRadius);
    }
  }
}

function drawHexagon(g, x, y, r) {
  if (g) {
    g.beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = TWO_PI / 6 * i;
      const px = x + cos(angle) * r;
      const py = y + sin(angle) * r;
      g.vertex(px, py);
    }
    g.endShape(CLOSE);
  } else {
    beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = TWO_PI / 6 * i;
      const px = x + cos(angle) * r;
      const py = y + sin(angle) * r;
      vertex(px, py);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
