function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(48);
  textFont('Arial');
  noLoop();
}

function draw() {
  background(255);
  
  // Grid parameters with rhythmic spacing
  const cols = 12;
  const rows = 8;
  const baseCellWidth = width / cols;
  const baseCellHeight = height / rows;
  
  // Typography elements
  fill(0);
  noStroke();
  
  // Title block (large text)
  rect(0, 0, width, baseCellHeight * 2);
  fill(255);
  textSize(36);
  text("EXHIBITION", width/2, baseCellHeight);
  textSize(24);
  text("POSTER", width/2, baseCellHeight * 1.5);
  
  // Grid-based layout with rhythmic spacing
  textSize(16);
  fill(0);
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (i === 0 && j === 0) continue; // Skip title area
      if (i === cols - 1 && j === rows - 1) continue; // Skip last cell
      
      // Apply rhythmic spacing variation
      const rhythmFactor = sin(i * 0.5) * 0.1 + cos(j * 0.3) * 0.1;
      const cellWidth = baseCellWidth * (1 + rhythmFactor);
      const cellHeight = baseCellHeight * (1 + rhythmFactor * 0.5);
      
      const x = i * baseCellWidth;
      const y = j * baseCellHeight;
      
      // Alternate between text and geometric shapes
      if ((i + j) % 2 === 0) {
        // Geometric shapes with rhythmic positioning
        rect(x + cellWidth/4, y + cellHeight/4, cellWidth/2, cellHeight/2);
      } else {
        // Text elements
        text("TYPE", x + cellWidth/2, y + cellHeight/2);
      }
    }
  }
  
  // Footer block
  rect(0, height - baseCellHeight * 1.5, width, baseCellHeight * 1.5);
  fill(255);
  textSize(14);
  text("SWISS STYLE", width/2, height - baseCellHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
