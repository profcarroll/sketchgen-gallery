let pattern;
let tileSize = 40;
let numTilesX, numTilesY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  numTilesX = ceil(width / tileSize);
  numTilesY = ceil(height / tileSize);
  pattern = createGraphics(numTilesX * tileSize, numTilesY * tileSize);
  drawPattern();
}

function draw() {
  background(20);
  image(pattern, 0, 0);
  noLoop();
}

function drawPattern() {
  pattern.background(0);
  pattern.strokeWeight(1);
  
  // Draw main grid
  for (let y = 0; y < numTilesY; y++) {
    for (let x = 0; x < numTilesX; x++) {
      let px = x * tileSize;
      let py = y * tileSize;
      
      // Draw tile background with jewel tones
      if ((x + y) % 2 === 0) {
        pattern.fill(139, 69, 19); // Brown
      } else {
        pattern.fill(128, 0, 128); // Purple
      }
      
      pattern.rect(px, py, tileSize, tileSize);
      
      // Draw decorative elements
      if ((x + y) % 4 === 0) {
        pattern.fill(255, 215, 0); // Gold
        pattern.ellipse(px + tileSize/2, py + tileSize/2, tileSize/3, tileSize/3);
        
        pattern.stroke(255, 215, 0);
        pattern.strokeWeight(1);
        pattern.noFill();
        pattern.arc(px + tileSize/2, py + tileSize/2, tileSize/2, tileSize/2, 0, PI);
      }
      
      // Draw floral motif
      if (x % 3 === 0 && y % 3 === 0) {
        drawFloralMotif(pattern, px + tileSize/2, py + tileSize/2);
      }
    }
  }
  
  // Draw border with alternating squares and diamonds
  pattern.fill(139, 69, 19); // Brown
  pattern.rect(0, height - 40, width, 40);
  
  for (let i = 0; i < width; i += 40) {
    if ((i / 40) % 2 === 0) {
      pattern.fill(128, 0, 128); // Purple
      pattern.rect(i, height - 40, 40, 40);
      
      pattern.fill(255, 215, 0); // Gold
      pattern.triangle(i + 20, height - 40, i + 40, height - 20, i, height - 20);
    } else {
      pattern.fill(255, 215, 0); // Gold
      pattern.rect(i, height - 40, 40, 40);
      
      pattern.fill(128, 0, 128); // Purple
      pattern.triangle(i + 20, height - 40, i + 40, height - 20, i, height - 20);
    }
  }
}

function drawFloralMotif(g, x, y) {
  g.strokeWeight(1);
  
  // Draw central circle
  g.fill(255, 215, 0); // Gold
  g.noStroke();
  g.ellipse(x, y, 10, 10);
  
  // Draw petals
  g.stroke(255, 215, 0);
  g.strokeWeight(1);
  g.fill(139, 69, 19); // Brown
  
  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI * i / 8;
    let px = x + cos(angle) * 15;
    let py = y + sin(angle) * 15;
    g.ellipse(px, py, 8, 8);
  }
  
  // Draw stem
  g.stroke(0, 100, 0); // Green
  g.strokeWeight(2);
  g.line(x, y, x, y + 20);
}
