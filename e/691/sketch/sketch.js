function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  background(10);
  
  // Draw HAL-2000's face structure
  drawFaceStructure();
  
  // Add glowing indicators
  drawIndicators();
}

function drawFaceStructure() {
  const w = width * 0.6;
  const h = height * 0.7;
  const x = (width - w) / 2;
  const y = (height - h) / 2;
  
  // Main face panel
  fill(30);
  stroke(150);
  strokeWeight(2);
  rect(x, y, w, h, 20);
  
  // Panel joints and seams
  stroke(80);
  strokeWeight(1);
  
  // Vertical seams
  for (let i = 0; i < 5; i++) {
    const seamX = x + (w / 5) * i;
    line(seamX, y, seamX, y + h);
  }
  
  // Horizontal seams
  for (let i = 0; i < 4; i++) {
    const seamY = y + (h / 4) * i;
    line(x, seamY, x + w, seamY);
  }
  
  // Geometric grid pattern
  stroke(60);
  strokeWeight(0.5);
  for (let i = 0; i < 12; i++) {
    const gridX = x + (w / 12) * i;
    line(gridX, y, gridX, y + h);
  }
  
  for (let i = 0; i < 10; i++) {
    const gridY = y + (h / 10) * i;
    line(x, gridY, x + w, gridY);
  }
  
  // Central panel with more detail
  const centerX = x + w / 2;
  const centerY = y + h / 2;
  const panelSize = min(w, h) * 0.4;
  
  fill(25);
  stroke(120);
  rect(centerX - panelSize/2, centerY - panelSize/2, panelSize, panelSize, 10);
  
  // Inner grid
  stroke(90);
  strokeWeight(0.3);
  const innerGridSize = panelSize * 0.8;
  for (let i = 0; i < 6; i++) {
    const offset = (innerGridSize / 5) * i;
    line(centerX - panelSize/2 + offset, centerY - panelSize/2, 
         centerX - panelSize/2 + offset, centerY + panelSize/2);
    line(centerX - panelSize/2, centerY - panelSize/2 + offset, 
         centerX + panelSize/2, centerY - panelSize/2 + offset);
  }
  
  // Eye-like panels
  const eyeSize = panelSize * 0.3;
  fill(20);
  rect(centerX - panelSize/2 + 10, centerY - panelSize/4, eyeSize, eyeSize, 5);
  rect(centerX + panelSize/2 - 10 - eyeSize, centerY - panelSize/4, eyeSize, eyeSize, 5);
  
  // Reflective surface details
  stroke(180);
  strokeWeight(0.5);
  for (let i = 0; i < 30; i++) {
    const px = random(centerX - panelSize/2 + 10, centerX + panelSize/2 - 10);
    const py = random(centerY - panelSize/4, centerY + panelSize/4);
    point(px, py);
  }
}

function drawIndicators() {
  // Blue glowing indicators
  fill(0, 50, 150, 180);
  noStroke();
  
  // Top indicators
  ellipse(width * 0.4, height * 0.3, 12, 12);
  ellipse(width * 0.6, height * 0.3, 12, 12);
  
  // Side indicators
  ellipse(width * 0.25, height * 0.5, 8, 8);
  ellipse(width * 0.75, height * 0.5, 8, 8);
  
  // Bottom indicators
  ellipse(width * 0.4, height * 0.7, 10, 10);
  ellipse(width * 0.6, height * 0.7, 10, 10);
  
  // Red indicators
  fill(150, 20, 20, 180);
  
  ellipse(width * 0.3, height * 0.4, 6, 6);
  ellipse(width * 0.7, height * 0.4, 6, 6);
}
