let pattern;
let gridSize = 40;
let borderSize = 80;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
  
  // Create a pattern texture
  pattern = createGraphics(width, height);
  pattern.colorMode(HSB, 360, 100, 100, 1);
  pattern.background(0, 0, 10);
  
  drawPattern();
}

function draw() {
  background(0, 0, 10);
  
  // Draw the pattern
  image(pattern, 0, 0);
  
  // Draw border
  drawBorder();
}

function drawPattern() {
  pattern.noStroke();
  
  // Draw main motifs
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      if ((x + y) % (gridSize * 2) === 0) {
        drawMotif1(pattern, x + gridSize/2, y + gridSize/2);
      } else if ((x - y) % (gridSize * 2) === 0) {
        drawMotif2(pattern, x + gridSize/2, y + gridSize/2);
      } else {
        drawMotif3(pattern, x + gridSize/2, y + gridSize/2);
      }
    }
  }
  
  // Draw lattice grid
  pattern.stroke(0, 0, 100, 0.2);
  pattern.strokeWeight(1);
  
  for (let y = 0; y < height; y += gridSize) {
    pattern.line(0, y, width, y);
  }
  
  for (let x = 0; x < width; x += gridSize) {
    pattern.line(x, 0, x, height);
  }
}

function drawMotif1(g, x, y) {
  g.push();
  g.translate(x, y);
  g.rotate(frameCount * 0.01);
  
  // Outer ring
  g.fill(240, 80, 50);
  g.ellipse(0, 0, gridSize * 0.9, gridSize * 0.9);
  
  // Inner ring
  g.fill(0, 0, 100);
  g.ellipse(0, 0, gridSize * 0.6, gridSize * 0.6);
  
  // Crescent shape
  g.fill(240, 80, 50);
  g.beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = map(i, 0, 9, 0, TWO_PI);
    let r = gridSize * 0.3;
    let px = cos(angle) * r;
    let py = sin(angle) * r;
    g.vertex(px, py);
  }
  g.endShape(CLOSE);
  
  g.pop();
}

function drawMotif2(g, x, y) {
  g.push();
  g.translate(x, y);
  g.rotate(frameCount * -0.01);
  
  // Rhombus pattern
  g.fill(300, 70, 40);
  g.beginShape();
  g.vertex(0, -gridSize/2);
  g.vertex(gridSize/2, 0);
  g.vertex(0, gridSize/2);
  g.vertex(-gridSize/2, 0);
  g.endShape(CLOSE);
  
  // Inner diamond
  g.fill(0, 0, 100);
  g.beginShape();
  g.vertex(0, -gridSize/4);
  g.vertex(gridSize/4, 0);
  g.vertex(0, gridSize/4);
  g.vertex(-gridSize/4, 0);
  g.endShape(CLOSE);
  
  g.pop();
}

function drawMotif3(g, x, y) {
  g.push();
  g.translate(x, y);
  g.rotate(frameCount * 0.02);
  
  // Knotwork pattern
  g.stroke(180, 70, 60);
  g.strokeWeight(2);
  g.noFill();
  
  g.beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = map(i, 0, 4, 0, TWO_PI);
    let r = gridSize * 0.4;
    let px = cos(angle) * r;
    let py = sin(angle) * r;
    g.vertex(px, py);
  }
  g.endShape(CLOSE);
  
  // Inner pattern
  g.stroke(120, 80, 50);
  g.beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = map(i, 0, 4, 0, TWO_PI) + PI/5;
    let r = gridSize * 0.2;
    let px = cos(angle) * r;
    let py = sin(angle) * r;
    g.vertex(px, py);
  }
  g.endShape(CLOSE);
  
  g.pop();
}

function drawBorder() {
  // Draw a border band
  noStroke();
  fill(0, 0, 100, 0.2);
  
  rect(0, 0, width, borderSize);           // Top
  rect(0, height - borderSize, width, borderSize);  // Bottom
  rect(0, 0, borderSize, height);          // Left
  rect(width - borderSize, 0, borderSize, height);  // Right
  
  // Draw decorative border elements
  stroke(240, 80, 50);
  strokeWeight(3);
  
  for (let i = 0; i < 10; i++) {
    let x = map(i, 0, 9, borderSize, width - borderSize);
    line(x, borderSize, x, 0);
    line(x, height - borderSize, x, height);
  }
  
  for (let i = 0; i < 10; i++) {
    let y = map(i, 0, 9, borderSize, height - borderSize);
    line(borderSize, y, 0, y);
    line(width - borderSize, y, width, y);
  }
}
