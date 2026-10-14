let steelLayers = [];
const layerCount = 15;
const maxDendrites = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 100);
  
  // Create base steel layers with varying darkness
  for (let i = 0; i < layerCount; i++) {
    let layer = {
      y: map(i, 0, layerCount - 1, height * 0.3, height * 0.7),
      thickness: random(20, 60),
      hue: random(10, 25), // Dark steel tones
      saturation: random(10, 30),
      brightness: random(15, 35)
    };
    steelLayers.push(layer);
  }
  
  // Create dendritic rust patterns
  noLoop();
}

function draw() {
  background(0);
  
  // Draw base steel layers
  for (let layer of steelLayers) {
    fill(layer.hue, layer.saturation, layer.brightness);
    noStroke();
    rect(0, layer.y, width, layer.thickness);
  }
  
  // Create rust dendrites - slow formation process
  strokeWeight(1);
  for (let i = 0; i < maxDendrites; i++) {
    let x = random(width);
    let y = random(height * 0.3, height * 0.7);
    
    // Rust color palette - deep reds and oranges
    let hue = random(0, 10); // Red range
    let sat = random(50, 80);
    let bright = random(40, 70);
    
    stroke(hue, sat, bright);
    
    // Draw dendritic pattern with branches
    drawDendrite(x, y, hue, sat, bright);
  }
}

function drawDendrite(x, y, h, s, b) {
  // Base branch
  let length = random(10, 30);
  let angle = random(TWO_PI);
  
  line(x, y, x + cos(angle) * length, y + sin(angle) * length);
  
  // Add secondary branches
  for (let i = 0; i < 3; i++) {
    let branchAngle = angle + random(-PI/4, PI/4);
    let branchLength = random(5, 15);
    
    stroke(h, s, b);
    line(x + cos(angle) * length, y + sin(angle) * length,
         x + cos(angle) * length + cos(branchAngle) * branchLength,
         y + sin(angle) * length + sin(branchAngle) * branchLength);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
