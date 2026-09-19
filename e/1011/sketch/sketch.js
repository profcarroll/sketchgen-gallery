let layers = [];
const numLayers = 12;
const waveSpeed = 0.01;
const waveAmplitude = 30;
const waveFrequency = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create layers with different colors and opacities
  for (let i = 0; i < numLayers; i++) {
    layers.push({
      color: color(i * 30 % 360, 80, 70),
      opacity: map(i, 0, numLayers - 1, 0.2, 0.6),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  // Draw each layer with wave effect
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    
    push();
    fill(layer.color, layer.opacity);
    noStroke();
    
    // Create wave pattern using sine functions
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      // Apply multiple wave frequencies for complexity
      let y = height / 2 + 
              sin(x * waveFrequency + layer.phase) * waveAmplitude +
              sin(x * waveFrequency * 1.5 + layer.phase * 1.3) * waveAmplitude * 0.5 +
              sin(x * waveFrequency * 0.7 + layer.phase * 0.8) * waveAmplitude * 0.3;
      
      vertex(x, y);
    }
    
    // Close the shape to form a continuous layer
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    
    pop();
    
    // Update phase for animation
    layers[i].phase += waveSpeed;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
