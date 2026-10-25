let lines = [];
let numLines = 300;
let bgColor;
let inkColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Textured off-white background
  bgColor = color(40, 5, 95);
  inkColor = color(20, 80, 20);
  
  // Initialize lines with random starting positions and properties
  for (let i = 0; i < numLines; i++) {
    lines.push({
      points: [],
      startX: random(width),
      startY: random(height),
      hue: random(10, 30), // Warm metallic tones
      sat: 80 + random(10),
      bri: 60 + random(20),
      speed: random(0.001, 0.005),
      amplitude: random(20, 80),
      frequency: random(0.01, 0.03),
      timeOffset: random(TWO_PI)
    });
  }
}

function draw() {
  background(bgColor);
  
  // Draw subtle texture on background
  stroke(40, 5, 90);
  strokeWeight(0.5);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    point(x, y);
  }
  
  // Update and draw each line
  for (let line of lines) {
    if (line.points.length === 0) {
      line.points.push({x: line.startX, y: line.startY});
    }
    
    // Add new point based on slow oscillating motion
    let time = millis() * line.speed;
    let x = line.startX + sin(time + line.timeOffset) * line.amplitude;
    let y = line.startY + cos(time * 0.7 + line.timeOffset) * line.amplitude * 0.7;
    
    // Add some noise for organic flow
    x += noise(time * 0.01, time * 0.02) * 20 - 10;
    y += noise(time * 0.02, time * 0.03) * 20 - 10;
    
    line.points.push({x, y});
    
    // Limit points to prevent memory issues
    if (line.points.length > 500) {
      line.points.shift();
    }
    
    // Draw the line with dark ink color
    stroke(line.hue, line.sat, line.bri);
    strokeWeight(1);
    noFill();
    
    beginShape();
    for (let point of line.points) {
      vertex(point.x, point.y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
