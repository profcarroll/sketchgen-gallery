let lines = [];
let numLines = 500;
let bgColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Dark viscous background
  bgColor = color(20, 10, 15);
  
  // Initialize lines with overlapping, sinuous paths
  for (let i = 0; i < numLines; i++) {
    lines.push({
      points: [],
      startX: random(width),
      startY: random(height),
      hue: random(20, 40), // Warm amber/yellow tones
      sat: 60 + random(20),
      bri: 30 + random(30),
      speed: random(0.0005, 0.002),
      amplitude: random(10, 50),
      frequency: random(0.005, 0.02),
      timeOffset: random(TWO_PI),
      pulseOffset: random(TWO_PI),
      lineWidth: random(0.5, 2)
    });
  }
}

function draw() {
  background(bgColor);
  
  // Draw subtle texture on background
  stroke(20, 10, 10);
  strokeWeight(0.3);
  for (let i = 0; i < 500; i++) {
    let x = random(width);
    let y = random(height);
    point(x, y);
  }
  
  // Update and draw each line
  for (let line of lines) {
    if (line.points.length === 0) {
      line.points.push({x: line.startX, y: line.startY});
    }
    
    // Pulsating motion mimicking geothermal activity
    let time = millis() * line.speed;
    let pulse = sin(time * 0.5 + line.pulseOffset) * 0.5 + 0.5;
    let x = line.startX + sin(time + line.timeOffset) * line.amplitude;
    let y = line.startY + cos(time * 0.7 + line.timeOffset) * line.amplitude * 0.7;
    
    // Add some noise for organic flow
    x += noise(time * 0.01, time * 0.02) * 30 - 15;
    y += noise(time * 0.02, time * 0.03) * 30 - 15;
    
    // Apply pulsation to amplitude
    let adjustedAmplitude = line.amplitude * (0.8 + pulse * 0.4);
    x += sin(time * 0.3) * adjustedAmplitude * 0.2;
    y += cos(time * 0.3) * adjustedAmplitude * 0.2;
    
    line.points.push({x, y});
    
    // Limit points to prevent memory issues
    if (line.points.length > 300) {
      line.points.shift();
    }
    
    // Draw the line with translucent beeswax-like color
    stroke(line.hue, line.sat, line.bri, 0.6);
    strokeWeight(line.lineWidth);
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
