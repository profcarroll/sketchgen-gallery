let patterns = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  
  // Create a dense array of interlocking polygonal patterns
  for (let i = 0; i < 200; i++) {
    patterns.push({
      centerX: random(width),
      centerY: random(height),
      size: random(15, 60),
      sides: floor(random(3, 9)),
      rotationSpeed: random(-0.005, 0.005),
      phase: random(TWO_PI),
      color: i % 2 === 0 ? [20, 40, 120] : [30, 200, 80], // sapphire blue or emerald green
      alpha: random(180, 255)
    });
  }
}

function draw() {
  background(10, 15, 40);
  
  // Draw interlocking filled polygons in a hypnotic pattern
  for (let i = 0; i < patterns.length; i++) {
    const p = patterns[i];
    const time = frameCount * p.rotationSpeed + p.phase;
    
    push();
    translate(p.centerX, p.centerY);
    rotate(time);
    
    fill(p.color[0], p.color[1], p.color[2], p.alpha);
    noStroke();
    
    beginShape();
    for (let j = 0; j < p.sides; j++) {
      const angle = TWO_PI / p.sides * j;
      const x = cos(angle) * p.size;
      const y = sin(angle) * p.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Add interlocking geometric elements to create a stained-glass effect
  for (let i = 0; i < patterns.length; i += 4) {
    const p1 = patterns[i];
    const p2 = patterns[(i + 1) % patterns.length];
    const p3 = patterns[(i + 2) % patterns.length];
    const p4 = patterns[(i + 3) % patterns.length];
    
    const time = frameCount * 0.001;
    
    // Create a fourth polygon that interlocks with the first three
    push();
    translate((p1.centerX + p2.centerX + p3.centerX + p4.centerX) / 4, 
              (p1.centerY + p2.centerY + p3.centerY + p4.centerY) / 4);
    rotate(time);
    
    fill(30, 200, 80, 120); // Emerald green with transparency
    noStroke();
    
    beginShape();
    for (let j = 0; j < 6; j++) {
      const angle = TWO_PI / 6 * j;
      const x = cos(angle) * (p1.size + p2.size + p3.size + p4.size) / 20;
      const y = sin(angle) * (p1.size + p2.size + p3.size + p4.size) / 20;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
