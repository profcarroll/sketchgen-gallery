let dots = [];
let numDots = 150;
let arcRadius = 200;
let centerX, centerY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  centerX = width / 2;
  centerY = height / 2;
  
  // Create dots in a symmetrical arc pattern
  for (let i = 0; i < numDots; i++) {
    let angle = map(i, 0, numDots, -PI/3, PI/3);
    let x = centerX + cos(angle) * arcRadius;
    let y = centerY + sin(angle) * arcRadius;
    dots.push({
      x: x,
      y: y,
      originalX: x,
      originalY: y,
      angle: angle,
      size: random(2, 6),
      brightness: random(150, 255),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.005;
  
  // Update and display dots
  for (let dot of dots) {
    // Gentle pulsing motion
    let pulse = sin(time * 2 + dot.phase) * 0.3 + 0.7;
    
    // Slow arc shifting
    let shift = sin(time * 0.5 + dot.angle) * 20;
    
    // Apply transformations
    let x = dot.originalX + shift * cos(dot.angle);
    let y = dot.originalY + shift * sin(dot.angle);
    
    // Apply pulsing size and brightness
    let size = dot.size * pulse;
    let brightness = dot.brightness * pulse;
    
    fill(255, 255, 200, brightness);
    ellipse(x, y, size);
  }
  
  // Connect dots with lines to form a symmetrical pattern
  stroke(255, 100);
  noFill();
  beginShape();
  for (let dot of dots) {
    let pulse = sin(time * 2 + dot.phase) * 0.3 + 0.7;
    let x = dot.originalX + sin(time * 0.5 + dot.angle) * 20 * cos(dot.angle);
    let y = dot.originalY + sin(time * 0.5 + dot.angle) * 20 * sin(dot.angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
  
  // Re-position dots
  for (let i = 0; i < dots.length; i++) {
    let dot = dots[i];
    let angle = map(i, 0, numDots, -PI/3, PI/3);
    dot.originalX = centerX + cos(angle) * arcRadius;
    dot.originalY = centerY + sin(angle) * arcRadius;
  }
}
