let pointers = [];
const numPointers = 1000;
const north = { x: 0, y: -1 };
let cursorTracked = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize pointers with random positions and orientations
  for (let i = 0; i < numPointers; i++) {
    pointers.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      targetAngle: null,
      speed: random(0.01, 0.03),
      driftSpeed: random(0.001, 0.005)
    });
  }
}

function draw() {
  background(220, 5, 95);
  
  // Update and display pointers
  for (let i = 0; i < pointers.length; i++) {
    const p = pointers[i];
    
    // If cursor is near, track it immediately
    if (cursorTracked) {
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distance = dist(p.x, p.y, mouseX, mouseY);
      
      // Only track if within a certain radius
      if (distance < 200) {
        p.targetAngle = atan2(dy, dx);
      } else {
        p.targetAngle = null;
      }
    } else {
      // Otherwise slowly drift toward north
      const dx = north.x;
      const dy = north.y;
      const targetAngle = atan2(dy, dx);
      p.targetAngle = targetAngle;
    }
    
    // Smoothly interpolate angle towards target
    if (p.targetAngle !== null) {
      let diff = p.targetAngle - p.angle;
      // Normalize the difference to be between -PI and PI
      while (diff > PI) diff -= TWO_PI;
      while (diff < -PI) diff += TWO_PI;
      
      p.angle += diff * p.speed;
    }
    
    // Drift towards north if no target or very close to it
    if (p.targetAngle === null || abs(p.angle - atan2(north.y, north.x)) < 0.05) {
      let diff = atan2(north.y, north.x) - p.angle;
      while (diff > PI) diff -= TWO_PI;
      while (diff < -PI) diff += TWO_PI;
      p.angle += diff * p.driftSpeed;
    }
    
    // Draw pointer as a small arrow
    push();
    translate(p.x, p.y);
    rotate(p.angle);
    stroke(0, 0, 0, 80);
    strokeWeight(0.5);
    line(0, 0, 8, 0);
    pop();
  }
}

function mousePressed() {
  // Start tracking cursor on first interaction
  cursorTracked = true;
}

function mouseMoved() {
  // Continue tracking cursor when it moves
  if (cursorTracked) {
    // No additional logic needed; already handled in draw()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
