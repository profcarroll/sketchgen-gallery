let stripes = [];
const numStripes = 20;
const timeOffset = 0.005;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize stripes with varying properties
  for (let i = 0; i < numStripes; i++) {
    stripes.push({
      y: random(height),
      speed: random(0.001, 0.005),
      width: random(20, 80),
      hue: random(360),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Draw each stripe as a warped diagonal plane
  for (let i = 0; i < stripes.length; i++) {
    const s = stripes[i];
    
    // Update position and phase
    s.y += s.speed * 20;
    if (s.y > height + 100) s.y = -100;
    
    // Create a warped diagonal stripe effect using sine waves
    const wave = sin(frameCount * timeOffset + s.phase) * 30;
    const wave2 = cos(frameCount * timeOffset * 0.7 + s.phase * 1.3) * 20;
    
    // Draw the stripe as a polygon with warped vertices
    fill(s.hue, 90, 90, 0.8);
    noStroke();
    
    beginShape();
    for (let x = -50; x < width + 50; x += 10) {
      const y = s.y + wave * sin(x * 0.02) + wave2 * cos(x * 0.03);
      vertex(x, y);
      vertex(x, y + s.width);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
