function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Pre-compute grid cells for the tessellation
  cells = [];
  let cellSize = 80;
  let cols = width / cellSize + 2;
  let rows = height / cellSize + 2;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push({
        x: x * cellSize,
        y: y * cellSize,
        sizeX: cellSize * (0.8 + sin(x * 0.1 + y * 0.1) * 0.2),
        sizeY: cellSize * (0.8 + cos(x * 0.1 + y * 0.1) * 0.2),
        hue: (x * 13 + y * 7) % 360,
        saturation: 65 + sin(x * 0.04 + y * 0.04) * 15,
        brightness: 55 + cos(x * 0.02 + y * 0.02) * 15,
        offset: createVector(x, y)
      });
    }
  }
}

function draw() {
  // Deep shifting background gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let hue = (230 + sin(inter * 2) * 30) % 360;
    fill(hue, 70, 85, 1);
    rect(0, y, width, 1);
  }
  
  // Draw the beeswax tessellation
  for (let cell of cells) {
    // Draw a soft, irregular polygon
    beginShape();
    let w = cell.sizeX;
    let h = cell.sizeY;
    
    // Add subtle distortion to vertices
    let distort = 8;
    vertex(cell.x + distort, cell.y + distort);
    vertex(cell.x + w - distort, cell.y + distort);
    vertex(cell.x + w - distort * 0.5, cell.y + h - distort * 0.5);
    vertex(cell.x + distort * 0.5, cell.y + h - distort * 0.5);
    endShape(CLOSE);
    
    // Fill with warm amber color
    fill(cell.hue, cell.saturation, cell.brightness, 0.9);
    
    // Draw inner detail lines
    stroke(0, 0, 0, 0.1);
    strokeWeight(0.5);
    line(cell.x + w * 0.2, cell.y, cell.x + w * 0.2, cell.y + h);
    line(cell.x + w * 0.8, cell.y, cell.x + w * 0.8, cell.y + h);
    line(cell.x, cell.y + h * 0.3, cell.x + w, cell.y + h * 0.3);
    line(cell.x, cell.y + h * 0.7, cell.x + w, cell.y + h * 0.7);
    
    // Draw cross-hatching
    stroke(0, 0, 10, 0.05);
    strokeWeight(0.2);
    for (let i = 0; i < 3; i++) {
      let offset = i * w / 3;
      line(cell.x + offset, cell.y, cell.x + offset, cell.y + h);
    }
    for (let i = 0; i < 3; i++) {
      let offset = i * h / 3;
      line(cell.x, cell.y + offset, cell.x + w, cell.y + offset);
    }
  }
  
  // Draw the petrified wood frame
  noFill();
  stroke(0, 0, 10, 0.5);
  strokeWeight(40);
  rect(0, 0, width, height);
  
  // Inner grooves in the frame
  stroke(0, 0, 5, 0.3);
  strokeWeight(20);
  rect(20, 20, width - 40, height - 40);
  
  // Even finer grooves
  stroke(0, 0, 15, 0.2);
  strokeWeight(10);
  rect(40, 40, width - 80, height - 80);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
