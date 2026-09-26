let handAngle = 0;
let targetAngle = 0;
let isSpinning = false;
let spinSpeed = 0;
let pulseSpeed = 0.005;
let pulseAmplitude = 0.02;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Start with a gentle pulse
  pulseSpeed = 0.005;
  pulseAmplitude = 0.02;
}

function draw() {
  background(240);
  
  // Center of the canvas
  const cx = width / 2;
  const cy = height / 2;
  const radius = min(width, height) * 0.4;
  
  // Draw clock face
  stroke(0);
  noFill();
  ellipse(cx, cy, radius * 2, radius * 2);
  
  // Draw hour markers
  stroke(0);
  for (let i = 0; i < 12; i++) {
    const angle = map(i, 0, 12, 0, TWO_PI);
    const x1 = cx + cos(angle) * radius;
    const y1 = cy + sin(angle) * radius;
    const x2 = cx + cos(angle) * (radius - 15);
    const y2 = cy + sin(angle) * (radius - 15);
    line(x1, y1, x2, y2);
  }
  
  // Update hand angle
  if (isSpinning) {
    spinSpeed += 0.05; // Accelerate
    spinSpeed = min(spinSpeed, 0.3); // Cap speed
    handAngle += spinSpeed;
  } else {
    // Return to natural pulse
    spinSpeed *= 0.92; // Slow down
    if (abs(spinSpeed) < 0.001) spinSpeed = 0;
    
    // Gentle pulsing motion
    const pulse = sin(frameCount * pulseSpeed) * pulseAmplitude;
    handAngle += pulse;
  }
  
  // Draw the hand
  stroke(0);
  strokeWeight(3);
  const x = cx + cos(handAngle) * (radius - 20);
  const y = cy + sin(handAngle) * (radius - 20);
  line(cx, cy, x, y);
}

function mousePressed() {
  isSpinning = true;
  spinSpeed = 0.05; // Start spinning fast
  return false; // Prevent default behavior
}

function mouseReleased() {
  isSpinning = false;
  spinSpeed = 0;
}
