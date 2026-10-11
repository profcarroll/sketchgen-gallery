function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Pre-compute tile shapes for performance
  tiles = [];
  let tileSize = 60;
  let cols = width / tileSize + 2;
  let rows = height / tileSize + 2;
  
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      tiles.push({
        x: x * tileSize,
        y: y * tileSize,
        hue: (x * 13 + y * 7) % 360,
        saturation: 80 + sin(x * 0.1 + y * 0.1) * 20,
        brightness: 70 + cos(x * 0.05 + y * 0.05) * 20,
        offset: createVector(x, y)
      });
    }
  }
}

function draw() {
  let time = millis() * 0.0001;
  
  // Deep shifting background
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let hue = (200 + sin(time * 0.3 + inter * 2) * 40) % 360;
    fill(hue, 70, 85, 1);
    rect(0, y, width, 1);
  }
  
  // Draw tiles with subtle undulation
  for (let tile of tiles) {
    let offset = sin(time * 0.5 + tile.offset.x * 0.1 + tile.offset.y * 0.1) * 3;
    
    // Tile shape: a hexagon
    let points = [];
    let radius = 25;
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i + time * 0.1;
      let x = tile.x + offset + cos(angle) * (radius + sin(time * 0.7 + i) * 3);
      let y = tile.y + offset + sin(angle) * (radius + cos(time * 0.7 + i) * 3);
      points.push({x, y});
    }
    
    // Fill with dynamic color
    fill((tile.hue + time * 10) % 360, tile.saturation, tile.brightness, 1);
    beginShape();
    for (let p of points) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    
    // Dark grout lines
    stroke(0, 0, 0, 0.7);
    strokeWeight(2);
    beginShape();
    for (let p of points) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);
    noStroke();
  }
  
  // Subtle shifting overlay
  let overlayAlpha = 0.05 + sin(time * 0.2) * 0.03;
  fill(240, 20, 100, overlayAlpha);
  rect(0, 0, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
