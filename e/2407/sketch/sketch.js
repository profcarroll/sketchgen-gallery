let layers = [];
let fossils = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create geological layers with sepia tones
  for (let i = 0; i < 15; i++) {
    layers.push({
      y: height * (0.2 + i * 0.04),
      color: color(
        80 + i * 3,
        60 + i * 2,
        20 + i * 1,
        200
      ),
      speed: 0.0005 + i * 0.00005,
      thickness: 10 + i * 1.5
    });
  }
  
  // Create fossil structures in layers
  for (let i = 0; i < 300; i++) {
    let layerIndex = floor(random(layers.length));
    let layer = layers[layerIndex];
    fossils.push({
      x: random(width),
      y: layer.y + random(-layer.thickness/2, layer.thickness/2),
      size: random(2, 8),
      opacity: random(30, 80),
      layerIndex: layerIndex,
      type: floor(random(3)) // 0 = leaf, 1 = stem, 2 = flower
    });
  }
}

function draw() {
  background(150, 170, 190);
  
  let time = millis() * 0.0001;
  
  // Draw geological layers
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    
    // Create subtle undulations
    let wave = sin(time * layer.speed + i * 0.2) * 3;
    
    fill(layer.color);
    noStroke();
    
    beginShape();
    vertex(0, layer.y + wave);
    for (let x = 0; x < width; x += 10) {
      let y = layer.y + sin(x * 0.01 + time * layer.speed + i * 0.1) * 2 + wave;
      vertex(x, y);
    }
    vertex(width, layer.y + wave);
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
  
  // Draw fossils
  for (let fossil of fossils) {
    let layer = layers[fossil.layerIndex];
    
    // Slight movement over time to simulate slow sedimentation
    let offset = sin(time * 0.1 + fossil.y * 0.01) * 0.5;
    
    fill(0, 0, 0, fossil.opacity);
    noStroke();
    
    switch (fossil.type) {
      case 0: // Leaf
        ellipse(fossil.x + offset, fossil.y, fossil.size, fossil.size * 0.6);
        break;
      case 1: // Stem
        rect(fossil.x + offset - 1, fossil.y - fossil.size/2, 2, fossil.size);
        break;
      case 2: // Flower
        ellipse(fossil.x + offset, fossil.y, fossil.size * 0.8, fossil.size * 0.8);
        ellipse(fossil.x + offset - fossil.size/2, fossil.y, fossil.size * 0.4, fossil.size * 0.4);
        ellipse(fossil.x + offset + fossil.size/2, fossil.y, fossil.size * 0.4, fossil.size * 0.4);
        ellipse(fossil.x + offset, fossil.y - fossil.size/2, fossil.size * 0.4, fossil.size * 0.4);
        break;
    }
  }
  
  // Simulate slow sediment accumulation
  if (frameCount % 30 === 0) {
    for (let i = 0; i < 5; i++) {
      let layerIndex = floor(random(layers.length));
      layers[layerIndex].y += random(-0.2, 0.2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
