function setup() {
  createCanvas(800, 800);
  noLoop();
}

function draw() {
  background(255);
  
  // Draw border with interlocking chevron and triangle pattern
  drawBorder();
  
  // Draw central Persian rug pattern
  drawRugPattern();
}

function drawBorder() {
  const borderSize = 40;
  const gridSize = 20;
  
  // Fill border area with deep jewel tones
  fill(139, 69, 19); // Brown
  noStroke();
  rect(0, 0, width, borderSize); // Top
  rect(0, height - borderSize, width, borderSize); // Bottom
  rect(0, 0, borderSize, height); // Left
  rect(width - borderSize, 0, borderSize, height); // Right
  
  // Draw interlocking chain pattern
  stroke(255);
  strokeWeight(2);
  
  for (let x = borderSize; x < width - borderSize; x += gridSize) {
    // Chevron pattern
    beginShape();
    vertex(x, borderSize);
    vertex(x + gridSize/2, borderSize + gridSize/2);
    vertex(x + gridSize, borderSize);
    endShape(CLOSE);
    
    // Triangle pattern
    beginShape();
    vertex(x + gridSize, borderSize);
    vertex(x + gridSize/2, borderSize + gridSize/2);
    vertex(x, borderSize);
    endShape(CLOSE);
  }
  
  for (let y = borderSize; y < height - borderSize; y += gridSize) {
    // Chevron pattern
    beginShape();
    vertex(borderSize, y);
    vertex(borderSize + gridSize/2, y + gridSize/2);
    vertex(borderSize, y + gridSize);
    endShape(CLOSE);
    
    // Triangle pattern
    beginShape();
    vertex(borderSize, y + gridSize);
    vertex(borderSize + gridSize/2, y + gridSize/2);
    vertex(borderSize, y);
    endShape(CLOSE);
  }
}

function drawRugPattern() {
  const centerX = width / 2;
  const centerY = height / 2;
  const patternSize = 300;
  
  // Use jewel tones for the central pattern
  const colors = [
    [128, 0, 128], // Purple
    [0, 100, 0],   // Dark Green
    [0, 0, 139],   // Dark Blue
    [139, 0, 0],   // Dark Red
    [255, 140, 0]  // Dark Orange
  ];
  
  // Draw lattice grid
  stroke(0);
  strokeWeight(1);
  noFill();
  
  for (let i = 0; i < 5; i++) {
    const spacing = patternSize / (i + 2);
    for (let x = centerX - patternSize/2; x <= centerX + patternSize/2; x += spacing) {
      for (let y = centerY - patternSize/2; y <= centerY + patternSize/2; y += spacing) {
        // Draw a stylized flower motif
        drawFlower(x, y, spacing / 3, colors[i % colors.length]);
      }
    }
  }
  
  // Add decorative symmetry lines
  stroke(0);
  strokeWeight(1);
  line(centerX - patternSize/2, centerY, centerX + patternSize/2, centerY);
  line(centerX, centerY - patternSize/2, centerX, centerY + patternSize/2);
  line(centerX - patternSize/2, centerY - patternSize/2, centerX + patternSize/2, centerY + patternSize/2);
  line(centerX - patternSize/2, centerY + patternSize/2, centerX + patternSize/2, centerY - patternSize/2);
}

function drawFlower(x, y, size, color) {
  fill(color[0], color[1], color[2]);
  noStroke();
  
  // Draw petals
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI * i / 6;
    const petalX = x + cos(angle) * size * 1.5;
    const petalY = y + sin(angle) * size * 1.5;
    
    push();
    translate(petalX, petalY);
    rotate(angle);
    ellipse(0, 0, size * 2, size);
    pop();
  }
  
  // Draw center
  fill(255);
  ellipse(x, y, size / 2, size / 2);
}
