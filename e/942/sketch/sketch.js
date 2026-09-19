let pattern;
let centerX, centerY;
let gridSpacing = 40;
let numCols, numRows;
let floralMotifs = [];
let geometricBands = [];

function setup() {
  createCanvas(800, 800);
  noLoop();
  colorMode(HSB, 360, 100, 100, 1);
  rectMode(CENTER);
  ellipseMode(CENTER);

  centerX = width / 2;
  centerY = height / 2;
  numCols = Math.ceil(width / gridSpacing) + 1;
  numRows = Math.ceil(height / gridSpacing) + 1;

  // Generate floral motifs
  for (let i = 0; i < 15; i++) {
    let x = random(gridSpacing, width - gridSpacing);
    let y = random(gridSpacing, height - gridSpacing);
    let size = random(20, 40);
    let hue = random(20, 40); // Sapphire tones
    floralMotifs.push({ x, y, size, hue });
  }

  // Generate geometric bands
  for (let i = 0; i < 3; i++) {
    let y = height * (0.1 + i * 0.2);
    let bandHeight = gridSpacing * 0.8;
    geometricBands.push({ y, bandHeight });
  }

  // Draw the pattern once
  drawPattern();
}

function draw() {
  // Already drawn in setup()
}

function drawPattern() {
  background(20); // Deep blue background

  // Draw central floral motifs
  for (let motif of floralMotifs) {
    fill(motif.hue, 80, 70);
    noStroke();
    drawFloralMotif(motif.x, motif.y, motif.size);
  }

  // Draw geometric bands
  for (let band of geometricBands) {
    stroke(30, 60, 80);
    strokeWeight(2);
    noFill();
    rect(centerX, band.y, width * 0.9, band.bandHeight);
    
    // Add geometric patterns to the band
    let numPatterns = 10;
    for (let i = 0; i < numPatterns; i++) {
      let x = map(i, 0, numPatterns - 1, centerX - width * 0.45, centerX + width * 0.45);
      drawGeometricPattern(x, band.y, band.bandHeight);
    }
  }

  // Draw main lattice grid
  stroke(30, 40, 60);
  strokeWeight(1);
  for (let x = 0; x < width; x += gridSpacing) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += gridSpacing) {
    line(0, y, width, y);
  }

  // Draw decorative borders
  stroke(45, 80, 90);
  strokeWeight(3);
  noFill();
  rect(centerX, centerY, width * 0.95, height * 0.95);

  // Add intricate weaving lines
  stroke(25, 70, 80);
  strokeWeight(0.5);
  for (let x = 0; x < width; x += gridSpacing * 2) {
    for (let y = 0; y < height; y += gridSpacing * 2) {
      line(x, y, x + gridSpacing, y + gridSpacing);
      line(x + gridSpacing, y, x, y + gridSpacing);
    }
  }
}

function drawFloralMotif(x, y, size) {
  // Draw a stylized flower
  push();
  translate(x, y);
  
  // Center petal
  ellipse(0, 0, size * 1.2, size * 1.2);
  
  // Surrounding petals
  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI / 8 * i;
    let px = cos(angle) * size * 0.7;
    let py = sin(angle) * size * 0.7;
    ellipse(px, py, size * 0.6, size * 0.6);
  }
  
  // Center
  fill(30, 80, 90);
  ellipse(0, 0, size * 0.3, size * 0.3);
  
  pop();
}

function drawGeometricPattern(x, y, height) {
  strokeWeight(1);
  let patternSize = height * 0.7;
  rect(x, y, patternSize, patternSize, 5);
  
  // Inner pattern
  push();
  translate(x, y);
  rotate(PI/4);
  rect(0, 0, patternSize * 0.6, patternSize * 0.6, 3);
  pop();
}
