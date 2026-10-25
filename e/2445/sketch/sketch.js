function setup() {
  createCanvas(800, 800);
  noLoop();
}

function draw() {
  background(240);
  
  // Draw ceramic tile wall mural with uneven grout lines
  drawCeramicMural();
  
  // Draw outermost border with interlocking chevron shapes
  drawChevronBorder();
}

function drawCeramicMural() {
  const tileSize = 60;
  const rows = height / tileSize;
  const cols = width / tileSize;
  
  // Deep, jeweled tones for ceramic tiles
  const tileColors = [
    [139, 69, 19],   // Brown
    [101, 67, 33],   // Darker brown
    [128, 128, 128], // Gray
    [75, 0, 130],    // Indigo
    [0, 100, 0]      // Dark green
  ];
  
  // Draw ceramic tiles with randomized fractures
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * tileSize;
      const y = row * tileSize;
      
      // Random tile color
      const colorIndex = floor(random(tileColors.length));
      const color = tileColors[colorIndex];
      
      // Draw tile with slight offset for uneven grout effect
      const offsetX = random(-2, 2);
      const offsetY = random(-2, 2);
      
      push();
      translate(offsetX, offsetY);
      
      // Tile base
      fill(color[0], color[1], color[2]);
      stroke(0);
      strokeWeight(1);
      rect(x, y, tileSize, tileSize);
      
      // Random fracture pattern on tile
      if (random() > 0.7) {
        stroke(0);
        strokeWeight(2);
        line(
          x + random(tileSize * 0.2, tileSize * 0.8),
          y + random(tileSize * 0.2, tileSize * 0.8),
          x + random(tileSize * 0.2, tileSize * 0.8),
          y + random(tileSize * 0.2, tileSize * 0.8)
        );
      }
      
      // Random broken tile segments
      if (random() > 0.8) {
        const segmentCount = floor(random(1, 4));
        for (let i = 0; i < segmentCount; i++) {
          const segX = x + random(tileSize * 0.1, tileSize * 0.9);
          const segY = y + random(tileSize * 0.1, tileSize * 0.9);
          const segW = random(5, tileSize * 0.3);
          const segH = random(5, tileSize * 0.3);
          
          fill(color[0] - 20, color[1] - 20, color[2] - 20);
          noStroke();
          rect(segX, segY, segW, segH);
        }
      }
      
      pop();
    }
  }
}

function drawChevronBorder() {
  const borderSize = 60;
  const layerCount = 5;
  
  for (let layer = 0; layer < layerCount; layer++) {
    const offset = layer * 12;
    const colorValue = 150 - layer * 15;
    
    stroke(colorValue);
    strokeWeight(3);
    noFill();
    
    // Top border with interlocking chevrons
    for (let x = borderSize; x < width - borderSize; x += 40) {
      beginShape();
      vertex(x + offset, borderSize + offset);
      vertex(x + offset + 20, borderSize + offset);
      vertex(x + offset + 10, borderSize + offset + 20);
      endShape();
    }
    
    // Bottom border with interlocking chevrons
    for (let x = borderSize; x < width - borderSize; x += 40) {
      beginShape();
      vertex(x + offset, height - borderSize - offset);
      vertex(x + offset + 20, height - borderSize - offset);
      vertex(x + offset + 10, height - borderSize - offset - 20);
      endShape();
    }
    
    // Left border with interlocking chevrons
    for (let y = borderSize; y < height - borderSize; y += 40) {
      beginShape();
      vertex(borderSize + offset, y + offset);
      vertex(borderSize + offset, y + offset + 20);
      vertex(borderSize + offset + 20, y + offset + 10);
      endShape();
    }
    
    // Right border with interlocking chevrons
    for (let y = borderSize; y < height - borderSize; y += 40) {
      beginShape();
      vertex(width - borderSize - offset, y + offset);
      vertex(width - borderSize - offset, y + offset + 20);
      vertex(width - borderSize - offset - 20, y + offset + 10);
      endShape();
    }
  }
}
