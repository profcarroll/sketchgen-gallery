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
  
  // Initialize lines
  for (let i = 0; i < maxLines; i++) {
    lines.push({
      angle: random(TWO_PI),
      radius: 0,
      speed: random(0.5, 2),
      hue: random(240, 300), // Deep blue to violet
      alpha: random(0.3, 0.8)
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  time += 0.01;
  
  // Draw radar sweep effect
  push();
  translate(centerX, centerY);
  
  // Draw expanding rings
  for (let i = 0; i < lines.length; i++) {
    let lineObj = lines[i];
    
    // Update radius
    lineObj.radius += lineObj.speed;
    
    // Reset if too large
    if (lineObj.radius > max(width, height) * 1.5) {
      lineObj.radius = 0;
      lineObj.angle = random(TWO_PI);
    }
    
    // Calculate position
    let x = cos(lineObj.angle + time) * lineObj.radius;
    let y = sin(lineObj.angle + time) * lineObj.radius;
    
    // Draw glow trail
    fill(lineObj.hue, 100, 100, lineObj.alpha);
    ellipse(x, y, 2, 2);
    
    // Draw connecting lines for visual effect
    if (i > 0) {
      let prevLine = lines[i - 1];
      let prevX = cos(prevLine.angle + time) * prevLine.radius;
      let prevY = sin(prevLine.angle + time) * prevLine.radius;
      
      stroke(lineObj.hue, 100, 100, lineObj.alpha * 0.5);
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
