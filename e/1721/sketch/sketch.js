let lines = [];
let maxLines = 500;
let centerX, centerY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Initialize lines with helix patterns
  for (let i = 0; i < maxLines; i++) {
    lines.push({
      angle: random(TWO_PI),
      radius: 0,
      speed: random(0.3, 1.2),
      hue: map(i, 0, maxLines, 200, 320), // Blue to violet spectrum
      alpha: random(0.2, 0.7),
      helixPhase: random(TWO_PI),
      helixFrequency: random(0.01, 0.05),
      spiralSpeed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  time += 0.02;
  
  push();
  translate(centerX, centerY);
  
  // Draw expanding helix patterns
  for (let i = 0; i < lines.length; i++) {
    let lineObj = lines[i];
    
    // Update radius with spiral effect
    lineObj.radius += lineObj.speed;
    
    // Reset if too large
    if (lineObj.radius > max(width, height) * 1.5) {
      lineObj.radius = 0;
      lineObj.angle = random(TWO_PI);
    }
    
    // Helix pattern calculation
    let helixOffset = sin(time * lineObj.helixFrequency + lineObj.helixPhase) * 20;
    let spiralAngle = time * lineObj.spiralSpeed + lineObj.angle;
    
    // Calculate position with helix effect
    let x = cos(spiralAngle) * (lineObj.radius + helixOffset);
    let y = sin(spiralAngle) * (lineObj.radius + helixOffset);
    
    // Draw glow trail
    fill(lineObj.hue, 100, 100, lineObj.alpha);
    ellipse(x, y, 2, 2);
    
    // Draw connecting lines for visual effect
    if (i > 0) {
      let prevLine = lines[i - 1];
      let prevX = cos(prevLine.angle + time * prevLine.spiralSpeed) * prevLine.radius;
      let prevY = sin(prevLine.angle + time * prevLine.spiralSpeed) * prevLine.radius;
      
      stroke(lineObj.hue, 100, 100, lineObj.alpha * 0.3);
      line(x, y, prevX, prevY);
    }
  }
  
  // Draw central point
  fill(240, 100, 100, 0.8);
  ellipse(0, 0, 8, 8);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
