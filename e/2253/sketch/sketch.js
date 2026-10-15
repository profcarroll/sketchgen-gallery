let sedimentLayers = [];
const layerCount = 20;
const maxStrata = 1000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 100);
  
  // Create deep sediment layers with rich earth tones
  for (let i = 0; i < layerCount; i++) {
    let layer = {
      y: map(i, 0, layerCount - 1, height * 0.2, height * 0.8),
      thickness: random(30, 80),
      hue: random(15, 40), // Earth tones - ochres, browns
      saturation: random(20, 50),
      brightness: random(25, 60)
    };
    sedimentLayers.push(layer);
  }
  
  noLoop();
}

function draw() {
  background(0);
  
  // Draw base sediment layers
  for (let layer of sedimentLayers) {
    fill(layer.hue, layer.saturation, layer.brightness);
    noStroke();
    rect(0, layer.y, width, layer.thickness);
  }
  
  // Add subtle texture to simulate beeswax-like surface
  strokeWeight(1);
  for (let i = 0; i < maxStrata; i++) {
    let x = random(width);
    let y = random(height * 0.2, height * 0.8);
    
    // Use muted earth tones for texture
    let hue = random(15, 35);
    let sat = random(10, 30);
    let bright = random(30, 50);
    
    stroke(hue, sat, bright);
    
    // Draw thin strata lines with slight variation
    let length = random(20, 60);
    let angle = random(TWO_PI);
    
    line(x, y, x + cos(angle) * length, y + sin(angle) * length);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
