function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 0, 1);
  
  const cx = width / 2;
  const cy = height / 2;
  const time = millis() * 0.0005;
  
  // Draw kaleidoscope pattern
  drawKaleidoscope(cx, cy, time);
  
  // Draw hexagon mask
  push();
  translate(cx, cy);
  rotate(time * 0.3);
  
  beginShape();
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI / 6 * i;
    const x = cos(angle) * 150;
    const y = sin(angle) * 150;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  pop();
}

function drawKaleidoscope(cx, cy, time) {
  const layers = 8;
  const radius = min(width, height) * 0.45;
  
  // Create a pattern that fills the canvas
  for (let layer = 0; layer < layers; layer++) {
    const layerRadius = radius * (layer / layers);
    const angleOffset = time * (1 - layer / layers) * 0.5;
    
    push();
    translate(cx, cy);
    
    // Draw multiple rotated copies to create kaleidoscope effect
    for (let i = 0; i < 12; i++) {
      rotate(TWO_PI / 12);
      
      // Color based on layer and time
      const hue = (frameCount * 0.5 + layer * 30) % 360;
      const saturation = 80 + 20 * sin(time + layer);
      const brightness = 70 + 30 * cos(time * 0.7 + layer);
      
      fill(hue, saturation, brightness, 0.8);
      
      // Draw a segment of the pattern
      beginShape();
      for (let j = 0; j < 10; j++) {
        const angle = map(j, 0, 9, 0, TWO_PI / 3);
        const r = layerRadius * (0.8 + 0.2 * sin(time * 2 + j));
        const x = cos(angle + angleOffset) * r;
        const y = sin(angle + angleOffset) * r;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
