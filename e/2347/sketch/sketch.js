function setup() {
  createCanvas(800, 800);
  noLoop();
}

function draw() {
  background(255);
  
  // Draw mathematical border with interlocking shapes
  drawMathematicalBorder();
  
  // Draw central symmetrical floral pattern
  drawSymmetricalFloralPattern();
}

function drawMathematicalBorder() {
  const borderSize = 60;
  const layerCount = 5;
  
  for (let layer = 0; layer < layerCount; layer++) {
    const offset = layer * 12;
    const colorValue = 150 - layer * 15;
    
    stroke(colorValue);
    strokeWeight(2);
    noFill();
    
    // Top border
    for (let x = borderSize; x < width - borderSize; x += 40) {
      if ((x / 40) % 2 === 0) {
        rect(x + offset, borderSize + offset, 20, 20);
      } else {
        beginShape();
        vertex(x + offset + 10, borderSize + offset);
        vertex(x + offset + 20, borderSize + offset + 10);
        vertex(x + offset + 10, borderSize + offset + 20);
        vertex(x + offset, borderSize + offset + 10);
        endShape(CLOSE);
      }
    }
    
    // Bottom border
    for (let x = borderSize; x < width - borderSize; x += 40) {
      if ((x / 40) % 2 === 0) {
        rect(x + offset, height - borderSize - 20 - offset, 20, 20);
      } else {
        beginShape();
        vertex(x + offset + 10, height - borderSize - offset);
        vertex(x + offset + 20, height - borderSize - 10 - offset);
        vertex(x + offset + 10, height - borderSize - offset - 20);
        vertex(x + offset, height - borderSize - 10 - offset);
        endShape(CLOSE);
      }
    }
    
    // Left border
    for (let y = borderSize; y < height - borderSize; y += 40) {
      if ((y / 40) % 2 === 0) {
        rect(borderSize + offset, y + offset, 20, 20);
      } else {
        beginShape();
        vertex(borderSize + offset, y + offset + 10);
        vertex(borderSize + offset + 10, y + offset + 20);
        vertex(borderSize + offset + 20, y + offset + 10);
        vertex(borderSize + offset + 10, y + offset);
        endShape(CLOSE);
      }
    }
    
    // Right border
    for (let y = borderSize; y < height - borderSize; y += 40) {
      if ((y / 40) % 2 === 0) {
        rect(width - borderSize - 20 - offset, y + offset, 20, 20);
      } else {
        beginShape();
        vertex(width - borderSize - offset, y + offset + 10);
        vertex(width - borderSize - 10 - offset, y + offset + 20);
        vertex(width - borderSize - offset - 20, y + offset + 10);
        vertex(width - borderSize - 10 - offset, y + offset);
        endShape(CLOSE);
      }
    }
  }
}

function drawSymmetricalFloralPattern() {
  const centerX = width / 2;
  const centerY = height / 2;
  const patternSize = 300;
  
  // Deep jewel tones for floral motifs
  const colors = [
    [139, 69, 19],   // Brown
    [101, 67, 33],   // Darker brown
    [128, 128, 128], // Gray
    [75, 0, 130],    // Indigo
    [0, 100, 0]      // Dark green
  ];
  
  // Draw central symmetrical floral pattern with organic growth effect
  for (let i = 0; i < 8; i++) {
    const angle = TWO_PI * i / 8;
    const distance = patternSize * 0.3;
    
    push();
    translate(centerX, centerY);
    rotate(angle);
    
    // Draw stylized floral motif
    drawFloralMotif(0, 0, distance, colors[i % colors.length]);
    
    pop();
  }
  
  // Add central symmetry lines
  stroke(0);
  strokeWeight(1);
  line(centerX - patternSize/2, centerY, centerX + patternSize/2, centerY);
  line(centerX, centerY - patternSize/2, centerX, centerY + patternSize/2);
  line(centerX - patternSize/2, centerY - patternSize/2, centerX + patternSize/2, centerY + patternSize/2);
  line(centerX - patternSize/2, centerY + patternSize/2, centerX + patternSize/2, centerY - patternSize/2);
}

function drawFloralMotif(x, y, size, color) {
  // Draw organic floral motifs with mathematical symmetry
  fill(color[0], color[1], color[2]);
  noStroke();
  
  // Central flower
  ellipse(x, y, size * 0.8, size * 0.8);
  
  // Petals arranged symmetrically
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI * i / 6;
    const petalX = x + cos(angle) * size * 0.5;
    const petalY = y + sin(angle) * size * 0.5;
    
    push();
    translate(petalX, petalY);
    rotate(angle);
    ellipse(0, 0, size * 0.4, size * 0.2);
    pop();
  }
  
  // Stem with organic growth
  stroke(color[0], color[1], color[2]);
  strokeWeight(size * 0.05);
  line(x, y, x, y + size * 0.8);
}
