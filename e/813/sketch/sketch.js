function setup() {
  createCanvas(400, 400);
  noLoop();
  frameRate(30);
}

function draw() {
  background(0);
  
  // Draw dark border
  fill(20);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw scanlines
  stroke(50, 50, 50, 150);
  strokeWeight(1);
  
  let time = millis() * 0.002;
  
  for (let y = 0; y < height; y += 2) {
    // Add some jitter to the scanline position
    let jitter = sin(y * 0.05 + time) * 10;
    
    // Occasionally skip or pause the scanline
    if (frameCount % 100 < 10) {
      jitter += random(-30, 30);
    }
    
    line(0, y, width, y + jitter);
  }
  
  // Add occasional glitch effect
  if (random() < 0.05) {
    let glitchY = random(height);
    stroke(255, 100);
    strokeWeight(3);
    line(0, glitchY, width, glitchY);
  }
}
