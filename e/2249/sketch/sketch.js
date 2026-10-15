function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Pre-compute grid cells for the crystal lattice
  cells = [];
  let cellSize = 120;
  let cols = width / cellSize + 2;
  let rows = height / cellSize + 2;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      cells.push({
        x: x * cellSize,
        y: y * cellSize,
        sizeX: cellSize * (0.9 + sin(x * 0.05 + y * 0.03) * 0.1),
        sizeY: cellSize * (0.9 + cos(x * 0.03 + y * 0.05) * 0.1),
        hue: (x * 17 + y * 11) % 360,
        saturation: 70 + sin(x * 0.02 + y * 0.02) * 10,
        brightness: 60 + cos(x * 0.01 + y * 0.01) * 10,
        offset: createVector(x, y)
      });
    }
  }
}

function draw() {
  // Deep shifting background gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let hue = (250 + sin(inter * 3 + frameCount * 0.002) * 20) % 360;
    fill(hue, 60, 80, 1);
    rect(0, y, width, 1);
  }
  
  // Draw the crystal lattice
  for (let cell of cells) {
    // Draw a soft, irregular polygon with subtle distortion
    beginShape();
    let w = cell.sizeX;
    let h = cell.sizeY;
    
    // Add subtle distortion to vertices
    let distort = 10;
    vertex(cell.x + distort, cell.y + distort);
    vertex(cell.x + w - distort, cell.y + distort);
    vertex(cell.x + w - distort * 0.5, cell.y + h - distort * 0.5);
    vertex(cell.x + distort * 0.5, cell.y + h - distort * 0.5);
    endShape(CLOSE);
    
    // Fill with translucent crystal color
    fill(cell.hue, cell.saturation, cell.brightness, 0.7);
    
    // Draw inner structural lines
    stroke(0, 0, 100, 0.15);
    strokeWeight(0.8);
    line(cell.x + w * 0.25, cell.y, cell.x + w * 0.25, cell.y + h);
    line(cell.x + w * 0.75, cell.y, cell.x + w * 0.75, cell.y + h);
    line(cell.x, cell.y + h * 0.25, cell.x + w, cell.y + h * 0.25);
    line(cell.x, cell.y + h * 0.75, cell.x + w, cell.y + h * 0.75);
    
    // Draw cross-hatching with subtle variation
    stroke(0, 0, 100, 0.08);
    strokeWeight(0.3);
    for (let i = 0; i < 4; i++) {
      let offset = i * w / 4;
      line(cell.x + offset, cell.y, cell.x + offset, cell.y + h);
    }
    for (let i = 0; i < 4; i++) {
      let offset = i * h / 4;
      line(cell.x, cell.y + offset, cell.x + w, cell.y + offset);
    }
    
    // Draw subtle center glow
    noStroke();
    fill(cell.hue, cell.saturation, 100, 0.15);
    ellipse(cell.x + w/2, cell.y + h/2, w * 0.3, h * 0.3);
  }
  
  // Draw the geological frame
  noFill();
  stroke(0, 0, 100, 0.1);
  strokeWeight(60);
  rect(0, 0, width, height);
  
  // Inner grooves in the frame
  stroke(0, 0, 100, 0.05);
  strokeWeight(30);
  rect(30, 30, width - 60, height - 60);
  
  // Even finer grooves
  stroke(0, 0, 100, 0.02);
  strokeWeight(15);
  rect(60, 60, width - 120, height - 120);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
