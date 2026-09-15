function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  // Draw structured digital texture reminiscent of early OS
  background(200);
  
  // Create grid pattern
  stroke(180);
  strokeWeight(1);
  
  for (let x = 0; x < width; x += 20) {
    line(x, 0, x, height);
  }
  
  for (let y = 0; y < height; y += 20) {
    line(0, y, width, y);
  }
  
  // Add subtle geometric elements
  fill(220);
  noStroke();
  
  for (let x = 10; x < width; x += 40) {
    for (let y = 10; y < height; y += 40) {
      rect(x, y, 15, 15);
    }
  }
  
  // Add radial gradient
  drawRadialGradient();
}

function drawRadialGradient() {
  loadPixels();
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDist = dist(0, 0, centerX, centerY);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const d = dist(x, y, centerX, centerY);
      const ratio = map(d, 0, maxDist, 0, 1);
      
      // Create color transition from bright center to darker corners
      const r = lerp(255, 180, ratio);
      const g = lerp(255, 180, ratio);
      const b = lerp(255, 180, ratio);
      
      const idx = (y * width + x) * 4;
      pixels[idx] = r;
      pixels[idx + 1] = g;
      pixels[idx + 2] = b;
      pixels[idx + 3] = 255;
    }
  }
  
  updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
