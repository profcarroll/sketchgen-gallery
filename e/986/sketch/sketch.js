function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  background(0);

  // Draw top and bottom geometric bands
  drawGeometricBands();

  // Draw woven lattice with floral motifs
  drawWovenPattern();
}

function drawGeometricBands() {
  const bandHeight = height * 0.1;
  
  // Top band
  fill(240, 80, 20);
  rect(0, 0, width, bandHeight);
  
  // Bottom band
  fill(300, 80, 20);
  rect(0, height - bandHeight, width, bandHeight);

  // Draw intricate geometric patterns in bands
  stroke(0, 0, 100);
  strokeWeight(1);
  noFill();
  
  for (let y = 0; y < bandHeight; y += 10) {
    beginShape();
    for (let x = 0; x < width; x += 5) {
      vertex(x, y + sin(x * 0.05) * 3);
    }
    endShape();
  }
}

function drawWovenPattern() {
  const gridSize = 60;
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  
  // Draw lattice grid
  stroke(180, 40, 50, 0.3);
  strokeWeight(1);
  noFill();
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = x * gridSize;
      const py = y * gridSize;
      
      // Draw grid lines
      line(px, py, px + gridSize, py);
      line(px, py, px, py + gridSize);
      
      // Draw floral motifs at intersections
      if ((x + y) % 2 === 0) {
        drawFloralMotif(px + gridSize/2, py + gridSize/2);
      }
    }
  }
}

function drawFloralMotif(x, y) {
  const size = 15;
  
  // Draw petals in different colors
  for (let i = 0; i < 8; i++) {
    const angle = i * TWO_PI / 8;
    const px = x + cos(angle) * size;
    const py = y + sin(angle) * size;
    
    fill((i * 45) % 360, 90, 80);
    noStroke();
    
    // Draw petal as a curved shape
    beginShape();
    vertex(x, y);
    bezierVertex(
      x + cos(angle) * size * 0.7,
      y + sin(angle) * size * 0.7,
      px + cos(angle + PI/4) * size * 0.3,
      py + sin(angle + PI/4) * size * 0.3,
      px, py
    );
    endShape(CLOSE);
  }
  
  // Draw center
  fill(60, 90, 50);
  ellipse(x, y, size * 0.5);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
