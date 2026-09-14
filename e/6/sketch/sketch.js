let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
}

function draw() {
  background(0);
  
  // Center of the canvas
  let cx = width / 2;
  let cy = height / 2;
  
  // Number of rings to draw
  let numRings = 20;
  
  // Draw each ring with increasing radius and color
  for (let i = 0; i < numRings; i++) {
    let radius = i * 30 + sin(time + i * 0.1) * 10;
    let hue = (time * 0.1 + i * 0.05) % 1;
    let alpha = 0.7 - i * 0.03;
    
    noFill();
    stroke(hue, 1, 1, alpha);
    strokeWeight(2);
    
    // Draw the ring
    ellipse(cx, cy, radius * 2, radius * 2);
  }
  
  time += 0.02;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
