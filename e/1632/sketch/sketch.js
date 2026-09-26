let sandParticles = [];
const particleCount = 1500;
const glassWidth = 200;
const glassHeight = 400;
const neckWidth = 20;
const neckHeight = 60;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize sand particles
  for (let i = 0; i < particleCount; i++) {
    sandParticles.push({
      x: width/2,
      y: height/2 + glassHeight/2 - random(neckHeight),
      vx: 0,
      vy: 0,
      size: random(1, 3),
      hue: 200, // sapphire blue
      sat: 80,
      bri: 70
    });
  }
}

function draw() {
  background(220, 20, 95); // Clean, minimalist background
  
  // Draw glass container
  stroke(200, 30, 90);
  strokeWeight(3);
  noFill();
  
  // Top bulb
  ellipse(width/2, height/2 - glassHeight/2 + neckHeight/2, glassWidth, glassHeight - neckHeight);
  
  // Neck
  rectMode(CENTER);
  rect(width/2, height/2, neckWidth, neckHeight);
  
  // Bottom bulb
  ellipse(width/2, height/2 + glassHeight/2 - neckHeight/2, glassWidth, glassHeight - neckHeight);
  
  // Update and display particles
  for (let i = 0; i < sandParticles.length; i++) {
    let p = sandParticles[i];
    
    // Move particles upward (opposite to gravity)
    p.vy = -0.8 + sin(frameCount * 0.02 + i * 0.01) * 0.3;
    p.vx = sin(frameCount * 0.01 + i * 0.02) * 0.1;
    
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    
    // Reset particles that go off screen or reach the top
    if (p.y < height/2 - glassHeight/2 - 50 || p.y > height/2 + glassHeight/2 + 50) {
      p.x = width/2 + random(-glassWidth/2, glassWidth/2);
      p.y = height/2 + glassHeight/2 - random(neckHeight);
    }
    
    // Draw particle
    noStroke();
    fill(p.hue, p.sat, p.bri, 0.8);
    ellipse(p.x, p.y, p.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
