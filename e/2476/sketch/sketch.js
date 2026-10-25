let patterns = [];
let colorPalette = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  
  // Create a rich color palette
  for (let i = 0; i < 30; i++) {
    colorPalette.push(color(
      random(100, 255),
      random(80, 220),
      random(40, 180),
      random(180, 255)
    ));
  }
  
  // Generate complex interlocking spiral patterns
  for (let i = 0; i < 60; i++) {
    patterns.push({
      center: { x: random(width), y: random(height) },
      radius: random(40, 180),
      speed: random(0.002, 0.015),
      phase: random(TWO_PI),
      arms: floor(random(3, 12)),
      rotationSpeed: random(-0.008, 0.008),
      color: random(colorPalette),
      detail: floor(random(12, 30)),
      complexity: random(0.5, 2.0)
    });
  }
}

function draw() {
  background(10, 15, 30);
  
  // Draw interlocking spiral patterns
  for (let i = 0; i < patterns.length; i++) {
    const p = patterns[i];
    const time = frameCount * p.speed;
    
    push();
    translate(p.center.x, p.center.y);
    rotate(time * p.rotationSpeed + p.phase);
    
    // Create richly colored polygonal spiral
    fill(p.color);
    noStroke();
    beginShape();
    
    for (let j = 0; j < p.arms * p.detail; j++) {
      const angle = TWO_PI / (p.arms * p.detail) * j;
      
      // Mathematical spiral formula with added complexity
      const r = p.radius * (1 + 0.3 * sin(angle * p.arms * p.complexity));
      
      // Add some variation to make it more organic
      const variation = 0.2 * sin(time * 0.02 + j * 0.1);
      const finalR = r * (1 + variation);
      
      const x = cos(angle) * finalR;
      const y = sin(angle) * finalR;
      vertex(x, y);
    }
    
    endShape(CLOSE);
    pop();
  }
  
  // Add geometric interlocking elements
  for (let i = 0; i < 150; i++) {
    const x = (frameCount * 0.02 + i * 47) % width;
    const y = (frameCount * 0.015 + i * 73) % height;
    
    push();
    translate(x, y);
    rotate(frameCount * 0.002 + i * 0.12);
    
    // Use a different color from palette
    const c = colorPalette[i % colorPalette.length];
    fill(red(c), green(c), blue(c), 30);
    noStroke();
    beginShape();
    
    // Create interlocking polygonal shapes
    for (let j = 0; j < 8; j++) {
      const angle = TWO_PI / 8 * j;
      const size = abs(sin(frameCount * 0.01 + i)) * 5 + 3;
      const x = cos(angle) * size;
      const y = sin(angle) * size;
      vertex(x, y);
    }
    
    endShape(CLOSE);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
