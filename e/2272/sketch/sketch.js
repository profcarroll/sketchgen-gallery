let tiles = [];
let veins = [];
let mouseRadius = 100;
let pulseSpeed = 0.02;
let pulsePhase = 0;
let noiseScale = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  generateTiles();
  generateVeins();
}

function draw() {
  background(30, 30, 40);
  
  // Update pulse effect
  pulsePhase += pulseSpeed;
  
  // Draw tiles with mineral textures
  for (let tile of tiles) {
    push();
    translate(tile.x, tile.y, tile.z);
    rotateX(tile.rotX);
    rotateY(tile.rotY);
    
    let baseColor = color(60, 60, 70);
    fill(baseColor);
    noStroke();
    box(tile.w, tile.h, tile.d);
    
    // Add mineral sheen
    fill(255, 255, 255, 10);
    box(tile.w * 0.3, tile.h * 0.3, tile.d * 0.3);
    pop();
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
        stroke(255, 180, 50, 150 * intensity); // Gold hue
      } else {
        stroke(180, 50, 50, 100); // Copper hue
      }
      
      strokeWeight(weight);
      vertex(point.x, point.y, point.z);
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
        z: random(-50, 50),
        w: tileSize,
        h: tileSize,
        d: random(10, 30),
        rotX: random(TWO_PI),
        rotY: random(TWO_PI)
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
    let startZ = random(-50, 50);
    
    // Vein length and direction
    let length = random(300, 800);
    let angle = random(TWO_PI);
    let segments = floor(length / 10);
    
    for (let j = 0; j < segments; j++) {
      let x = startX + cos(angle) * j * 10;
      let y = startY + sin(angle) * j * 10;
      let z = startZ + sin(j * 0.1) * 20; // Slight vertical variation
      
      // Add natural noise to vein path
      let noiseX = map(noise(x * noiseScale, y * noiseScale), 0, 1, -5, 5);
      let noiseY = map(noise(y * noiseScale, x * noiseScale), 0, 1, -5, 5);
      
      x += noiseX;
      y += noiseY;
      
      // Keep veins within canvas bounds
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        vein.push({x, y, z});
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
