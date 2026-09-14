function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Helvetica', 24);
  textAlign(LEFT, TOP);
  noLoop();
}

function draw() {
  background(255);
  
  // Define grid parameters
  const margin = 40;
  const cellWidth = (width - 2 * margin) / 12;
  const cellHeight = (height - 2 * margin) / 8;
  
  // Draw title block (large, bold)
  fill(0);
  textSize(48);
  text('SWISS', margin, margin);
  textSize(36);
  text('DESIGN', margin + cellWidth * 3, margin);
  
  // Draw subtitle
  textSize(24);
  text('EXHIBITION POSTER', margin, margin + cellHeight * 2);
  
  // Draw supporting text blocks
  textSize(18);
  text('GRID SYSTEM', margin, margin + cellHeight * 4);
  text('TYPOGRAPHY', margin + cellWidth * 3, margin + cellHeight * 4);
  text('VISUAL CONTRAST', margin + cellWidth * 6, margin + cellHeight * 4);
  
  // Draw geometric elements
  stroke(0);
  noFill();
  rect(margin, margin + cellHeight * 5, cellWidth * 3, cellHeight * 2);
  rect(margin + cellWidth * 4, margin + cellHeight * 5, cellWidth * 3, cellHeight * 2);
  rect(margin + cellWidth * 8, margin + cellHeight * 5, cellWidth * 3, cellHeight * 2);
  
  // Draw additional text within geometric shapes
  textSize(14);
  text('FORM', margin + 10, margin + cellHeight * 6);
  text('FUNCTION', margin + cellWidth * 4 + 10, margin + cellHeight * 6);
  text('PERFORMANCE', margin + cellWidth * 8 + 10, margin + cellHeight * 6);
  
  // Draw footer
  textSize(12);
  text('© 2023 SWISS DESIGN SYSTEM', margin, height - 30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
