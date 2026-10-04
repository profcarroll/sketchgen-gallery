let dots = [];
let numDots = 200;
let waveRadius = 150;
let centerX, centerY;
let time = 0;
let contractionPhase = 0;
let isContracting = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  centerX = width / 2;
  centerY = height / 2;
  
  // Create dots in a circular pattern
  for (let i = 0; i < numDots; i++) {
    let angle = map(i, 0, numDots, 0, TWO_PI);
    let x = centerX + cos(angle) * waveRadius;
    let y = centerY + sin(angle) * waveRadius;
    dots.push({
      x: x,
      y: y,
      originalX: x,
      originalY: y,
      angle: angle,
      size: random(2, 5),
      brightness: random(150, 255),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Control the contraction and expansion cycle
  if (frameCount % 300 === 0) { // Every 300 frames, start a new cycle
    isContracting = true;
    contractionPhase = 0;
  }
  
  if (isContracting && contractionPhase < 1) {
    contractionPhase += 0.02;
  } else if (isContracting && contractionPhase >= 1) {
    isContracting = false;
  }
  
  // Update and display dots
  for (let dot of dots) {
    // Create a synchronized wave motion
    let wave = sin(time + dot.angle) * 0.5 + 0.5;
    
    // Apply wave to position
    let pulse = sin(time * 2 + dot.phase) * 0.3 + 0.7;
    let shift = wave * 100;
    
    // Apply contraction/expansion effect
    let radiusFactor = 1;
    if (isContracting) {
      radiusFactor = 1 - contractionPhase * 0.9; // Contract to a point
    } else {
      radiusFactor = 0.1 + contractionPhase * 0.9; // Expand from center
    }
    
    let x = centerX + cos(dot.angle) * shift * radiusFactor;
    let y = centerY + sin(dot.angle) * shift * radiusFactor;
    
    // Apply pulsing size and brightness
    let size = dot.size * pulse;
    let brightness = dot.brightness * pulse;
    
    fill(255, 255, 200, brightness);
    ellipse(x, y, size);
  }
  
  // Connect dots with lines to form a continuous wave pattern
  stroke(255, 100);
  noFill();
  beginShape();
  for (let dot of dots) {
    let wave = sin(time + dot.angle) * 0.5 + 0.5;
    let shift = wave * 100;
    
    // Apply contraction/expansion effect
    let radiusFactor = 1;
    if (isContracting) {
      radiusFactor = 1 - contractionPhase * 0.9; // Contract to a point
    } else {
      radiusFactor = 0.1 + contractionPhase * 0.9; // Expand from center
    }
    
    let x = centerX + cos(dot.angle) * shift * radiusFactor;
    let y = centerY + sin(dot.angle) * shift * radiusFactor;
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
    let angle = map(i, 0, numDots, 0, TWO_PI);
    dot.originalX = centerX + cos(angle) * waveRadius;
    dot.originalY = centerY + sin(angle) * waveRadius;
  }
}
