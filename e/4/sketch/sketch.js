function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  
  // Create a pulsing effect with concentric circles
  for (let i = 0; i < 20; i++) {
    // Calculate radius that expands and contracts
    let radius = 50 + sin(frameCount * 0.02 + i) * 30;
    
    // Use a bright fluorescent color
    let hue = (frameCount * 2 + i * 20) % 360;
    fill(hue, 100, 100, 150);
    noStroke();
    
    // Draw the circle at center of canvas
    ellipse(width/2, height/2, radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
