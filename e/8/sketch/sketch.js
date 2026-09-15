function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  
  // Center of canvas
  let cx = width / 2;
  let cy = height / 2;
  
  // Number of rings
  let numRings = 8;
  
  // Time variable to control pulsing
  let t = millis() * 0.001;
  
  for (let i = 0; i < numRings; i++) {
    // Control the size and timing of each ring
    let size = 50 + sin(t + i * 0.5) * 30 + i * 40;
    let alpha = map(i, 0, numRings - 1, 100, 255);
    
    // Use a limited temperature range for colors (from red to yellow)
    let hue = map(i, 0, numRings - 1, 0, 60); // Red to Yellow
    stroke(hue, 100, 100, alpha);
    noFill();
    
    // Draw the ring
    ellipse(cx, cy, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
