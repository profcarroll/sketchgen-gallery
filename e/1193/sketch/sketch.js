let elements = [];
let rows = 10;
let cols = 18;
let tileSize = 40;
let glowOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create grid of elements
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      elements.push({
        x: col * tileSize + tileSize/2,
        y: row * tileSize + tileSize/2,
        hue: map(row, 0, rows-1, 0, 360),
        sat: 80,
        bri: 90,
        size: tileSize * 0.8
      });
    }
  }
}

function draw() {
  background(0);
  
  // Update glow wave
  glowOffset += 0.02;
  
  // Draw elements with wave effect
  for (let i = 0; i < elements.length; i++) {
    let el = elements[i];
    
    // Calculate wave effect based on position and time
    let wave = sin(el.x * 0.05 + glowOffset) * cos(el.y * 0.03 + glowOffset);
    let intensity = map(wave, -1, 1, 0.2, 1);
    
    // Draw element tile with glow
    push();
    translate(el.x, el.y);
    
    // Base color
    fill(el.hue, el.sat, el.bri * intensity);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, el.size, el.size, 5);
    
    // Glow effect
    let glow = map(wave, -1, 1, 0.3, 1);
    fill(120, 100, 50, glow * 0.4);
    rect(0, 0, el.size + 10, el.size + 10, 5);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
