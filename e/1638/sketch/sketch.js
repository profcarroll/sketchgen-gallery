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
}

function drawKaleidoscope(cx, cy, time) {
  const layers = 12;
  const radius = min(width, height) * 0.45;
  
  for (let layer = 0; layer < layers; layer++) {
    const layerRadius = radius * (layer / layers);
    const angleOffset = time * (1 - layer / layers) * 0.3;
    
    push();
    translate(cx, cy);
    
    // Create kaleidoscope effect with 12 segments
    for (let i = 0; i < 12; i++) {
      rotate(TWO_PI / 12);
      
      // Smooth color transition through sunset hues
      const hue = (time * 30 + layer * 30) % 360;
      const saturation = 80 + 20 * sin(time * 0.5 + layer);
      const brightness = 70 + 30 * cos(time * 0.7 + layer);
      
      fill(hue, saturation, brightness, 0.8);
      
      // Draw geometric segments with dynamic shapes
      beginShape();
      for (let j = 0; j < 15; j++) {
        const angle = map(j, 0, 14, 0, TWO_PI / 3);
        const r = layerRadius * (0.7 + 0.3 * sin(time * 2 + j));
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
