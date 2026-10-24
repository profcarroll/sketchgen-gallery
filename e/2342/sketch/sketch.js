let vessels = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create bioluminescent vessels
  for (let i = 0; i < 12; i++) {
    vessels.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      size: random(30, 80),
      speed: random(0.001, 0.003),
      hue: random(180, 220), // blue to cyan range
      pulseSpeed: random(0.01, 0.03),
      phase: random(TWO_PI),
      rotation: random(TWO_PI),
      twist: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 5, 0.1);
  
  time += 0.002;
  
  // Draw vessels with pulsing bioluminescence
  for (let i = 0; i < vessels.length; i++) {
    let vessel = vessels[i];
    
    push();
    
    // Update position
    vessel.x += sin(time * vessel.speed) * 0.5;
    vessel.y += cos(time * vessel.speed * 0.7) * 0.3;
    vessel.z += sin(time * vessel.speed * 1.2) * 0.4;
    
    // Keep within bounds
    if (vessel.x > width/2 + 100) vessel.x = -width/2 - 100;
    if (vessel.x < -width/2 - 110) vessel.x = width/2 + 100;
    if (vessel.y > height/2 + 100) vessel.y = -height/2 - 100;
    if (vessel.y < -height/2 - 110) vessel.y = height/2 + 100;
    
    translate(vessel.x, vessel.y, vessel.z);
    rotateZ(vessel.rotation);
    rotateY(time * 0.1 + vessel.twist);
    
    // Pulsing glow effect
    let pulse = sin(time * vessel.pulseSpeed + vessel.phase) * 0.5 + 0.5;
    let glowSize = vessel.size * (1 + pulse * 0.8);
    
    // Main vessel body
    noStroke();
    fill(vessel.hue, 90, 80, 0.7);
    sphere(glowSize, 8, 6);
    
    // Inner core glow
    fill(vessel.hue, 100, 95, 0.8);
    sphere(glowSize * 0.4, 6, 4);
    
    // Subtle energy trail
    stroke(vessel.hue, 80, 70, 0.2);
    strokeWeight(1);
    beginShape();
    for (let j = 0; j < 10; j++) {
      let angle = map(j, 0, 10, 0, TWO_PI);
      let radius = vessel.size * 0.8 + sin(time * 2 + j) * 5;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      let z = sin(time + angle * 3) * 10;
      
      vertex(x, y, z);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Add subtle ambient lighting
  for (let i = 0; i < 50; i++) {
    let x = random(-width/2, width/2);
    let y = random(-height/2, height/2);
    let z = random(-500, 500);
    
    push();
    translate(x, y, z);
    
    let pulse = sin(time * 0.5 + i) * 0.5 + 0.5;
    fill(190, 80, 90, 0.1 * pulse);
    sphere(2, 2, 2);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
