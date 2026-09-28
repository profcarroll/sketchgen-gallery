let lines = [];
let maxLines = 300;
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
      speed: random(0.5, 1.5),
      hue: map(i, 0, maxLines, 220, 300), // Deep blue to violet
      alpha: random(0.3, 0.8),
      helixPhase: random(TWO_PI),
      helixFrequency: random(0.02, 0.06),
      spiralSpeed: random(0.015, 0.04)
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  time += 0.03;
  
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
    
    // Helix pattern calculation - sharp geometric helix
    let helixOffset = sin(time * lineObj.helixFrequency + lineObj.helixPhase) * 25;
    let spiralAngle = time * lineObj.spiralSpeed + lineObj.angle;
    
    // Calculate position with sharp helix effect
    let x = cos(spiralAngle) * (lineObj.radius + helixOffset);
    let y = sin(spiralAngle) * (lineObj.radius + helixOffset);
    
    // Draw trail point
    fill(lineObj.hue, 100, 100, lineObj.alpha);
    ellipse(x, y, 2, 2);
    
    // Draw connecting lines for geometric pattern - limit connections
    if (i > 0 && i % 5 === 0) { // Every 5th point connects to previous
      let prevLine = lines[i - 5];
      let prevX = cos(prevLine.angle + time * prevLine.spiralSpeed) * prevLine.radius;
      let prevY = sin(prevLine.angle + time * prevLine.spiralSpeed) * prevLine.radius;
      
      stroke(lineObj.hue, 100, 100, lineObj.alpha * 0.4);
      line(x, y, prevX, prevY);
    }
    
    // Draw central pulsing effect
    if (i % 20 === 0) {
      let pulseRadius = 5 + sin(time * 3 + i) * 3;
      stroke(lineObj.hue, 100, 100, 0.6);
      noFill();
      ellipse(x, y, pulseRadius * 2, pulseRadius * 2);
    }
  }
  
  // Draw central point
  fill(240, 100, 100, 0.9);
  ellipse(0, 0, 10, 10);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
