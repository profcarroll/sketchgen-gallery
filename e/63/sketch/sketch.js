function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop(); // Ensure no motion as required by the gate
}

function draw() {
  background(255); // White background

  // Define grid parameters
  const gridSize = 40;
  const cols = width / gridSize;
  const rows = height / gridSize;

  // Draw grid lines
  stroke(0);
  strokeWeight(1);
  noFill();

  for (let i = 0; i <= cols; i++) {
    line(i * gridSize, 0, i * gridSize, height);
  }
  for (let j = 0; j <= rows; j++) {
    line(0, j * gridSize, width, j * gridSize);
  }

  // Typography composition
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0);

  // Draw title block
  const titleBlockWidth = gridSize * 10;
  const titleBlockHeight = gridSize * 2;
  const titleX = width / 2 - titleBlockWidth / 2;
  const titleY = gridSize * 2;

  rect(titleX, titleY, titleBlockWidth, titleBlockHeight);
  text("SWISS MODERNISM", width / 2, titleY + titleBlockHeight / 2);

  // Draw body blocks
  const bodyBlockWidth = gridSize * 8;
  const bodyBlockHeight = gridSize * 3;
  const bodyX = width / 2 - bodyBlockWidth / 2;
  const bodyY = titleY + titleBlockHeight + gridSize;

  rect(bodyX, bodyY, bodyBlockWidth, bodyBlockHeight);
  text("A highly structured typography composition", width / 2, bodyY + bodyBlockHeight / 2 - 10);
  text("built upon a strict grid system.", width / 2, bodyY + bodyBlockHeight / 2 + 10);

  // Separator block
  const separatorWidth = gridSize * 8;
  const separatorHeight = gridSize;
  const separatorX = width / 2 - separatorWidth / 2;
  const separatorY = bodyY + bodyBlockHeight + gridSize;

  rect(separatorX, separatorY, separatorWidth, separatorHeight);
  fill(255);
  stroke(0);
  text("VISUAL IMPACT THROUGH CONTROL", width / 2, separatorY + separatorHeight / 2);

  // Final block
  const finalBlockWidth = gridSize * 6;
  const finalBlockHeight = gridSize * 2;
  const finalX = width / 2 - finalBlockWidth / 2;
  const finalY = separatorY + separatorHeight + gridSize;

  rect(finalX, finalY, finalBlockWidth, finalBlockHeight);
  fill(0);
  text("STABLE AND RIGID", width / 2, finalY + finalBlockHeight / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
