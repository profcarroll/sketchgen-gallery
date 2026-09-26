let bands = [];
let tideLevel = 0;
let time = 0;
let rippleOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create horizontal bands
  for (let i = 0; i < 30; i++) {
    bands.push({
      y: map(i, 0, 29, 0, height),
      height: height / 30,
      color: color(0, 100 + i * 3, 150 + i * 2, 200),
      phase: i * 0.1,
      speed: random(0.01, 0.03)
    });
  }
}

function draw() {
  background(10, 20, 40);
  
  time += 0.005;
  rippleOffset += 0.02;
  
  // Draw the tide level indicator band (darker)
  const highTideY = height * 0.3;
  fill(0, 50, 100, 220);
  noStroke();
  rect(0, highTideY - 15, width, 30);
  
  // Draw the bands with combined motion
  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    
    // Calculate tide oscillation
    const tideOffset = sin(time * 0.3 + band.phase) * 20;
    
    // Calculate ripple effect
    const rippleOffsetX = sin(rippleOffset + i * 0.1) * 5;
    
    // Combine movements
    const currentY = band.y + tideOffset;
    
    // Make the high tide band darker
    if (abs(currentY - highTideY) < 30) {
      fill(0, 30, 70, 240);
    } else {
      fill(band.color);
    }
    
    // Draw with slight horizontal displacement for ripple effect
    push();
    translate(rippleOffsetX, 0);
    rect(0, currentY, width, band.height);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
