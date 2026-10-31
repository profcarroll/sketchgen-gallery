let patterns = [];
let colorPalette = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(RADIANS);
  
  // Create a rich bioluminescent color palette
  for (let i = 0; i < 20; i++) {
    colorPalette.push(color(
      random(0, 50),
      random(100, 200),
      random(150, 255),
      random(180, 255)
    ));
  }
  
  // Generate complex interlocking spiral patterns
  for (let i = 0; i < 40; i++) {
    patterns.push({
      center: { x: random(-width/2, width/2), y: random(-height/2, height/2) },
      radius: random(30, 150),
      speed: random(0.002, 0.012),
      phase: random(TWO_PI),
      arms: floor(random(3, 8)),
      rotationSpeed: random(-0.005, 0.005),
      color: random(colorPalette),
      detail: floor(random(10, 25)),
      complexity: random(0.5, 1.5)
    });
  }
}

function draw() {
  background(5, 10, 25);
  
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
      const r = p.radius * (1 + 0.2 * sin(angle * p.arms * p.complexity));
      
      // Add some variation to make it more organic
      const variation = 0.15 * sin(time * 0.03 + j * 0.1);
      const finalR = r * (1 + variation);
      
      const x = cos(angle) * finalR;
      const y = sin(angle) * finalR;
      vertex(x, y);
    }
    
    endShape(CLOSE);
    pop();
  }
  
  // Add glowing geometric interlocking elements
  for (let i = 0; i < 200; i++) {
    const x = (frameCount * 0.015 + i * 47) % width - width/2;
    const y = (frameCount * 0.01 + i * 73) % height - height/2;
    
    push();
    translate(x, y);
    rotate(frameCount * 0.0015 + i * 0.12);
    
    // Use a different color from palette
    const c = colorPalette[i % colorPalette.length];
    fill(red(c), green(c), blue(c), 40);
    noStroke();
    beginShape();
    
    // Create interlocking polygonal shapes
    for (let j = 0; j < 6; j++) {
      const angle = TWO_PI / 6 * j;
      const size = abs(sin(frameCount * 0.01 + i)) * 4 + 2;
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
