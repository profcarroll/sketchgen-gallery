let layers = [];
let sedimentTime = 0;
let maxLayers = 150;
let layerHeight = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize layers with bronze and earthy tones
  for (let i = 0; i < maxLayers; i++) {
    layers.push({
      y: height/2 - i * 8,
      height: 8,
      hue: random(10, 30),     // Earthy browns and bronzes
      saturation: random(20, 40),
      brightness: random(30, 60),
      alpha: random(0.6, 0.9),
      speed: random(0.0005, 0.002)
    });
  }
  
  layerHeight = height / maxLayers;
}

function draw() {
  background(20, 10, 10); // Dark background to enhance contrast
  
  sedimentTime += 0.005;
  
  // Draw heart structure
  noStroke();
  fill(30, 40, 50);
  push();
  rotateX(PI/4);
  translate(0, -height/8, 0);
  sphere(height/6, 12, 8);
  pop();
  
  // Draw heart walls
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    
    // Layer movement based on time and position
    let offset = sin(sedimentTime * layer.speed + i * 0.1) * 3;
    
    fill(layer.hue, layer.saturation, layer.brightness, layer.alpha);
    push();
    rotateX(PI/4);
    translate(0, layer.y + offset, 0);
    box(width/2, layer.height, height/3);
    pop();
    
    // Layer erosion effect
    if (i % 11 === 0) {
      stroke(30, 30, 5);
      strokeWeight(0.5);
      push();
      rotateX(PI/4);
      translate(0, layer.y + offset, 0);
      box(width/2, 1, height/3);
      pop();
    }
  }
  
  // Draw subtle heart pulses
  let pulse = sin(sedimentTime * 0.5) * 0.1;
  fill(20, 30, 70, 0.1);
  push();
  rotateX(PI/4);
  translate(0, -height/8 + pulse * 20, 0);
  sphere(height/6 + pulse * 10, 12, 8);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
