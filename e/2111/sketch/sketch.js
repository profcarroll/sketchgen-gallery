function setup() {
  createCanvas(800, 800);
  noLoop();
}

function draw() {
  background(255);
  
  // Draw geological stratification border
  drawStratifiedBorder();
  
  // Draw central pattern with fault line revealing effect
  drawFaultPattern();
}

function drawStratifiedBorder() {
  const borderSize = 60;
  const layerCount = 5;
  
  // Create layered border with alternating diamond and square shapes
  for (let layer = 0; layer < layerCount; layer++) {
    const offset = layer * 12;
    const colorValue = 150 - layer * 15;
    
    stroke(colorValue);
    strokeWeight(2);
    noFill();
    
    // Top border
    for (let x = borderSize; x < width - borderSize; x += 40) {
      if ((x / 40) % 2 === 0) {
        // Square shape
        rect(x + offset, borderSize + offset, 20, 20);
      } else {
        // Diamond shape
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

function drawFaultPattern() {
  const centerX = width / 2;
  const centerY = height / 2;
  const patternSize = 300;
  
  // Use geological stratification colors
  const colors = [
    [139, 69, 19],   // Brown
    [101, 67, 33],   // Darker brown
    [128, 128, 128], // Gray
    [75, 0, 130],    // Indigo
    [0, 100, 0]      // Dark green
  ];
  
  // Draw fault lines that slowly reveal themselves
  stroke(0);
  strokeWeight(1);
  noFill();
  
  // Create a grid pattern with fault line effect
  for (let i = 0; i < 4; i++) {
    const spacing = patternSize / (i + 3);
    const colorIndex = i % colors.length;
    
    for (let x = centerX - patternSize/2; x <= centerX + patternSize/2; x += spacing) {
      for (let y = centerY - patternSize/2; y <= centerY + patternSize/2; y += spacing) {
        // Draw a stylized motif with fault line reveal effect
        drawFaultMotif(x, y, spacing / 3, colors[colorIndex]);
      }
    }
  }
  
  // Add symmetry lines
  stroke(0);
  strokeWeight(1);
  line(centerX - patternSize/2, centerY, centerX + patternSize/2, centerY);
  line(centerX, centerY - patternSize/2, centerX, centerY + patternSize/2);
  line(centerX - patternSize/2, centerY - patternSize/2, centerX + patternSize/2, centerY + patternSize/2);
  line(centerX - patternSize/2, centerY + patternSize/2, centerX + patternSize/2, centerY - patternSize/2);
}

function drawFaultMotif(x, y, size, color) {
  // Draw a motif with fault line characteristics
  fill(color[0], color[1], color[2]);
  noStroke();
  
  // Central fault line
  rect(x - size/2, y - size*3, size, size*6);
  
  // Fault segments
  push();
  translate(x, y);
  rotate(PI/4);
  rect(-size*2, -size/2, size*4, size);
  pop();
  
  // Additional fault lines for complexity
  stroke(color[0], color[1], color[2]);
  strokeWeight(0.5);
  line(x - size*2, y - size*2, x + size*2, y + size*2);
  line(x - size*2, y + size*2, x + size*2, y - size*2);
}
