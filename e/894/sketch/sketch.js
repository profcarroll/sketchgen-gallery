let cornStalks = [];
let lightPulse = 0;
let pulseSpeed = 0.05;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create corn stalks
  for (let i = 0; i < 200; i++) {
    cornStalks.push({
      x: random(width),
      y: random(height * 0.3, height * 0.7),
      h: random(40, 80),
      w: random(2, 5)
    });
  }
}

function draw() {
  background(0);
  
  // Update pulse
  lightPulse += pulseSpeed;
  
  // Draw corn field
  drawCornField();
  
  // Draw glowing disc
  drawDisc();
  
  // Draw pulsating light
  drawLight();
}

function drawCornField() {
  noStroke();
  fill(30, 120, 30);
  for (let stalk of cornStalks) {
    rect(stalk.x, stalk.y, stalk.w, stalk.h);
  }
}

function drawDisc() {
  // Draw the glowing disc
  push();
  translate(width/2, height/4);
  
  // Disc glow
  noStroke();
  fill(255, 255, 255, 100);
  ellipse(0, 0, 80, 80);
  
  // Disc body
  fill(200, 200, 200);
  ellipse(0, 0, 60, 60);
  
  pop();
}

function drawLight() {
  // Draw semicircular light pattern that pulses and flickers
  const centerX = width/2;
  const centerY = height * 0.7;
  const maxRadius = 150;
  const baseRadius = maxRadius * (0.8 + sin(lightPulse) * 0.1);
  
  // Create a pulsating flicker effect
  const flickerIntensity = 0.3 + sin(lightPulse * 2) * 0.2 + sin(lightPulse * 7) * 0.1;
  
  // Draw semicircle with varying intensity and radius
  noStroke();
  beginShape();
  for (let i = 0; i <= 180; i += 5) {
    const angle = radians(i);
    const radius = baseRadius + random(-20, 20) * flickerIntensity;
    const x = centerX + cos(angle) * radius;
    const y = centerY + sin(angle) * radius;
    
    // Vary the color intensity
    const intensity = 200 + random(55) * flickerIntensity;
    fill(0, 255, 255, intensity);
    vertex(x, y);
  }
  endShape(CLOSE);
}
