let cornStalks = [];
let beamPhase = 0;
let glowPulse = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create corn stalks
  for (let i = 0; i < 300; i++) {
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
  
  // Update animation phases
  beamPhase += 0.01;
  glowPulse = sin(frameCount * 0.05) * 0.5 + 0.5;
  
  // Draw corn field
  drawCornField();
  
  // Draw hovering disc craft
  drawDiscCraft();
  
  // Draw dynamic light source
  drawLightSource();
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

function drawLightSource() {
  // Draw two initial vertical beams
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
  
  // Draw final glowing semicircle below the craft
  const glowRadius = 250 + sin(frameCount * 0.03) * 50;
  const pulseIntensity = 150 + sin(frameCount * 0.1) * 50;
  
  push();
  translate(0, height/2 - 50, 0);
  rotateX(HALF_PI);
  
  // Draw the pulsating semicircle glow
  fill(0, 255, 255, pulseIntensity * 0.3);
  noStroke();
  arc(0, 0, glowRadius, glowRadius, 0, PI, CHORD);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
