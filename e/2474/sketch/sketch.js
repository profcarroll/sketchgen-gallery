let layers = [];
let rootSystems = [];
let numLayers = 50;
let numRootsPerSystem = 15;
let totalRoots = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create geological layers
  for (let i = 0; i < numLayers; i++) {
    let y = map(i, 0, numLayers, 0, height);
    let hue = map(i, 0, numLayers, 20, 40); // Earth tones
    let saturation = map(i, 0, numLayers, 15, 30);
    let brightness = map(i, 0, numLayers, 40, 70);
    
    layers.push({
      y: y,
      hue: hue,
      saturation: saturation,
      brightness: brightness,
      thickness: random(8, 20)
    });
  }
  
  // Create fossilized root systems
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(50, 150);
    
    let roots = [];
    for (let j = 0; j < numRootsPerSystem; j++) {
      let angle = random(TWO_PI);
      let length = random(20, 80);
      let rootWidth = random(1, 3);
      
      roots.push({
        angle: angle,
        length: length,
        width: rootWidth
      });
    }
    
    rootSystems.push({
      x: x,
      y: y,
      size: size,
      roots: roots
    });
    
    totalRoots += numRootsPerSystem;
  }
}

function draw() {
  background(0, 0, 10, 1);
  
  // Draw geological layers
  for (let layer of layers) {
    fill(layer.hue, layer.saturation, layer.brightness, 1);
    noStroke();
    rect(0, layer.y, width, layer.thickness);
    
    // Add some corrugation to simulate cardboard texture
    stroke(layer.hue, layer.saturation, layer.brightness - 10, 1);
    strokeWeight(0.5);
    for (let x = 0; x < width; x += random(20, 40)) {
      let y = layer.y + random(-3, 3);
      line(x, y, x, y + layer.thickness);
    }
  }
  
  // Draw root systems
  for (let system of rootSystems) {
    // Draw main root cluster
    fill(25, 10, 30, 1); // Dark brown for root base
    noStroke();
    ellipse(system.x, system.y, system.size * 0.5, system.size * 0.5);
    
    // Draw individual roots
    for (let root of system.roots) {
      let endX = system.x + cos(root.angle) * root.length;
      let endY = system.y + sin(root.angle) * root.length;
      
      stroke(25, 15, 40, 1);
      strokeWeight(root.width);
      line(system.x, system.y, endX, endY);
    }
  }
  
  // Add some texture details
  stroke(0, 0, 0, 0.1);
  strokeWeight(0.2);
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height);
    point(x, y);
  }
  
  noLoop(); // Static scene
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
