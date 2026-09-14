let time = 0;
let hexRadius;

function setup() {
  createCanvas(windowWidth, windowHeight);
  hexRadius = min(width, height) * 0.4;
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(0, 0, 0, 1);
  
  // Center of the canvas
  const cx = width / 2;
  const cy = height / 2;
  
  // Update time for animation
  time += 0.005;
  
  // Draw hexagonal boundary
  push();
  translate(cx, cy);
  stroke(255, 100, 100, 0.3);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI * i / 6;
    const x = hexRadius * cos(angle);
    const y = hexRadius * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
  
  // Draw kaleidoscopic pattern
  push();
  translate(cx, cy);
  
  const layers = 8;
  for (let layer = 0; layer < layers; layer++) {
    const layerTime = time * (layer + 1) * 0.5;
    const layerRadius = hexRadius * (layer / layers);
    
    // Draw multiple rotating patterns
    const numPatterns = 6 + floor(layer * 2);
    for (let i = 0; i < numPatterns; i++) {
      const angle = TWO_PI * i / numPatterns + layerTime;
      const x = layerRadius * cos(angle);
      const y = layerRadius * sin(angle);
      
      push();
      translate(x, y);
      rotate(layerTime * (i % 3 + 1) * 0.5);
      
      // Draw flowing shapes
      const numSegments = 12;
      for (let j = 0; j < numSegments; j++) {
        const segAngle = TWO_PI * j / numSegments;
        const segRadius = 20 + sin(layerTime + j * 0.5) * 10;
        
        const hue = (frameCount * 2 + layer * 30 + i * 20 + j * 10) % 360;
        fill(hue, 80, 90, 0.7);
        
        beginShape();
        for (let k = 0; k < 5; k++) {
          const pointAngle = segAngle + TWO_PI * k / 4 + sin(layerTime * 2 + j) * 0.3;
          const px = segRadius * cos(pointAngle);
          const py = segRadius * sin(pointAngle);
          vertex(px, py);
        }
        endShape(CLOSE);
      }
      
      pop();
    }
  }
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
