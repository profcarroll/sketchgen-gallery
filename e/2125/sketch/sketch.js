let patterns = [];
const patternCount = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create static geometric patterns
  for (let i = 0; i < patternCount; i++) {
    patterns.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      rotation: random(TWO_PI),
      segments: floor(random(3, 8)),
      hue: random(360),
      saturation: random(30, 70),
      brightness: random(40, 80)
    });
  }
}

function draw() {
  background(220, 5, 5, 0.1);
  
  // Draw static patterns
  for (let i = 0; i < patterns.length; i++) {
    let p = patterns[i];
    
    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    
    // Draw geometric pattern
    noFill();
    strokeWeight(1.5);
    stroke(p.hue, p.saturation, p.brightness, 0.8);
    
    beginShape();
    for (let j = 0; j < p.segments; j++) {
      let angle = map(j, 0, p.segments, 0, TWO_PI);
      let x = cos(angle) * p.size;
      let y = sin(angle) * p.size;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add inner pattern
    strokeWeight(1);
    let innerSize = p.size * 0.6;
    beginShape();
    for (let j = 0; j < p.segments; j++) {
      let angle = map(j, 0, p.segments, 0, TWO_PI) + PI/p.segments;
      let x = cos(angle) * innerSize;
      let y = sin(angle) * innerSize;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Draw intersecting lines
  strokeWeight(0.5);
  for (let i = 0; i < 200; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = random(width);
    let y2 = random(height);
    
    // Make lines intersect at center
    let centerX = width/2;
    let centerY = height/2;
    
    stroke(random(360), 20, 80, 0.4);
    line(x1, y1, x2, y2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
