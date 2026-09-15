function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  angleMode(RADIANS);
}

function draw() {
  background(0, 0, 0, 1);
  
  // Create a hexagonal boundary
  const hexRadius = min(width, height) * 0.45;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Draw the kaleidoscope pattern
  drawKaleidoscope(centerX, centerY, hexRadius, frameCount * 0.01);
  
  // Draw hexagon boundary
  push();
  translate(centerX, centerY);
  stroke(255, 80, 90);
  strokeWeight(3);
  noFill();
  beginShape();
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI / 6 * i;
    const x = hexRadius * cos(angle);
    const y = hexRadius * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
  pop();
}

function drawKaleidoscope(cx, cy, radius, time) {
  const segments = 12;
  const layers = 8;
  
  for (let layer = 0; layer < layers; layer++) {
    const layerRadius = radius * (layer + 1) / layers;
    const hueOffset = (time * 20 + layer * 30) % 360;
    
    for (let i = 0; i < segments; i++) {
      const angle1 = TWO_PI / segments * i;
      const angle2 = TWO_PI / segments * (i + 1);
      
      // Create a curved segment
      const curveRadius = layerRadius * 0.7;
      const startAngle = angle1 + time * 0.2;
      const endAngle = angle2 - time * 0.2;
      
      const x1 = cx + cos(startAngle) * curveRadius;
      const y1 = cy + sin(startAngle) * curveRadius;
      const x2 = cx + cos(endAngle) * curveRadius;
      const y2 = cy + sin(endAngle) * curveRadius;
      
      // Draw the curved segment
      const hue = (hueOffset + i * 30) % 360;
      fill(hue, 90, 85, 0.7);
      
      push();
      translate(cx, cy);
      
      beginShape();
      vertex(0, 0);
      bezierVertex(
        cos(startAngle) * curveRadius,
        sin(startAngle) * curveRadius,
        cos(endAngle - PI/4) * curveRadius,
        sin(endAngle - PI/4) * curveRadius,
        x2 - cx,
        y2 - cy
      );
      endShape(CLOSE);
      
      pop();
      
      // Draw sharp geometric lines
      stroke(hue, 90, 100, 0.8);
      strokeWeight(1);
      line(
        cx + cos(startAngle) * layerRadius,
        cy + sin(startAngle) * layerRadius,
        cx + cos(endAngle) * layerRadius,
        cy + sin(endAngle) * layerRadius
      );
    }
    
    // Add static pockets that repel the energy
    if (layer % 3 === 0) {
      const pocketCount = 6;
      for (let j = 0; j < pocketCount; j++) {
        const angle = TWO_PI / pocketCount * j + time * 0.5;
        const pocketX = cx + cos(angle) * layerRadius * 0.7;
        const pocketY = cy + sin(angle) * layerRadius * 0.7;
        
        fill(0, 0, 100, 0.3);
        ellipse(pocketX, pocketY, layerRadius * 0.2, layerRadius * 0.2);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
