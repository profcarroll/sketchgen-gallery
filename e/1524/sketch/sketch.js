let layers = [];
let colorPalette = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create a deep, resonant color palette
  colorPalette = [
    color(20, 10, 40),   // Deep violet
    color(30, 5, 60),    // Dark blue-purple
    color(15, 30, 70),   // Deep blue
    color(25, 60, 90),   // Medium blue
    color(40, 80, 100),  // Light blue
    color(60, 100, 120), // Pale blue
    color(80, 120, 140), // Soft blue
    color(100, 140, 160),// Light blue-gray
    color(120, 160, 180),// Pastel blue
    color(140, 180, 200),// Cool blue
    color(160, 200, 220),// Pale blue-white
    color(180, 220, 240),// Light blue
    color(200, 240, 255) // Bright white-blue
  ];
  
  // Create floating layers
  for (let i = 0; i < 15; i++) {
    layers.push({
      x: random(width),
      y: random(height),
      w: random(300, 800),
      h: random(200, 600),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.15, 0.15),
      color: random(colorPalette),
      alpha: random(100, 200),
      // For bleeding effect
      bleedAmount: random(0.1, 0.5)
    });
  }
  
  // Ensure at least one layer has high saturation
  layers[0].color = color(255, 0, 100); // Bright magenta
  layers[1].color = color(0, 200, 255); // Bright cyan
}

function draw() {
  background(10);
  
  // Update and draw layers
  for (let i = 0; i < layers.length; i++) {
    let layer = layers[i];
    
    // Update position with subtle floating motion
    layer.x += layer.speedX;
    layer.y += layer.speedY;
    
    // Bounce off edges
    if (layer.x < -layer.w || layer.x > width) layer.speedX *= -1;
    if (layer.y < -layer.h || layer.y > height) layer.speedY *= -1;
    
    // Apply a subtle breathing effect to size
    let scale = 1 + sin(frameCount * 0.002 + i) * 0.05;
    let w = layer.w * scale;
    let h = layer.h * scale;
    
    // Draw the main layer with blend mode for bleeding effect
    fill(red(layer.color), green(layer.color), blue(layer.color), layer.alpha);
    noStroke();
    
    // Create soft edges by drawing multiple layers
    for (let j = 0; j < 3; j++) {
      let alpha = map(j, 0, 2, layer.alpha * 0.3, layer.alpha);
      fill(red(layer.color), green(layer.color), blue(layer.color), alpha);
      rect(layer.x + j * 2, layer.y + j * 2, w, h, 20);
    }
    
    // Draw a subtle glow effect
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = layer.color;
    fill(red(layer.color), green(layer.color), blue(layer.color), layer.alpha * 0.5);
    rect(layer.x, layer.y, w, h, 20);
    drawingContext.shadowBlur = 0;
    
    // Draw a secondary soft layer that bleeds into others
    if (i > 0) {
      let prevLayer = layers[i - 1];
      fill(red(prevLayer.color), green(prevLayer.color), blue(prevLayer.color), layer.alpha * 0.3);
      rect(layer.x + random(-20, 20), layer.y + random(-20, 20), w * 0.8, h * 0.8, 15);
    }
  }
  
  // Add a subtle color shift over time
  for (let i = 0; i < layers.length; i++) {
    let hueShift = sin(frameCount * 0.0005 + i) * 5;
    layers[i].color = lerpColor(layers[i].color, color(hueShift, 100, 150), 0.001);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
