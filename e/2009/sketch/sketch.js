let crystals = [];
let lines = [];
const crystalCount = 150;
const lineCount = 300;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create crystals
  for (let i = 0; i < crystalCount; i++) {
    crystals.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      rotation: random(TWO_PI),
      hue: random(180, 240),
      saturation: random(30, 60),
      brightness: random(70, 90),
      pulseSpeed: random(0.005, 0.01),
      pulseOffset: random(TWO_PI)
    });
  }
  
  // Create stress fracture lines
  for (let i = 0; i < lineCount; i++) {
    const startX = random(width);
    const startY = random(height);
    const endX = random(width);
    const endY = random(height);
    
    lines.push({
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      hue: random(180, 240),
      saturation: random(50, 80),
      brightness: random(60, 90),
      pulseSpeed: random(0.003, 0.007),
      pulseOffset: random(TWO_PI),
      width: random(1, 3)
    });
  }
}

function draw() {
  background(220, 10, 5);
  
  time += 0.01;
  
  // Draw stress fractures with pulsating phosphorescent light
  for (let i = 0; i < lines.length; i++) {
    const lineObj = lines[i];
    const pulse = sin(time * lineObj.pulseSpeed + lineObj.pulseOffset) * 0.5 + 0.5;
    
    stroke(lineObj.hue, lineObj.saturation, lineObj.brightness, pulse * 0.8);
    strokeWeight(lineObj.width + pulse * 2);
    line(lineObj.x1, lineObj.y1, lineObj.x2, lineObj.y2);
  }
  
  // Draw crystals with breathing motion
  for (let i = 0; i < crystals.length; i++) {
    const crystal = crystals[i];
    const pulse = sin(time * crystal.pulseSpeed + crystal.pulseOffset) * 0.5 + 0.5;
    
    push();
    translate(crystal.x, crystal.y);
    rotate(crystal.rotation);
    
    // Draw crystal with phosphorescent glow
    noStroke();
    fill(crystal.hue, crystal.saturation, crystal.brightness, pulse * 0.3);
    
    // Create a crystalline structure using multiple shapes
    const size = crystal.size * (0.8 + pulse * 0.4);
    const segments = floor(random(5, 12));
    
    for (let j = 0; j < segments; j++) {
      const angle = map(j, 0, segments, 0, TWO_PI);
      const radius = size * 0.7;
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      
      // Draw a small crystal facet
      push();
      translate(x, y);
      rotate(angle + PI/4);
      rect(0, 0, size * 0.2, size * 0.3);
      pop();
    }
    
    // Central core
    fill(crystal.hue, crystal.saturation, crystal.brightness, pulse * 0.6);
    ellipse(0, 0, size * 0.4, size * 0.4);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
