let lines = [];
let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 100);
  
  // Create lattice of lines
  for (let i = 0; i < 200; i++) {
    lines.push({
      x1: random(width),
      y1: random(height),
      x2: random(width),
      y2: random(height),
      hue: random(100),
      saturation: random(70, 100),
      brightness: random(80, 100),
      pulse: random(TWO_PI),
      speed: random(0.01, 0.03)
    });
  }
  
  // Create initial structures
  for (let i = 0; i < 5; i++) {
    structures.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      pulse: random(TWO_PI),
      speed: random(0.02, 0.05),
      hue: random(100)
    });
  }
}

function draw() {
  background(0, 0, 0, 20); // Semi-transparent background for trail effect
  
  time += 0.02;
  
  // Update and display structures
  for (let i = 0; i < structures.length; i++) {
    let s = structures[i];
    
    // Pulse structure
    s.pulse += s.speed;
    let pulseSize = s.size * (1 + sin(s.pulse) * 0.3);
    
    // Draw crystalline structure
    push();
    translate(s.x, s.y);
    rotate(time * 0.5);
    
    // Draw internal glowing lines
    stroke(s.hue, 100, 100, 80);
    strokeWeight(2);
    noFill();
    
    beginShape();
    for (let j = 0; j < 6; j++) {
      let angle = TWO_PI * j / 6;
      let x = cos(angle) * pulseSize;
      let y = sin(angle) * pulseSize;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Draw connecting lines
    stroke(s.hue, 100, 100, 50);
    for (let j = 0; j < 6; j++) {
      let angle1 = TWO_PI * j / 6;
      let angle2 = TWO_PI * (j + 2) % 6 / 6;
      line(
        cos(angle1) * pulseSize,
        sin(angle1) * pulseSize,
        cos(angle2) * pulseSize,
        sin(angle2) * pulseSize
      );
    }
    
    pop();
    
    // Create ripple effect around structure
    for (let j = 0; j < lines.length; j++) {
      let l = lines[j];
      let d = dist(s.x, s.y, (l.x1 + l.x2) / 2, (l.y1 + l.y2) / 2);
      
      if (d < pulseSize * 3) {
        let amp = map(d, 0, pulseSize * 3, 1, 0);
        let wave = sin(time * 5 + d * 0.1) * amp * 3;
        
        // Modify line properties
        l.hue += wave * 0.1;
        if (l.hue > 100) l.hue -= 100;
        if (l.hue < 0) l.hue += 100;
      }
    }
  }
  
  // Draw lattice lines with glow effect
  for (let i = 0; i < lines.length; i++) {
    let l = lines[i];
    
    // Pulsing effect
    l.pulse += l.speed;
    let pulse = sin(l.pulse) * 0.5 + 0.5;
    
    stroke(l.hue, l.saturation, l.brightness, pulse * 100);
    strokeWeight(pulse * 2 + 0.5);
    
    line(l.x1, l.y1, l.x2, l.y2);
  }
  
  // Occasionally spawn new structures
  if (frameCount % 300 === 0 && structures.length < 10) {
    structures.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      pulse: random(TWO_PI),
      speed: random(0.02, 0.05),
      hue: random(100)
    });
  }
  
  // Remove old structures
  if (structures.length > 10) {
    structures.splice(0, 1);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
