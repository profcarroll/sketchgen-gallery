let needles = [];
const needleCount = 1000;
let targetX, targetY;
let isDragging = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize needles with random positions and orientations
  for (let i = 0; i < needleCount; i++) {
    needles.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      targetAngle: 0,
      speed: random(0.02, 0.05),
      drift: random(0.001, 0.003),
      hue: random(360),
      sat: random(50, 80),
      bri: random(70, 90)
    });
  }
  
  // Set initial target to center
  targetX = width / 2;
  targetY = height / 2;
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent background for trail effect
  
  // Update target based on mouse position or drift if not dragging
  if (isDragging) {
    targetX = mouseX;
    targetY = mouseY;
  } else {
    // Gradually return to center when not dragging
    targetX += (width/2 - targetX) * 0.001;
    targetY += (height/2 - targetY) * 0.001;
  }
  
  // Update and draw each needle
  for (let i = 0; i < needles.length; i++) {
    let n = needles[i];
    
    // Calculate angle to target
    let dx = targetX - n.x;
    let dy = targetY - n.y;
    let targetAngle = atan2(dy, dx);
    
    // Smoothly rotate towards target or drift
    if (isDragging) {
      n.targetAngle = targetAngle;
    } else {
      // Drift towards a shared direction over time
      n.targetAngle += (random(-0.05, 0.05) - n.targetAngle) * n.drift;
    }
    
    // Interpolate angle
    n.angle += (n.targetAngle - n.angle) * n.speed;
    
    // Draw needle as a line
    push();
    translate(n.x, n.y);
    rotate(n.angle);
    stroke(n.hue, n.sat, n.bri, 0.8);
    strokeWeight(1);
    line(0, 0, 5, 0); // Needle length is 5 pixels
    pop();
  }
}

function mousePressed() {
  isDragging = true;
}

function mouseReleased() {
  isDragging = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
