let tiles = [];
let centerX, centerY;
let spiralRadius;
let tileCount = 100;
let angleOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  centerX = width / 2;
  centerY = height / 2;
  spiralRadius = min(width, height) * 0.4;

  // Create ceramic tiles in a spiral pattern
  for (let i = 0; i < tileCount; i++) {
    let angle = (TWO_PI / tileCount) * i + angleOffset;
    let radius = spiralRadius * (1 - i / tileCount);
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    
    tiles.push({
      x: x,
      y: y,
      angle: angle,
      radius: radius,
      size: random(30, 60),
      hueOffset: random(360)
    });
  }
}

function draw() {
  background(200, 20, 95); // Sky blue background
  
  // Update spiral animation
  angleOffset += 0.005;
  
  // Draw tiles in spiral pattern
  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];
    
    // Update tile position based on spiral motion
    tile.angle += 0.002;
    tile.radius = spiralRadius * (1 - i / tileCount);
    tile.x = centerX + cos(tile.angle) * tile.radius;
    tile.y = centerY + sin(tile.angle) * tile.radius;
    
    // Draw ceramic tile with landscape pattern
    push();
    translate(tile.x, tile.y);
    rotate(tile.angle + PI/4);
    
    // Tile base color (ceramic)
    let baseHue = (tile.hueOffset + frameCount * 0.5) % 360;
    fill(baseHue, 20, 80);
    stroke(0, 0, 70);
    strokeWeight(1);
    
    // Draw tile shape
    rectMode(CENTER);
    rect(0, 0, tile.size, tile.size, 5); // Rounded corners
    
    // Draw landscape pattern on tile
    drawLandscapePattern(tile.size, baseHue);
    
    pop();
  }
}

function drawLandscapePattern(size, baseHue) {
  // Draw a seamless optical flow of landscape
  let patternSize = size * 0.8;
  
  // Sky portion (top)
  fill((baseHue + 120) % 360, 30, 90);
  rect(0, -patternSize/4, patternSize, patternSize/2);
  
  // Ground portion (bottom)
  fill((baseHue + 60) % 360, 40, 50);
  rect(0, patternSize/4, patternSize, patternSize/2);
  
  // Horizon line with optical flow
  stroke((baseHue + 180) % 360, 50, 70);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i <= 10; i++) {
    let x = map(i, 0, 10, -patternSize/2, patternSize/2);
    let y = sin(frameCount * 0.02 + i * 0.5) * 5;
    vertex(x, y);
  }
  endShape();
  
  // Add some texture to the tile
  stroke((baseHue + 240) % 360, 20, 60);
  strokeWeight(1);
  for (let i = 0; i < 5; i++) {
    let x = random(-patternSize/2, patternSize/2);
    let y = random(-patternSize/2, patternSize/2);
    point(x, y);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
