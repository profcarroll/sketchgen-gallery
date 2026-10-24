let layers = [];
let layerHeight = 20;
let numLayers = 30;
let stressLines = [];
let faults = [];
let crumbledMaterial = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create rock layers with varying colors and textures
  for (let i = 0; i < numLayers; i++) {
    let hue = map(i, 0, numLayers, 0, 360);
    let saturation = random(30, 70);
    let brightness = random(40, 80);
    
    layers.push({
      y: i * layerHeight,
      height: layerHeight,
      color: color(hue, saturation, brightness),
      stress: 0,
      strain: 0,
      faulted: false
    });
  }
  
  noStroke();
}

function draw() {
  background(20);
  
  time += 0.01;
  
  // Apply continuous tectonic forces
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    
    // Simulate internal stress from tectonic forces
    layer.stress = sin(time + i * 0.2) * 0.5 + 0.5;
    
    // Apply strain that increases with stress
    layer.strain = layer.stress * 0.3;
    
    // Occasionally create faults
    if (random() < 0.001 && !layer.faulted) {
      layer.faulted = true;
      faults.push({
        x: random(width),
        y: layer.y + layer.height / 2,
        size: random(20, 50),
        age: 0
      });
    }
    
    // Visualize stress as color variation
    let stressColor = lerpColor(color(layer.color), color(0, 0, 100), layer.stress * 0.3);
    
    fill(stressColor);
    rect(0, layer.y, width, layer.height);
    
    // Draw stress lines
    if (random() < 0.02) {
      stressLines.push({
        x1: random(width),
        y1: layer.y,
        x2: random(width),
        y2: layer.y + layer.height,
        age: 0
      });
    }
  }
  
  // Update and draw stress lines
  for (let i = 0; i < stressLines.length; i++) {
    let stressLine = stressLines[i];
    stroke(255, 30);
    strokeWeight(1);
    line(stressLine.x1, stressLine.y1, stressLine.x2, stressLine.y2);
    stressLine.age++;
    
    if (stressLine.age > 60) {
      stressLines.splice(i, 1);
      i--;
    }
  }
  
  // Update and draw faults
  for (let i = 0; i < faults.length; i++) {
    let fault = faults[i];
    fill(100, 50, 30, 0.7);
    noStroke();
    ellipse(fault.x, fault.y, fault.size, fault.size * 0.6);
    
    // Add crumbled material around the fault
    for (let j = 0; j < 5; j++) {
      crumbledMaterial.push({
        x: fault.x + random(-fault.size, fault.size),
        y: fault.y,
        size: random(2, 6),
        age: 0,
        color: color(100, 30, 20)
      });
    }
    
    fault.age++;
    
    if (fault.age > 120) {
      faults.splice(i, 1);
      i--;
    }
  }
  
  // Update and draw crumbled material
  for (let i = 0; i < crumbledMaterial.length; i++) {
    let piece = crumbledMaterial[i];
    fill(piece.color);
    ellipse(piece.x, piece.y, piece.size, piece.size);
    
    piece.age++;
    piece.y += random(0.1, 0.5);
    piece.x += random(-0.2, 0.2);
    
    if (piece.age > 300) {
      crumbledMaterial.splice(i, 1);
      i--;
    }
  }
  
  // Add subtle movement to the whole structure
  for (let i = 0; i < layers.length; i++) {
    layers[i].y += sin(time * 0.5 + i * 0.1) * 0.2;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
