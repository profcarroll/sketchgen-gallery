function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 0, 1);
  
  // Center of canvas
  const cx = width / 2;
  const cy = height / 2;
  
  // Time-based animation
  const t = millis() * 0.0005;
  
  // Draw kaleidoscopic patterns
  push();
  translate(cx, cy);
  
  // Multiple layers of rotating shapes
  for (let layer = 0; layer < 6; layer++) {
    const angleOffset = t * (layer + 1) * 0.5;
    const size = 100 + sin(t * 0.3 + layer) * 50;
    
    push();
    rotate(angleOffset);
    
    // Draw hexagon mask
    beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = TWO_PI / 6 * i;
      const x = cos(angle) * size;
      const y = sin(angle) * size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Fill with gradient pattern
    for (let i = 0; i < 12; i++) {
      const a = angleOffset + i * TWO_PI / 12;
      const r = size * 0.8;
      const x1 = cos(a) * r;
      const y1 = sin(a) * r;
      const x2 = cos(a + 0.5) * r;
      const y2 = sin(a + 0.5) * r;
      
      fill((t * 20 + i * 30 + layer * 60) % 360, 80, 90, 0.7);
      triangle(0, 0, x1, y1, x2, y2);
    }
    
    pop();
  }
  
  // Overlay rotating rings
  for (let i = 0; i < 8; i++) {
    const angle = t * 0.5 + i * TWO_PI / 8;
    const radius = 30 + sin(t + i) * 20;
    
    fill((t * 10 + i * 45) % 360, 70, 80, 0.3);
    ellipse(cos(angle) * radius, sin(angle) * radius, 10, 10);
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
