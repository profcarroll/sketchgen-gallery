let pulses = [];
let maxPulses = 100;
let centerX, centerY;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  frameRate(30);
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Initialize pulses
  for (let i = 0; i < maxPulses; i++) {
    pulses.push({
      radius: 0,
      speed: random(1, 3),
      hue: map(i, 0, maxPulses, 200, 320), // Blue to violet
      alpha: random(0.2, 0.6),
      angle: random(TWO_PI),
      phase: random(TWO_PI),
      growthRate: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(0, 0, 0, 1);
  
  time += 0.02;
  
  push();
  translate(centerX, centerY);
  
  // Draw expanding pulses
  for (let i = 0; i < pulses.length; i++) {
    let pulse = pulses[i];
    
    // Update radius
    pulse.radius += pulse.speed;
    
    // Reset if too large
    if (pulse.radius > max(width, height) * 1.5) {
      pulse.radius = 0;
      pulse.angle = random(TWO_PI);
    }
    
    // Create a pulsing effect
    let pulseRadius = pulse.radius + sin(time * 2 + pulse.phase) * 5;
    
    // Draw pulse as a glowing ring
    fill(pulse.hue, 100, 100, pulse.alpha * 0.3);
    ellipse(0, 0, pulseRadius * 2, pulseRadius * 2);
    
    // Draw crystal-like structures at pulse locations
    if (pulse.radius > 10) {
      let crystalSize = map(pulse.radius, 10, max(width, height), 5, 20);
      
      // Create a crystalline pattern based on time and position
      for (let j = 0; j < 6; j++) {
        let angle = (time * 0.5 + j * TWO_PI / 6) + pulse.angle;
        let crystalX = cos(angle) * pulse.radius;
        let crystalY = sin(angle) * pulse.radius;
        
        // Draw crystalline structure
        fill(pulse.hue, 100, 100, pulse.alpha);
        push();
        translate(crystalX, crystalY);
        
        // Rotate based on time for dynamic effect
        rotate(time + j);
        
        // Draw a geometric crystal shape (hexagon with inner triangles)
        beginShape();
        for (let k = 0; k < 6; k++) {
          let angle = k * TWO_PI / 6;
          let x = cos(angle) * crystalSize;
          let y = sin(angle) * crystalSize;
          vertex(x, y);
        }
        endShape(CLOSE);
        
        // Draw inner triangles
        stroke(pulse.hue, 100, 100, pulse.alpha * 0.8);
        noFill();
        for (let k = 0; k < 3; k++) {
          let angle1 = k * TWO_PI / 3;
          let angle2 = (k + 1) % 3 * TWO_PI / 3;
          line(
            cos(angle1) * crystalSize * 0.5,
            sin(angle1) * crystalSize * 0.5,
            cos(angle2) * crystalSize * 0.5,
            sin(angle2) * crystalSize * 0.5
          );
        }
        pop();
      }
    }
    
    // Draw connecting lines between nearby pulses for structure
    if (i > 0 && i % 10 === 0) {
      let prevPulse = pulses[i - 10];
      let dx = prevPulse.radius * cos(prevPulse.angle) - pulse.radius * cos(pulse.angle);
      let dy = prevPulse.radius * sin(prevPulse.angle) - pulse.radius * sin(pulse.angle);
      
      if (sqrt(dx * dx + dy * dy) < 100) {
        stroke(pulse.hue, 100, 100, pulse.alpha * 0.2);
        line(
          pulse.radius * cos(pulse.angle),
          pulse.radius * sin(pulse.angle),
          prevPulse.radius * cos(prevPulse.angle),
          prevPulse.radius * sin(prevPulse.angle)
        );
      }
    }
  }
  
  // Draw central point
  fill(240, 100, 100, 0.9);
  ellipse(0, 0, 15, 15);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 2;
}
