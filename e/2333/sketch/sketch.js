let tiles = [];
let time = 0;
let mouseDistortion = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  pixelDensity(1);
  
  // Create a grid of geometric tiles
  let tileSize = 80;
  let cols = ceil(width / tileSize) + 2;
  let rows = ceil(height / tileSize) + 2;
  
  for (let y = -1; y < rows; y++) {
    for (let x = -1; x < cols; x++) {
      tiles.push({
        x: x * tileSize,
        y: y * tileSize,
        size: tileSize,
        hue: random(255),
        saturation: random(150, 255),
        brightness: random(150, 255),
        rotation: random(TWO_PI),
        speedX: random(-0.3, 0.3),
        speedY: random(-0.3, 0.3),
        pulse: random(TWO_PI),
        pulseSpeed: random(0.01, 0.03),
        distortion: random(1),
        segmentCount: floor(random(3, 7)),
        gridX: x,
        gridY: y
      });
    }
  }
}

function draw() {
  time++;
  
  // Semi-transparent background for trail effect
  background(20, 10, 95, 30);
  
  // Update and draw tiles
  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];
    
    // Update tile properties
    tile.x += tile.speedX;
    tile.y += tile.speedY;
    tile.pulse += tile.pulseSpeed;
    tile.rotation += sin(time * 0.01 + i) * 0.005;
    
    // Bounce off edges
    if (tile.x < -tile.size || tile.x > width + tile.size) tile.speedX *= -1;
    if (tile.y < -tile.size || tile.y > height + tile.size) tile.speedY *= -1;
    
    // Apply pulse effect to size and distortion
    let pulseSize = sin(tile.pulse) * 0.3 + 1;
    let finalSize = tile.size * pulseSize;
    
    push();
    translate(tile.x, tile.y);
    rotate(tile.rotation);
    
    // Draw outer shape
    fill(tile.hue, tile.saturation, tile.brightness, 200);
    noStroke();
    
    beginShape();
    for (let j = 0; j < tile.segmentCount; j++) {
      let angle = map(j, 0, tile.segmentCount, 0, TWO_PI) + 
                  tile.distortion * sin(time * 0.01 + j);
      let x = cos(angle) * finalSize;
      let y = sin(angle) * finalSize;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw inner pattern
    fill(255, 30);
    beginShape();
    for (let j = 0; j < tile.segmentCount; j++) {
      let angle = map(j, 0, tile.segmentCount, 0, TWO_PI) + 
                  PI / tile.segmentCount + 
                  tile.distortion * cos(time * 0.01 + j);
      let x = cos(angle) * finalSize * 0.4;
      let y = sin(angle) * finalSize * 0.4;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw connections between nearby tiles (with spatial hash optimization)
  stroke(255, 30);
  noFill();
  beginShape(LINES);
  
  let gridSize = 150;
  let grid = {};
  
  // Grid-based spatial hash
  for (let i = 0; i < tiles.length; i++) {
    let tile = tiles[i];
    let gridX = floor(tile.x / gridSize);
    let gridY = floor(tile.y / gridSize);
    
    if (!grid[gridX]) grid[gridX] = {};
    if (!grid[gridX][gridY]) grid[gridX][gridY] = [];
    grid[gridX][gridY].push(i);
  }
  
  // Only check neighbors in adjacent cells
  for (let x in grid) {
    for (let y in grid[x]) {
      let cellTiles = grid[x][y];
      
      for (let i = 0; i < cellTiles.length; i++) {
        let t1 = tiles[cellTiles[i]];
        
        // Check this cell and adjacent cells
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (grid[parseInt(x) + dx] && grid[parseInt(x) + dx][parseInt(y) + dy]) {
              let neighborTiles = grid[parseInt(x) + dx][parseInt(y) + dy];
              
              for (let j = 0; j < neighborTiles.length; j++) {
                if (cellTiles[i] !== neighborTiles[j]) {
                  let t2 = tiles[neighborTiles[j]];
                  let d = dist(t1.x, t1.y, t2.x, t2.y);
                  
                  // Draw connection if close enough
                  if (d < 150) {
                    vertex(t1.x, t1.y);
                    vertex(t2.x, t2.y);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  
  endShape();
  
  // Mouse interaction
  mouseDistortion = map(mouseX, 0, width, 0, 1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // No audio required for this sketch
}
