let pendulumAngle = 0;
let pendulumSpeed = 0;
let tearStructures = [];
let noiseOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize tear structures
  for (let i = 0; i < 50; i++) {
    tearStructures.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-100, 100),
      size: random(20, 80),
      time: random(TWO_PI),
      angle: random(TWO_PI),
      growth: 0,
      hue: random(0, 60)
    });
  }
  
  // Start with pendulum at rest
  pendulumSpeed = 0.01;
}

function draw() {
  background(0);
  
  // Update pendulum physics
  pendulumAngle += pendulumSpeed;
  pendulumSpeed *= 0.9995; // Damping
  
  // Apply pendulum force to tear structures
  let pendulumForce = sin(pendulumAngle) * 0.5 + 0.5;
  
  // Draw tearing membrane with fracturing patterns
  for (let i = 0; i < tearStructures.length; i++) {
    let tear = tearStructures[i];
    
    push();
    translate(tear.x, tear.y, tear.z);
    
    // Rotate based on pendulum position
    rotateY(pendulumAngle * 2 + tear.time);
    rotateX(pendulumAngle * 0.5);
    
    // Growth based on pendulum force
    tear.growth += pendulumForce * 0.03;
    
    // Draw tear structure with corrugated cardboard texture
    stroke(tear.hue, 70, 90, 0.8);
    strokeWeight(1);
    noFill();
    
    // Base tear shape - fractal-like
    let baseSize = tear.size * (0.3 + tear.growth * 0.7);
    
    // Draw corrugated cardboard pattern
    beginShape();
    for (let j = 0; j < 12; j++) {
      let angle = TWO_PI * j / 12;
      let radius = baseSize * (0.8 + noise(noiseOffset + j * 0.3) * 0.4);
      
      // Add corrugation
      let corrugation = sin(angle * 3 + noiseOffset * 2) * 5;
      radius += corrugation;
      
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add tearing fractures
    stroke(tear.hue + 30, 80, 70, 0.6);
    for (let j = 0; j < 6; j++) {
      let angle1 = TWO_PI * j / 6 + noiseOffset * 0.5;
      let angle2 = angle1 + PI + sin(noiseOffset + j) * 0.5;
      
      let x1 = cos(angle1) * baseSize * 0.5;
      let y1 = sin(angle1) * baseSize * 0.5;
      let x2 = cos(angle2) * baseSize * 0.8;
      let y2 = sin(angle2) * baseSize * 0.8;
      
      line(x1, y1, x2, y2);
    }
    
    // Add structural fractures
    stroke(tear.hue + 60, 90, 60, 0.7);
    for (let j = 0; j < 8; j++) {
      let angle = TWO_PI * j / 8 + noiseOffset;
      let length = baseSize * (0.2 + noise(noiseOffset + j * 0.2) * 0.3);
      
      let x1 = cos(angle) * baseSize * 0.3;
      let y1 = sin(angle) * baseSize * 0.3;
      let x2 = cos(angle) * (baseSize * 0.3 + length);
      let y2 = sin(angle) * (baseSize * 0.3 + length);
      
      line(x1, y1, x2, y2);
    }
    
    pop();
    
    // Reset tears occasionally with sudden cascade
    if (random() < 0.002) {
      tear.growth = 0;
      tear.hue += random(-10, 10);
      if (tear.hue < 0) tear.hue += 360;
      if (tear.hue > 360) tear.hue -= 360;
    }
    
    // Occasionally create new tears
    if (random() < 0.005 && tearStructures.length < 100) {
      tearStructures.push({
        x: random(-width/2, width/2),
        y: random(-height/2, height/2),
        z: random(-100, 100),
        size: random(20, 80),
        time: random(TWO_PI),
        angle: random(TWO_PI),
        growth: 0,
        hue: random(0, 60)
      });
    }
  }
  
  // Update noise offset for animation
  noiseOffset += 0.02;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
