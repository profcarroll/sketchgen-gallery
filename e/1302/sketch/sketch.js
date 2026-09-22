let needles = [];
const needleCount = 2000;
const north = { x: 0, y: -1 };
let cursor = { x: 0, y: 0 };
let isDragging = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  for (let i = 0; i < needleCount; i++) {
    needles.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      targetAngle: 0,
      speed: random(0.005, 0.02),
      drift: random(0.01, 0.03),
      strength: random(0.05, 0.2)
    });
  }
}

function draw() {
  background(0, 0, 95);

  // Update cursor position
  if (isDragging) {
    cursor.x = mouseX;
    cursor.y = mouseY;
  }

  // Apply forces to needles
  for (let needle of needles) {
    let dx = cursor.x - needle.x;
    let dy = cursor.y - needle.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Calculate target angle toward cursor
    if (distance < 300) {
      needle.targetAngle = atan2(dy, dx);
    } else {
      // Return to north when not near cursor
      needle.targetAngle = atan2(north.y, north.x);
    }

    // Apply drift and oscillation
    let driftForce = sin(frameCount * needle.drift) * 0.1;
    needle.targetAngle += driftForce;

    // Smoothly transition to target angle
    let diff = needle.targetAngle - needle.angle;
    // Normalize angle difference
    while (diff > PI) diff -= TWO_PI;
    while (diff < -PI) diff += TWO_PI;

    needle.angle += diff * needle.speed;
    
    // Draw needle
    push();
    translate(needle.x, needle.y);
    rotate(needle.angle);
    stroke(0, 0, 0, 0.7);
    strokeWeight(0.5);
    line(0, 0, 8, 0);
    pop();
  }
}

function mousePressed() {
  isDragging = true;
}

function mouseReleased() {
  isDragging = false;
}
