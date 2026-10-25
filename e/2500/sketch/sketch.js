let gridLines = [];
let time = 0;
let seed = 12345;
let chaosShapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noiseSeed(seed);

  // Create a grid of lines that will morph
  for (let x = -width/2; x < width/2; x += 40) {
    for (let y = -height/2; y < height/2; y += 40) {
      gridLines.push({
        x: x,
        y: y,
        originalX: x,
        originalY: y,
        size: random(20, 60),
        speed: random(0.001, 0.005),
        phase: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(20); // Dark slate
  time += 0.005;

  // Draw white chalk lines on dark slate
  stroke(0); // Black lines for contrast
  strokeWeight(1);
  
  for (let i = 0; i < gridLines.length; i++) {
    const lineObj = gridLines[i];
    
    // Apply organic deformation to the grid
    const noiseX = noise(lineObj.originalX * 0.01, lineObj.originalY * 0.01, time * 0.5) * 20;
    const noiseY = noise(lineObj.originalX * 0.01, lineObj.originalY * 0.01, time * 0.5 + 1000) * 20;
    
    // Calculate morphed positions
    const targetX = lineObj.originalX + noiseX;
    const targetY = lineObj.originalY + noiseY;
    
    push();
    translate(targetX, targetY);
    
    // Apply some rotation for organic look
    rotate(sin(time + i) * 0.2);
    
    // Draw the deformed grid elements
    const size = lineObj.size + sin(time + i) * 10;
    
    if (random() < 0.7) {
      // Regular grid lines
      line(-size/2, 0, size/2, 0);
      line(0, -size/2, 0, size/2);
    } else {
      // Sometimes draw a more organic shape
      noFill();
      strokeWeight(1);
      ellipse(0, 0, size * 0.7, size * 0.7);
    }
    
    pop();
  }
  
  // Occasionally introduce chaotic elements that disrupt the grid
  if (random() < 0.02) {
    chaosShapes.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      size: random(50, 150),
      angle: 0,
      time: 0
    });
  }
  
  // Draw and update chaos shapes
  for (let i = chaosShapes.length - 1; i >= 0; i--) {
    const shape = chaosShapes[i];
    shape.time += 0.05;
    shape.angle += 0.03;

    push();
    translate(shape.x, shape.y);
    rotate(shape.angle);
    noFill();
    strokeWeight(2);
    
    beginShape();
    for (let j = 0; j < 8; j++) {
      const angle = map(j, 0, 8, 0, TWO_PI);
      const radius = shape.size * (0.5 + sin(shape.time * 2 + j) * 0.3);
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
    
    // Remove old shapes
    if (shape.time > 10) {
      chaosShapes.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
