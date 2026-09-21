let elements = [];
let gridWidth, gridHeight;
let cellSize = 40;
let glowPhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gridWidth = floor((width - 100) / cellSize);
  gridHeight = floor((height - 100) / cellSize);

  // Create a structured grid representing the periodic table
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      elements.push({
        x: 50 + x * cellSize,
        y: 50 + y * cellSize,
        z: 0,
        size: cellSize * 0.8,
        color: color(100, 200, 255),
        glowIntensity: 0
      });
    }
  }
}

function draw() {
  background(10);
  glowPhase += 0.03;

  // Draw the periodic table grid with animated glow
  for (let i = 0; i < elements.length; i++) {
    let e = elements[i];
    
    // Calculate glow based on position and time
    let wave = sin(glowPhase + (e.x + e.y) * 0.01);
    e.glowIntensity = map(wave, -1, 1, 0.2, 0.8);
    
    // Draw the element box with glow effect
    push();
    translate(e.x, e.y);
    
    // Base color
    fill(e.color);
    stroke(255);
    strokeWeight(1);
    rectMode(CENTER);
    rect(0, 0, e.size, e.size);
    
    // Glow effect
    let glowColor = lerpColor(color(255, 255, 255, 0), color(255, 255, 255, 150), e.glowIntensity);
    fill(glowColor);
    noStroke();
    rect(0, 0, e.size * 1.2, e.size * 1.2);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
