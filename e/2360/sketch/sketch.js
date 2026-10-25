let patterns = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  
  // Create mathematically precise spirographic patterns
  for (let i = 0; i < 80; i++) {
    patterns.push({
      center: { x: random(width), y: random(height) },
      radius: random(30, 120),
      speed: random(0.001, 0.008),
      phase: random(TWO_PI),
      arms: floor(random(3, 10)),
      rotationSpeed: random(-0.005, 0.005),
      color: color(
        random(80, 220), 
        random(60, 150), 
        random(20, 100), 
        random(180, 220)
      ),
      detail: floor(random(8, 20))
    });
  }
}

function draw() {
  background(15, 25, 45);
  
  // Draw precise mathematical patterns
  for (let i = 0; i < patterns.length; i++) {
    const p = patterns[i];
    const time = frameCount * p.speed;
    
    push();
    translate(p.center.x, p.center.y);
    rotate(time * p.rotationSpeed + p.phase);
    
    // Create polygonal spirograph pattern with mathematical precision
    fill(p.color);
    noStroke();
    beginShape();
    for (let j = 0; j < p.arms * p.detail; j++) {
      const angle = TWO_PI / (p.arms * p.detail) * j;
      // Mathematical spirograph formula
      const r = p.radius * (1 + 0.5 * sin(angle * p.arms));
      const x = cos(angle) * r;
      const y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Add interlocking geometric elements
  for (let i = 0; i < 200; i++) {
    const x = (frameCount * 0.03 + i * 37) % width;
    const y = (frameCount * 0.02 + i * 61) % height;
    
    push();
    translate(x, y);
    rotate(frameCount * 0.003 + i * 0.15);
    
    fill(255, 8);
    noStroke();
    beginShape();
    for (let j = 0; j < 6; j++) {
      const angle = TWO_PI / 6 * j;
      const size = abs(sin(frameCount * 0.01 + i)) * 3 + 2;
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
