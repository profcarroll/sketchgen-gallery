let gridLines = [];
const GRID_SIZE = 40;
const LINE_COUNT = 1000;
const SHADOW_INTENSITY = 0.3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a structured grid of lines forming hexagonal patterns
  for (let i = 0; i < LINE_COUNT; i++) {
    const x1 = random(width);
    const y1 = random(height);
    const angle = random(TWO_PI);
    const length = random(100, 300);
    
    const x2 = x1 + cos(angle) * length;
    const y2 = y1 + sin(angle) * length;
    
    gridLines.push({
      x1,
      y1,
      x2,
      y2,
      hue: random(360),
      saturation: random(70, 100),
      brightness: random(50, 100)
    });
  }
}

function draw() {
  background(0, 0, 0);
  
  // Draw shadowed lines to create depth
  for (let i = 0; i < gridLines.length; i++) {
    const lineObj = gridLines[i];
    
    // Draw darker shadow first
    stroke(lineObj.hue, lineObj.saturation, lineObj.brightness * SHADOW_INTENSITY, 0.8);
    strokeWeight(2);
    line(lineObj.x1 + 2, lineObj.y1 + 2, lineObj.x2 + 2, lineObj.y2 + 2);
    
    // Draw main vibrant line
    stroke(lineObj.hue, lineObj.saturation, lineObj.brightness, 0.9);
    strokeWeight(1);
    line(lineObj.x1, lineObj.y1, lineObj.x2, lineObj.y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
