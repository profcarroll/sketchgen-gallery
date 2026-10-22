function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 0, 1);
  
  const cx = width / 2;
  const cy = height / 2;
  const time = millis() * 0.0003;
  
  // Draw soap bubble pattern with radial glow
  drawSoapBubble(cx, cy, time);
}

function drawSoapBubble(cx, cy, time) {
  const layers = 8;
  const radius = min(width, height) * 0.45;
  
  for (let layer = 0; layer < layers; layer++) {
    const layerRadius = radius * (layer / layers);
    const angleOffset = time * (1 - layer / layers) * 0.5;
    
    push();
    translate(cx, cy);
    
    // Create radial symmetry with 6 segments
    for (let i = 0; i < 6; i++) {
      rotate(TWO_PI / 6);
      
      // Sunset color transition
      const hue = (time * 20 + layer * 40) % 360;
      const saturation = 70 + 30 * sin(time * 0.3 + layer);
      const brightness = 60 + 40 * cos(time * 0.5 + layer);
      
      fill(hue, saturation, brightness, 0.7);
      
      // Draw pulsing circular segments
      beginShape();
      for (let j = 0; j < 20; j++) {
        const angle = map(j, 0, 19, 0, TWO_PI);
        const r = layerRadius * (0.8 + 0.2 * sin(time * 3 + j * 0.3));
        const x = cos(angle + angleOffset) * r;
        const y = sin(angle + angleOffset) * r;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
  
  // Add radial glow effect
  push();
  translate(cx, cy);
  for (let i = 0; i < 30; i++) {
    const angle = time * 0.5 + i * TWO_PI / 30;
    const r = min(width, height) * 0.4 * (1 - i/30);
    const size = 20 + 30 * sin(time * 2 + i);
    
    noFill();
    stroke((time * 10 + i * 12) % 360, 80, 90, 0.2);
    ellipse(0, 0, size, size);
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
