function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Ensure consistent rendering
}

function draw() {
  background(0);

  // Draw retro camera viewfinder
  fill(30);
  noStroke();
  rect(0, 0, width, height);

  // Draw scanlines with wave motion
  stroke(255);
  strokeWeight(1);
  const time = millis() * 0.001;
  const amplitude = 2;
  const frequency = 0.02;

  for (let y = 0; y < height; y += 2) {
    // Create wave pattern
    const waveOffset = sin(y * frequency + time) * amplitude;
    const lineY = y + waveOffset;
    
    // Draw horizontal scanline
    line(0, lineY, width, lineY);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
