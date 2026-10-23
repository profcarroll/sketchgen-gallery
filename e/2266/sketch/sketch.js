let crystals = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  
  // Initialize crystalline structures
  for (let i = 0; i < 20; i++) {
    crystals.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      rotation: random(TWO_PI),
      segments: floor(random(5, 12)),
      speed: random(0.005, 0.02)
    });
  }
}

function draw() {
  background(0, 0, 5, 1);
  
  time += 0.01;
  
  // Draw interlocking crystal bands
  for (let i = 0; i < crystals.length; i++) {
    let c = crystals[i];
    
    // Update rotation
    c.rotation += c.speed;
    
    // Draw multiple concentric bands
    let bandCount = 8;
    for (let b = 0; b < bandCount; b++) {
      let bandRadius = c.size * (b + 1) / bandCount;
      let alpha = map(b, 0, bandCount - 1, 0.1, 0.7);
      
      // Create energy gradient effect
      let hue = (time * 20 + b * 30 + c.x * 0.01 + c.y * 0.01) % 360;
      
      fill(hue, 80, 90, alpha);
      
      beginShape();
      for (let a = 0; a < TWO_PI; a += 0.1) {
        let angle = a + c.rotation;
        let r = bandRadius * (1 + sin(time * 3 + a * 5) * 0.2);
        let x = c.x + r * cos(angle);
        let y = c.y + r * sin(angle);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    // Draw connecting lines between crystals
    for (let j = i + 1; j < crystals.length; j++) {
      let other = crystals[j];
      let d = dist(c.x, c.y, other.x, other.y);
      
      if (d < c.size + other.size) {
        let lineAlpha = map(d, 0, c.size + other.size, 0.3, 0.05);
        
        stroke((time * 10 + i * 20 + j * 15) % 360, 80, 90, lineAlpha);
        strokeWeight(0.5);
        line(c.x, c.y, other.x, other.y);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
