let structures = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  pixelDensity(1);
  
  // Create initial structures
  for (let i = 0; i < 200; i++) {
    structures.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speed: random(0.0005, 0.0015),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.002, 0.002),
      hue: random(200, 300),
      segments: floor(random(6, 10)),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  background(0);
  time += 0.01;
  
  // Draw all structures
  for (let i = 0; i < structures.length; i++) {
    const s = structures[i];
    
    // Update position
    s.x += sin(time * s.speed) * 0.3;
    s.y += cos(time * s.speed * 0.5) * 0.2;
    s.rotation += s.rotationSpeed;
    
    // Wrap around screen
    if (s.x > width + 100) s.x = -100;
    if (s.x < -100) s.x = width + 100;
    if (s.y > height + 100) s.y = -100;
    if (s.y < -100) s.y = height + 100;
    
    // Draw crystalline structure
    push();
    translate(s.x, s.y);
    rotate(s.rotation);
    
    strokeWeight(1.2);
    
    // Draw main structure
    for (let j = 0; j < s.segments; j++) {
      const angle = TWO_PI * j / s.segments;
      const nextAngle = TWO_PI * (j + 1) / s.segments;
      
      const x1 = cos(angle) * s.size * 0.5;
      const y1 = sin(angle) * s.size * 0.5;
      const x2 = cos(nextAngle) * s.size * 0.5;
      const y2 = sin(nextAngle) * s.size * 0.5;
      
      // Glow effect
      const pulse = sin(time * 3 + s.phase + j * 0.5) * 0.3 + 0.7;
      const hue = (s.hue + time * 10 + j * 20) % 360;
      
      stroke(hue, 80, 90, pulse * 0.7);
      line(x1, y1, x2, y2);
    }
    
    // Draw internal connections
    strokeWeight(0.4);
    for (let j = 0; j < s.segments; j++) {
      const angle1 = TWO_PI * j / s.segments;
      const angle2 = TWO_PI * (j + 2) / s.segments % TWO_PI;
      
      const x1 = cos(angle1) * s.size * 0.3;
      const y1 = sin(angle1) * s.size * 0.3;
      const x2 = cos(angle2) * s.size * 0.3;
      const y2 = sin(angle2) * s.size * 0.3;
      
      const pulse = sin(time * 4 + s.phase + j * 0.3) * 0.4 + 0.6;
      const hue = (s.hue + time * 15 + j * 15) % 360;
      
      stroke(hue, 70, 80, pulse * 0.5);
      line(x1, y1, x2, y2);
    }
    
    // Draw central core
    const corePulse = sin(time * 5 + s.phase) * 0.3 + 0.7;
    fill(s.hue, 90, 95, corePulse * 0.8);
    noStroke();
    ellipse(0, 0, s.size * 0.1);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
