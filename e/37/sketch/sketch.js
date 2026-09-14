function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0, 0, 0, 1);
  
  // Center of the screen
  let cx = width / 2;
  let cy = height / 2;
  
  // Hexagon vertices
  let hexRadius = min(width, height) * 0.4;
  let hexPoints = [];
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI * i / 6 - PI/6;
    hexPoints.push({
      x: cx + hexRadius * cos(angle),
      y: cy + hexRadius * sin(angle)
    });
  }
  
  // Create a mask for the hexagon
  push();
  noStroke();
  fill(255);
  beginShape();
  for (let p of hexPoints) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
  pop();
  
  // Draw the kaleidoscopic pattern
  let time = millis() * 0.001;
  let layers = 8;
  
  for (let layer = 0; layer < layers; layer++) {
    let layerTime = time + layer * 0.2;
    let layerRadius = hexRadius * (layer / layers);
    
    push();
    translate(cx, cy);
    rotate(layerTime * (1 + layer));
    
    // Draw a series of rotating shapes
    for (let i = 0; i < 12; i++) {
      let angle = TWO_PI * i / 12;
      let shapeSize = layerRadius * 0.7 * (1 - layer / layers);
      
      push();
      rotate(angle + layerTime * 0.5);
      translate(shapeSize * 0.5, 0);
      
      // Draw a skewed quadrilateral
      let hue = (frameCount * 0.5 + i * 30 + layer * 20) % 360;
      fill(hue, 80, 90, 0.7);
      noStroke();
      
      beginShape();
      vertex(0, 0);
      vertex(shapeSize, 0);
      vertex(shapeSize * 0.5, shapeSize * 1.2);
      vertex(-shapeSize * 0.5, shapeSize * 1.2);
      endShape(CLOSE);
      pop();
    }
    
    pop();
  }
  
  // Overlay a radial gradient for depth
  let gradient = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, hexRadius);
  gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
  drawingContext.fillStyle = gradient;
  noStroke();
  beginShape();
  for (let p of hexPoints) {
    vertex(p.x, p.y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
