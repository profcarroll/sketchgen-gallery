function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Pre-compute grid cells
  cells = [];
  let cellSize = 60;
  let cols = width / cellSize + 2;
  let rows = height / cellSize + 2;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push({
        x: x * cellSize,
        y: y * cellSize,
        sizeX: cellSize * (0.7 + sin(x * 0.1 + y * 0.1) * 0.3),
        sizeY: cellSize * (0.7 + cos(x * 0.1 + y * 0.1) * 0.3),
        hue: (x * 17 + y * 11) % 360,
        saturation: 70 + sin(x * 0.05 + y * 0.05) * 20,
        brightness: 60 + cos(x * 0.03 + y * 0.03) * 20,
        offset: createVector(x, y)
      });
    }
  }
}

function draw() {
  let time = millis() * 0.0002;
  
  // Deep shifting background gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let hue = (220 + sin(time * 0.2 + inter * 3) * 40) % 360;
    fill(hue, 80, 90, 1);
    rect(0, y, width, 1);
  }
  
  // Draw grid lines with subtle undulation
  for (let cell of cells) {
    let offset = sin(time * 0.4 + cell.offset.x * 0.1 + cell.offset.y * 0.1) * 5;
    
    // Draw a rectangle with slightly distorted edges
    let w = cell.sizeX;
    let h = cell.sizeY;
    
    // Create a soft, organic shape with slight warping
    beginShape();
    vertex(cell.x + offset, cell.y + offset);
    vertex(cell.x + w + offset * 0.5, cell.y + offset);
    vertex(cell.x + w + offset * 0.5, cell.y + h + offset * 0.5);
    vertex(cell.x + offset, cell.y + h + offset * 0.5);
    endShape(CLOSE);
    
    // Fill with dynamic color
    fill((cell.hue + time * 20) % 360, cell.saturation, cell.brightness, 0.8);
    
    // Draw the grid structure as lines
    stroke(0, 0, 0, 0.1);
    strokeWeight(1);
    line(cell.x, cell.y, cell.x + w, cell.y);
    line(cell.x, cell.y, cell.x, cell.y + h);
    line(cell.x + w, cell.y, cell.x + w, cell.y + h);
    line(cell.x, cell.y + h, cell.x + w, cell.y + h);
  }
  
  // Subtle shifting overlay
  let overlayAlpha = 0.03 + sin(time * 0.15) * 0.02;
  fill(240, 15, 100, overlayAlpha);
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
