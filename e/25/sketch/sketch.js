function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 0, 1);
  
  // Center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Hexagon radius
  const hexRadius = min(width, height) * 0.4;
  
  // Time-based animation
  const time = millis() * 0.001;
  
  // Draw the kaleidoscopic pattern
  for (let i = 0; i < 6; i++) {
    push();
    
    // Rotate each section
    rotate(TWO_PI / 6 * i);
    
    // Draw a repeating pattern
    for (let j = 0; j < 10; j++) {
      const angle = time * 0.5 + j * 0.2;
      const radius = hexRadius * 0.8 - j * (hexRadius * 0.1);
      
      // Calculate color based on position and time
      const hue = (angle * 30 + time * 20) % 360;
      const saturation = 90;
      const brightness = 80;
      
      fill(hue, saturation, brightness, 0.7);
      
      // Draw a flowing shape
      beginShape();
      for (let k = 0; k < 12; k++) {
        const pointAngle = angle + TWO_PI / 12 * k;
        const pointRadius = radius + sin(time + k * 0.5) * 20;
        const x = pointRadius * cos(pointAngle);
        const y = pointRadius * sin(pointAngle);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
  
  // Draw the hexagon boundary
  push();
  stroke(255, 100, 100, 0.3);
  noFill();
  beginShape();
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI / 6 * i - HALF_PI;
    const x = centerX + hexRadius * cos(angle);
    const y = centerY + hexRadius * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
