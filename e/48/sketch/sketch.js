let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  
  // Create kaleidoscope effect with hexagonal boundary
  let hexRadius = min(width, height) * 0.4;
  let numSweeps = 6;
  
  // Rotate the whole pattern slowly
  rotate(time * 0.001);
  
  for (let i = 0; i < numSweeps; i++) {
    push();
    
    // Rotate each sweep
    rotate(TWO_PI / numSweeps * i);
    
    // Draw sweeping lines
    let sweepAngle = time * 0.02 + i * TWO_PI / numSweeps;
    let sweepLength = map(sin(time * 0.01 + i), -1, 1, 0, hexRadius * 1.5);
    
    // Draw multiple layers of lines
    for (let j = 0; j < 8; j++) {
      let layerAngle = sweepAngle + j * 0.2;
      let layerLength = sweepLength * (1 - j * 0.1);
      
      stroke((time * 0.5 + j * 30) % 360, 80, 70, 0.7);
      strokeWeight(1 + j * 0.2);
      
      // Draw line from center outward
      let x1 = 0;
      let y1 = 0;
      let x2 = cos(layerAngle) * layerLength;
      let y2 = sin(layerAngle) * layerLength;
      
      line(x1, y1, x2, y2);
    }
    
    // Draw intersecting lines within hexagon
    for (let j = 0; j < 6; j++) {
      let angle1 = TWO_PI / 6 * j + time * 0.005;
      let angle2 = TWO_PI / 6 * (j + 1) + time * 0.005;
      
      let x1 = cos(angle1) * hexRadius * 0.7;
      let y1 = sin(angle1) * hexRadius * 0.7;
      let x2 = cos(angle2) * hexRadius * 0.7;
      let y2 = sin(angle2) * hexRadius * 0.7;
      
      stroke((time * 0.3 + j * 60) % 360, 90, 80, 0.5);
      strokeWeight(1);
      line(x1, y1, x2, y2);
    }
    
    pop();
  }
  
  // Draw hexagonal boundary
  noFill();
  stroke(200, 50, 80, 0.3);
  strokeWeight(2);
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = TWO_PI / 6 * i + time * 0.002;
    let x = cos(angle) * hexRadius;
    let y = sin(angle) * hexRadius;
    vertex(x, y);
  }
  endShape(CLOSE);
  
  time++;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
