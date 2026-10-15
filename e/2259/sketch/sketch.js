let lines = [];
let maxLines = 1500;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize lines for lattice structure
  for (let i = 0; i < maxLines; i++) {
    lines.push({
      x: random(width),
      y: random(height),
      length: random(20, 80),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005),
      hue: random(360),
      alpha: random(0.4, 0.8),
      frequency: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.05);
  
  time += 0.02;
  
  // Draw and update lines
  for (let i = 0; i < lines.length; i++) {
    let lineObj = lines[i];
    
    // Animate position and angle using noise
    lineObj.x += cos(lineObj.angle) * lineObj.speed * 100;
    lineObj.y += sin(lineObj.angle) * lineObj.speed * 100;
    lineObj.angle += (noise(lineObj.x * 0.002, lineObj.y * 0.002, time * lineObj.frequency) - 0.5) * 0.05;
    
    // Reset line if out of bounds
    if (lineObj.x < -100 || lineObj.x > width + 100 ||
        lineObj.y < -100 || lineObj.y > height + 100) {
      lineObj.x = random(width);
      lineObj.y = random(height);
      lineObj.angle = random(TWO_PI);
    }
    
    // Draw the line
    stroke(lineObj.hue, 80, 90, lineObj.alpha);
    strokeWeight(1.5);
    line(
      lineObj.x,
      lineObj.y,
      lineObj.x + cos(lineObj.angle) * lineObj.length,
      lineObj.y + sin(lineObj.angle) * lineObj.length
    );
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
