let cornStalks = [];
let beamPulse = 0;
let beamPhase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create corn stalks
  for (let i = 0; i < 200; i++) {
    cornStalks.push({
      x: random(-width/2 + 100, width/2 - 100),
      z: random(-height/2 + 100, height/2 - 100),
      y: 0,
      height: random(80, 150)
    });
  }
}

function draw() {
  background(0);
  
  // Update pulse for beam effect
  beamPulse = sin(frameCount * 0.1) * 0.5 + 0.5;
  beamPhase += 0.02;
  
  // Draw corn field
  drawCornField();
  
  // Draw hovering disc craft
  drawDiscCraft();
  
  // Draw light beams
  drawLightBeams();
}

function drawCornField() {
  // Draw ground
  fill(30, 100, 30);
  noStroke();
  plane(width, height);
  
  // Draw corn stalks
  stroke(100, 60, 20);
  strokeWeight(3);
  for (let stalk of cornStalks) {
    push();
    translate(stalk.x, stalk.y - stalk.height/2, stalk.z);
    line(0, 0, 0, 0, stalk.height, 0);
    pop();
  }
}

function drawDiscCraft() {
  // Draw the hovering disc
  push();
  translate(0, -150, 0);
  rotateX(HALF_PI);
  fill(255, 255, 255, 100);
  noStroke();
  ellipse(0, 0, 200, 200);
  
  // Add glowing center
  fill(200, 255, 255, 200);
  ellipse(0, 0, 80, 80);
  
  pop();
}

function drawLightBeams() {
  // Draw two intense beams of light
  const beamIntensity = 200 + sin(frameCount * 0.1) * 50;
  
  for (let i = 0; i < 2; i++) {
    push();
    
    // Position beams
    const offset = i === 0 ? -30 : 30;
    translate(offset, -150, 0);
    
    // Create pulsing beam effect
    const pulse = sin(frameCount * 0.2 + i) * 0.3 + 0.7;
    const beamWidth = 150 * pulse;
    
    // Draw beam
    fill(0, 255, 255, 80 * pulse);
    noStroke();
    beginShape();
    vertex(0, 0, 0);
    vertex(beamWidth/2, -height/2, 0);
    vertex(-beamWidth/2, -height/2, 0);
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw ground illumination
  const glowIntensity = 150 + sin(frameCount * 0.1) * 50;
  fill(0, 255, 255, glowIntensity * 0.2);
  noStroke();
  ellipse(0, height/2 - 50, 300, 150);
  
  // Add shifting patterns
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * TWO_PI + beamPhase;
    const radius = 100 + sin(frameCount * 0.05 + i) * 30;
    const x = cos(angle) * radius;
    const z = sin(angle) * radius;
    
    fill(0, 255, 255, 50);
    ellipse(x, height/2 - 50, 40, 20);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
