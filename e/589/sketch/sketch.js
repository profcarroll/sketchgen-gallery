let bands = [];
const numBands = 8;
const waveSpeed = 0.02;
const waveHeight = 30;
const highWaterLine = 0.7;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create horizontal bands with varying colors and positions
  for (let i = 0; i < numBands; i++) {
    bands.push({
      y: map(i, 0, numBands - 1, 0, height),
      color: color(
        map(i, 0, numBands - 1, 50, 180),
        map(i, 0, numBands - 1, 100, 200),
        map(i, 0, numBands - 1, 200, 255)
      ),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(20);
  
  // Draw the water surface
  fill(30, 60, 120);
  rect(0, 0, width, height);
  
  // Update and draw bands with wave motion
  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    
    // Apply wave motion to each band
    const waveOffset = sin(frameCount * waveSpeed + band.phase) * waveHeight;
    const y = band.y + waveOffset;
    
    // Draw the band
    fill(band.color);
    rect(0, y, width, 20); // Each band is 20px high
    
    // Highlight the high water line
    if (i === Math.floor(highWaterLine * numBands)) {
      stroke(255, 200);
      strokeWeight(2);
      line(0, y, width, y);
      noStroke();
    }
  }
  
  // Add some visual effect to make it look more turbulent
  for (let i = 0; i < 100; i++) {
    const x = random(width);
    const y = random(height);
    const size = random(1, 3);
    fill(255, 80);
    ellipse(x, y, size, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
