function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  // Dark background
  background(0);

  // Scanline parameters
  const scanlineHeight = 4;
  const scanlineSpeed = 3;
  const numScanlines = height / scanlineHeight;

  // Draw flickering scanlines
  for (let i = 0; i < numScanlines; i++) {
    const y = (i * scanlineHeight + frameCount * scanlineSpeed) % height;
    const brightness = 80 + 20 * sin(frameCount * 0.1 + i);
    fill(180, 100, brightness, 0.9);
    noStroke();
    rect(0, y, width, scanlineHeight);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
