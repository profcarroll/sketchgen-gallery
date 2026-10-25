let mechanisms = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Create celestial clock mechanisms with intricate geometries
  for (let i = 0; i < 150; i++) {
    mechanisms.push({
      centerX: random(width),
      centerY: random(height),
      radius: random(20, 100),
      rotationSpeed: random(-0.005, 0.005),
      segmentCount: floor(random(3, 10)),
      layerOffset: random(TWO_PI),
      hue: random(200, 240), // Blue to blue-purple
      saturation: random(70, 90),
      brightness: random(80, 95),
      alpha: random(0.3, 0.6),
      phaseShift: random(TWO_PI)
    });
  }
}

function draw() {
  background(0, 0, 98, 0.1); // Light cream background for vellum effect
  
  time += 0.01;

  // Draw mechanical structures
  for (let i = 0; i < mechanisms.length; i++) {
    let m = mechanisms[i];
    
    push();
    translate(m.centerX, m.centerY);
    
    // Create shifting, asymmetrical patterns
    let rotation = time * m.rotationSpeed + m.layerOffset;
    
    fill(m.hue % 360, m.saturation, m.brightness, m.alpha);
    
    // Draw complex mechanical gears and linkages
    beginShape();
    for (let j = 0; j < m.segmentCount; j++) {
      let angle = map(j, 0, m.segmentCount, 0, TWO_PI) + rotation;
      let radius = m.radius * (1 + sin(time * 0.5 + angle * 3) * 0.2);
      
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add intricate connecting lines
    stroke(m.hue % 360, m.saturation, m.brightness, m.alpha * 0.7);
    noFill();
    beginShape();
    for (let j = 0; j < m.segmentCount; j++) {
      let angle1 = map(j, 0, m.segmentCount, 0, TWO_PI) + rotation;
      let angle2 = map((j + 1) % m.segmentCount, 0, m.segmentCount, 0, TWO_PI) + rotation;
      
      let x1 = cos(angle1) * (m.radius * 0.7);
      let y1 = sin(angle1) * (m.radius * 0.7);
      let x2 = cos(angle2) * (m.radius * 0.7);
      let y2 = sin(angle2) * (m.radius * 0.7);
      
      vertex(x1, y1);
      vertex(x2, y2);
    }
    endShape();
    
    pop();
  }
  
  // Add subtle shifting abstract shapes
  for (let i = 0; i < 50; i++) {
    let x = (sin(time * 0.3 + i) * width * 0.3) + width * 0.5;
    let y = (cos(time * 0.2 + i) * height * 0.3) + height * 0.5;
    let size = sin(time * 0.1 + i) * 10 + 20;
    
    fill(220, 80, 90, 0.2);
    ellipse(x, y, size, size * 0.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
