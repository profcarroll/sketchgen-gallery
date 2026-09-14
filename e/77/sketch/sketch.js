function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Arial');
  textSize(140);
  textAlign(CENTER, CENTER);
  noLoop();
}

function draw() {
  background(255);
  
  // Create a grid system for Swiss Style composition
  const cols = 12;
  const rows = 8;
  const colWidth = width / cols;
  const rowHeight = height / rows;
  
  // Draw grid lines (very faint, almost invisible)
  stroke(200);
  strokeWeight(0.5);
  for (let i = 0; i <= cols; i++) {
    line(i * colWidth, 0, i * colWidth, height);
  }
  for (let j = 0; j <= rows; j++) {
    line(0, j * rowHeight, width, j * rowHeight);
  }
  
  // Main typographic elements
  fill(0);
  noStroke();
  
  // Large asymmetric letterforms
  textSize(140);
  text('SWISS', colWidth * 2, rowHeight * 3);
  text('STYLE', colWidth * 7, rowHeight * 5);
  
  // Subtle supporting text
  textSize(24);
  text('DESIGN PRINCIPLES', colWidth * 6, rowHeight * 7);
  
  // Structural elements - rectangles for visual tension
  noFill();
  stroke(0);
  strokeWeight(2);
  rect(colWidth * 1, rowHeight * 1, colWidth * 4, rowHeight * 2);
  rect(colWidth * 7, rowHeight * 5, colWidth * 3, rowHeight * 2);
  
  // Minimal visual elements for contrast
  fill(0);
  noStroke();
  ellipse(colWidth * 10, rowHeight * 2, 20, 20);
  ellipse(colWidth * 2, rowHeight * 6, 20, 20);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
