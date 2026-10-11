let layers = [];
let sedimentTime = 0;
let maxLayers = 200;
let layerHeight = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize layers with earthen tones
  for (let i = 0; i < maxLayers; i++) {
    layers.push({
      y: height - i * 8,
      height: 8,
      hue: random(20, 40),     // Earthy browns and tans
      saturation: random(30, 60),
      brightness: random(40, 70),
      alpha: random(0.7, 1.0),
      speed: random(0.001, 0.005)
    });
  }
  
  layerHeight = height / maxLayers;
}

function draw() {
  background(220, 10, 90); // Sky blue background
  
  sedimentTime += 0.01;
  
  // Draw canyon walls
  noStroke();
  fill(30, 20, 30);
  rect(0, 0, width/4, height);
  rect(3*width/4, 0, width/4, height);
  
  // Draw sediment layers
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    
    // Layer movement based on time and position
    let offset = sin(sedimentTime * layer.speed + i * 0.1) * 5;
    
    fill(layer.hue, layer.saturation, layer.brightness, layer.alpha);
    rect(0, layer.y + offset, width, layer.height);
    
    // Layer erosion effect
    if (i % 7 === 0) {
      stroke(30, 20, 10);
      strokeWeight(1);
      line(0, layer.y + offset, width, layer.y + offset);
    }
  }
  
  // Draw a subtle horizon line
  stroke(30, 10, 20);
  strokeWeight(2);
  line(0, height/2, width, height/2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
