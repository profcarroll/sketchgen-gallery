let tiles = [];
let veins = [];
let mouseRadius = 100;
let pulseSpeed = 0.02;
let pulsePhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateTiles();
  generateVeins();
}

function draw() {
  background(40, 40, 45);
  
  // Update pulse effect
  pulsePhase += pulseSpeed;
  
  // Draw tiles with subtle sheen
  for (let tile of tiles) {
    let tileColor = color(220, 220, 230);
    fill(tileColor);
    noStroke();
    rect(tile.x, tile.y, tile.w, tile.h, 4);
    
    // Add subtle reflective highlights
    fill(255, 255, 255, 10);
    rect(tile.x + tile.w * 0.1, tile.y + tile.h * 0.1, tile.w * 0.3, tile.h * 0.3, 2);
  }
  
  // Draw veins with pulsing effect
  for (let vein of veins) {
    beginShape();
    noFill();
    
    for (let i = 0; i < vein.length; i++) {
      let point = vein[i];
      
      // Add pulse effect to vein thickness
      let pulse = sin(pulsePhase + i * 0.1) * 0.5 + 0.5;
      let baseWeight = 2;
      let weight = baseWeight + pulse * 3;
      
      // Mouse interaction - brighten and thicken veins near mouse
      let d = dist(mouseX, mouseY, point.x, point.y);
      if (d < mouseRadius) {
        let intensity = map(d, 0, mouseRadius, 1, 0.2);
        weight *= intensity * 3;
        stroke(255, 100, 100, 150 * intensity);
      } else {
        stroke(180, 50, 50, 100);
      }
      
      strokeWeight(weight);
      vertex(point.x, point.y);
    }
    
    endShape();
  }
}

function generateTiles() {
  tiles = [];
  let tileSize = 60;
  let cols = width / tileSize + 2;
  let rows = height / tileSize + 2;
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      tiles.push({
        x: i * tileSize - tileSize,
        y: j * tileSize - tileSize,
        w: tileSize,
        h: tileSize
      });
    }
  }
}

function generateVeins() {
  veins = [];
  let numVeins = 80;
  
  for (let i = 0; i < numVeins; i++) {
    let vein = [];
    let startX = random(width);
    let startY = random(height);
    
    // Vein length and direction
    let length = random(300, 800);
    let angle = random(TWO_PI);
    let segments = floor(length / 10);
    
    for (let j = 0; j < segments; j++) {
      let x = startX + cos(angle) * j * 10;
      let y = startY + sin(angle) * j * 10;
      
      // Add natural noise to vein path
      let noiseX = map(noise(x * 0.005, y * 0.005), 0, 1, -5, 5);
      let noiseY = map(noise(y * 0.005, x * 0.005), 0, 1, -5, 5);
      
      x += noiseX;
      y += noiseY;
      
      // Keep veins within canvas bounds
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        vein.push({x, y});
      }
    }
    
    if (vein.length > 10) {
      veins.push(vein);
    }
  }
}

function mouseDragged() {
  // No need for additional action - the vein drawing handles mouse interaction
}
