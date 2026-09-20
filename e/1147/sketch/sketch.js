function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  background(0);

  // Draw the central field with jewel tones and floral motifs
  const centerX = width / 2;
  const centerY = height / 2;
  const mainSize = min(width, height) * 0.7;
  
  // Draw a lattice grid
  stroke(180, 80, 20);
  strokeWeight(1);
  drawLatticeGrid(centerX, centerY, mainSize);

  // Draw central floral motifs
  drawFloralMotifs(centerX, centerY, mainSize * 0.9);

  // Draw border with interlocking chevron pattern
  drawBorder(centerX, centerY, mainSize);
}

function drawLatticeGrid(x, y, size) {
  const gridSize = size / 12;
  for (let i = -size/2; i <= size/2; i += gridSize) {
    line(x + i, y - size/2, x + i, y + size/2);
    line(x - size/2, y + i, x + size/2, y + i);
  }
}

function drawFloralMotifs(x, y, size) {
  const motifSize = size / 10;
  const numMotifs = 12;
  
  for (let i = 0; i < numMotifs; i++) {
    const angle = TWO_PI * i / numMotifs;
    const rx = x + cos(angle) * size/2.5;
    const ry = y + sin(angle) * size/2.5;
    
    push();
    translate(rx, ry);
    rotate(angle + PI/2);
    drawFloralMotif(motifSize);
    pop();
  }
}

function drawFloralMotif(size) {
  // Stylized flower using ellipses and lines
  fill(10, 80, 60); // Deep red
  noStroke();
  ellipse(0, 0, size * 0.8, size * 0.8);
  
  fill(20, 90, 70); // Orange-red
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI * i / 6;
    ellipse(cos(angle) * size/3, sin(angle) * size/3, size * 0.4, size * 0.4);
  }
  
  stroke(10, 80, 50); // Darker red
  strokeWeight(2);
  line(-size/2, 0, size/2, 0);
  line(0, -size/2, 0, size/2);
}

function drawBorder(x, y, size) {
  const borderSize = size * 0.1;
  
  // Draw outer chain pattern
  stroke(240, 80, 30); // Deep blue
  strokeWeight(3);
  noFill();
  
  // Outer chevron border
  beginShape();
  for (let i = 0; i < 8; i++) {
    const angle = TWO_PI * i / 8;
    const px = x + cos(angle) * (size/2 + borderSize/2);
    const py = y + sin(angle) * (size/2 + borderSize/2);
    vertex(px, py);
    
    const px2 = x + cos(angle) * (size/2 + borderSize/4);
    const py2 = y + sin(angle) * (size/2 + borderSize/4);
    vertex(px2, py2);
  }
  endShape(CLOSE);
  
  // Inner chevron pattern
  stroke(180, 80, 20); // Lighter blue
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < 8; i++) {
    const angle = TWO_PI * i / 8;
    const px = x + cos(angle) * (size/2 - borderSize/2);
    const py = y + sin(angle) * (size/2 - borderSize/2);
    vertex(px, py);
    
    const px2 = x + cos(angle) * (size/2 - borderSize/4);
    const py2 = y + sin(angle) * (size/2 - borderSize/4);
    vertex(px2, py2);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
