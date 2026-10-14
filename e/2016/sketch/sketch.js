let crystals = [];
let segments = [];
const crystalCount = 30;
const segmentCount = 100;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  // Create crystalline formations
  for (let i = 0; i < crystalCount; i++) {
    crystals.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      angle: random(TWO_PI),
      speed: random(0.001, 0.005),
      hue: random(200, 240), // Deep blue tones
      segments: []
    });
  }

  // Create luminous segments
  for (let i = 0; i < segmentCount; i++) {
    segments.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.2, 0.8),
      hue: random(40, 80), // Yellow-orange tones
      alpha: random(0.2, 0.8),
      pulse: random(TWO_PI),
      pulseSpeed: random(0.02, 0.05)
    });
  }
}

function draw() {
  background(20, 10, 10); // Deep dark blue
  time += 0.01;

  // Draw crystalline formations
  for (let crystal of crystals) {
    crystal.angle += crystal.speed;
    
    // Draw crystal structure
    push();
    translate(crystal.x, crystal.y);
    rotate(crystal.angle);
    
    // Main crystal body
    fill(crystal.hue, 80, 90);
    noStroke();
    for (let i = 0; i < 6; i++) {
      const angle = map(i, 0, 6, 0, TWO_PI);
      const x = cos(angle) * crystal.size;
      const y = sin(angle) * crystal.size;
      ellipse(x, y, crystal.size * 0.8, crystal.size * 0.3);
    }
    
    // Crystal points
    for (let i = 0; i < 6; i++) {
      const angle = map(i, 0, 6, 0, TWO_PI);
      const x = cos(angle) * crystal.size;
      const y = sin(angle) * crystal.size;
      fill(crystal.hue, 70, 100);
      ellipse(x, y, crystal.size * 0.2, crystal.size * 0.6);
    }
    
    pop();
  }

  // Draw luminous segments
  for (let segment of segments) {
    // Update position
    segment.y -= segment.speed;
    
    // Reset if out of view
    if (segment.y < -10) {
      segment.y = height + 10;
      segment.x = random(width);
    }
    
    // Pulse effect
    const pulse = sin(segment.pulse) * 0.5 + 0.5;
    segment.pulse += segment.pulseSpeed;
    
    // Draw glowing segment
    noStroke();
    fill(segment.hue, 100, 100, segment.alpha * pulse);
    ellipse(segment.x, segment.y, segment.size * pulse, segment.size * pulse);
    
    // Add subtle glow
    const glow = segment.size * 2;
    drawingContext.shadowBlur = glow;
    drawingContext.shadowColor = color(segment.hue, 100, 100, segment.alpha * pulse * 0.5);
    ellipse(segment.x, segment.y, glow, glow);
    drawingContext.shadowBlur = 0;
  }

  // Connect segments to crystals with soft lines
  for (let segment of segments) {
    for (let crystal of crystals) {
      const d = dist(segment.x, segment.y, crystal.x, crystal.y);
      
      if (d < crystal.size * 2) {
        const alpha = map(d, 0, crystal.size * 2, 0.3, 0);
        
        stroke(crystal.hue, 60, 100, alpha);
        strokeWeight(0.5);
        line(segment.x, segment.y, crystal.x, crystal.y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
