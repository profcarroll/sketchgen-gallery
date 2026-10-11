let lines = [];
const numLines = 200;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize lines with random positions and angles
  for (let i = 0; i < numLines; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      length: random(80, 250),
      speed: random(0.001, 0.008),
      hue: random(20, 40) // Warm orange tone
    });
  }
}

function draw() {
  background(0, 0, 0);
  
  time += 0.01;
  
  // Draw lines with dynamic positions and angles
  for (let i = 0; i < lines.length; i++) {
    let lineObj = lines[i];
    
    // Update angle based on time and noise
    lineObj.angle += lineObj.speed * sin(time + i * 0.1);
    
    // Calculate end point of the line
    let endX = lineObj.x + cos(lineObj.angle) * lineObj.length;
    let endY = lineObj.y + sin(lineObj.angle) * lineObj.length;
    
    // Draw the line with contrast
    stroke(lineObj.hue, 80, 90);
    strokeWeight(1.5);
    noFill();
    
    // Add some subtle pulsing to the line length
    let pulse = sin(time * 2 + i) * 15;
    let currentLength = lineObj.length + pulse;
    endX = lineObj.x + cos(lineObj.angle) * currentLength;
    endY = lineObj.y + sin(lineObj.angle) * currentLength;
    
    // Draw the line
    line(lineObj.x, lineObj.y, endX, endY);
    
    // Move the line's starting point
    lineObj.x += cos(lineObj.angle) * 0.3;
    lineObj.y += sin(lineObj.angle) * 0.3;
    
    // Wrap around screen edges
    if (lineObj.x > width + 100) lineObj.x = -100;
    else if (lineObj.x < -100) lineObj.x = width + 100;
    if (lineObj.y > height + 100) lineObj.y = -100;
    else if (lineObj.y < -100) lineObj.y = height + 100;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
