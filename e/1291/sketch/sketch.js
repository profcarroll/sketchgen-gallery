function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  noStroke();
}

function draw() {
  background(0);
  
  // Center of canvas
  const cx = width / 2;
  const cy = height / 2;
  
  // Number of rings
  const numRings = 15;
  
  // Base radius and spacing
  const baseRadius = min(width, height) * 0.1;
  const spacing = min(width, height) * 0.05;
  
  // Time for oscillation
  const t = millis() / 1000;
  
  for (let i = 0; i < numRings; i++) {
    // Calculate radius with harmonic wave motion
    const radius = baseRadius + i * spacing + sin(t + i * 0.3) * 20;
    
    // Hue based on ring index and time
    const hue = (i * 10 + t * 30) % 255;
    
    // Saturation and brightness for deep purple/magenta
    const sat = 180 + sin(t + i) * 50;
    const bright = 150 + cos(t * 0.5 + i) * 50;
    
    fill(hue, sat, bright);
    
    // Draw ring as ellipse (circle)
    ellipse(cx, cy, radius * 2, radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
