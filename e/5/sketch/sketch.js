function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  
  // Center of the canvas
  let centerX = width / 2;
  let centerY = height / 2;
  
  // Number of rings
  let numRings = 20;
  
  // Time variable for pulsing effect
  let t = millis() / 1000;
  
  // Draw nested rings
  for (let i = 0; i < numRings; i++) {
    // Radius increases with each ring
    let radius = 50 + i * 30;
    
    // Pulsing size effect
    let pulse = sin(t + i * 0.2) * 10;
    radius += pulse;
    
    // Color animation: hue shifts over time
    let hue = (t * 20 + i * 20) % 360;
    
    // Saturation and opacity fluctuate
    let saturation = 100;
    let opacity = 150 + sin(t * 2 + i) * 100;
    
    // Set ring color with dynamic saturation and opacity
    stroke(hue, saturation, 100, opacity);
    noFill();
    
    // Draw the ring (circle)
    ellipse(centerX, centerY, radius * 2, radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
