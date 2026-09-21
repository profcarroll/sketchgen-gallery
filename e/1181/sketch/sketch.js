let hexagons = [];
let pulses = [];
let decayProgress = 0;
const hexRadius = 30;
const gridSpacing = hexRadius * 1.75;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create hexagonal grid
  for (let y = -height/2; y < height/2; y += gridSpacing) {
    for (let x = -width/2; x < width/2; x += gridSpacing * 1.5) {
      // Offset every other row
      if (Math.abs(y) % (gridSpacing * 2) > gridSpacing) {
        x += gridSpacing * 0.75;
      }
      
      const hex = new Hexagon(x, y);
      hexagons.push(hex);
    }
  }
  
  // Set up initial pulses
  for (let i = 0; i < 10; i++) {
    pulses.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      life: 1,
      maxLife: random(30, 60)
    });
  }
}

function draw() {
  background(0);
  
  // Update decay progress
  decayProgress += 0.002;
  
  // Draw and update hexagons
  for (let i = 0; i < hexagons.length; i++) {
    const hex = hexagons[i];
    
    // Decay effect - outer edges fade first
    const distToCenter = dist(hex.x, hex.y, width/2, height/2);
    const maxDist = dist(0, 0, width/2, height/2);
    const decayFactor = map(distToCenter, 0, maxDist, 0.3, 1);
    
    // Only draw if not decayed
    if (hex.life > 0) {
      hex.draw(decayFactor);
      
      // Randomly activate pulses
      if (random() < 0.02) {
        const pulse = {
          x: hex.x,
          y: hex.y,
          size: random(5, 15),
          life: 1,
          maxLife: random(30, 60)
        };
        pulses.push(pulse);
      }
    }
    
    // Gradually decay this hexagon
    if (decayProgress > 0.1 && random() < 0.001) {
      hex.life -= 0.005;
    }
  }
  
  // Update and draw pulses
  for (let i = pulses.length - 1; i >= 0; i--) {
    const p = pulses[i];
    
    p.life -= 1 / p.maxLife;
    p.size *= 1.03;
    
    if (p.life <= 0) {
      pulses.splice(i, 1);
      continue;
    }
    
    noStroke();
    fill(240, 100, 100, p.life * 0.8);
    ellipse(p.x, p.y, p.size);
    
    // Add glow effect
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(240, 100, 100, p.life * 0.8);
    ellipse(p.x, p.y, p.size);
    drawingContext.shadowBlur = 0;
  }
  
  // Add occasional new pulses
  if (random() < 0.05 && pulses.length < 30) {
    pulses.push({
      x: random(width),
      y: random(height),
      size: random(5, 20),
      life: 1,
      maxLife: random(30, 60)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Hexagon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 1;
    this.originalSize = hexRadius;
  }
  
  draw(decayFactor) {
    push();
    translate(this.x, this.y);
    
    // Draw hexagon with decay effect
    noFill();
    stroke(200, 50, 80, this.life * decayFactor * 0.7);
    strokeWeight(1 + this.life * 0.5);
    
    beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = TWO_PI / 6 * i;
      const px = cos(angle) * this.originalSize * this.life * decayFactor;
      const py = sin(angle) * this.originalSize * this.life * decayFactor;
      vertex(px, py);
    }
    endShape(CLOSE);
    
    pop();
  }
}
