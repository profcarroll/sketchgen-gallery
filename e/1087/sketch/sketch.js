function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  noLoop();
}

function draw() {
  background(0, 0, 5);

  const tileSize = 80;
  const cols = Math.ceil(width / tileSize) + 2;
  const rows = Math.ceil(height / tileSize) + 2;

  // Draw the main grid with floral motifs
  for (let y = -1; y < rows; y++) {
    for (let x = -1; x < cols; x++) {
      push();
      translate(x * tileSize, y * tileSize);
      
      // Create a subtle offset for the pattern to maintain symmetry
      const offsetX = (x + y) % 2 === 0 ? 0 : tileSize / 2;
      const offsetY = (x + y) % 2 === 0 ? 0 : tileSize / 2;
      translate(offsetX, offsetY);

      // Draw floral motif
      drawFloralMotif(tileSize);
      
      pop();
    }
  }

  // Draw border bands
  drawBorderBands();
}

function drawFloralMotif(size) {
  const hue = (frameCount * 0.5 + size * 0.1) % 360;
  
  // Central circle
  fill(hue, 80, 90);
  ellipse(0, 0, size * 0.4);

  // Petals
  for (let i = 0; i < 8; i++) {
    push();
    rotate(i * PI / 4);
    
    // Petal shape
    fill(hue + 30, 70, 85);
    beginShape();
    vertex(0, 0);
    bezierVertex(size * 0.2, -size * 0.1, size * 0.3, size * 0.1, size * 0.4, 0);
    endShape(CLOSE);
    
    pop();
  }

  // Inner pattern
  fill(hue + 60, 85, 95);
  ellipse(0, 0, size * 0.2);

  // Diagonal lines
  stroke(hue + 120, 70, 80);
  strokeWeight(1);
  for (let i = 0; i < 4; i++) {
    line(-size/3, -size/3, size/3, size/3);
    rotate(PI / 2);
  }
}

function drawBorderBands() {
  const bandHeight = 30;
  
  // Top band
  fill(0, 0, 15);
  rect(0, 0, width, bandHeight);
  
  // Bottom band
  rect(0, height - bandHeight, width, bandHeight);
  
  // Side bands
  rect(0, 0, bandHeight, height);
  rect(width - bandHeight, 0, bandHeight, height);

  // Pattern in bands
  stroke(0, 0, 80);
  strokeWeight(2);
  noFill();
  
  for (let i = 0; i < 10; i++) {
    const x = i * (width / 10);
    
    // Top band pattern
    beginShape();
    vertex(x, bandHeight/2);
    vertex(x + width/20, bandHeight/4);
    vertex(x + width/10, bandHeight/2);
    endShape();
    
    // Bottom band pattern
    beginShape();
    vertex(x, height - bandHeight/2);
    vertex(x + width/20, height - bandHeight/4);
    vertex(x + width/10, height - bandHeight/2);
    endShape();
  }
}

function mousePressed() {
  redraw();
}
