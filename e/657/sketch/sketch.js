let hexagons = [];
const numHexagons = 150;
const hexRadius = 40;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize hexagons in a grid
  for (let i = 0; i < numHexagons; i++) {
    const x = random(width);
    const y = random(height);
    hexagons.push({
      x: x,
      y: y,
      angle: random(TWO_PI),
      speed: random(0.005, 0.02),
      hue: random(360)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  time += 0.01;
  
  // Draw all hexagons
  for (let i = 0; i < hexagons.length; i++) {
    const h = hexagons[i];
    
    // Update angle based on time and neighboring influence
    let totalAngle = h.angle;
    let neighborCount = 0;
    
    for (let j = 0; j < hexagons.length; j++) {
      if (i !== j) {
        const other = hexagons[j];
        const d = dist(h.x, h.y, other.x, other.y);
        if (d < hexRadius * 3) {
          totalAngle += map(d, 0, hexRadius * 3, 0.05, 0);
          neighborCount++;
        }
      }
    }
    
    // Apply influence and update
    h.angle = totalAngle / (neighborCount + 1);
    h.hue = (h.hue + 0.5) % 360;
    
    push();
    translate(h.x, h.y);
    rotate(h.angle + time * h.speed);
    
    // Draw hexagon with dynamic color
    fill(h.hue, 80, 90);
    noStroke();
    beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
      const sx = cos(a) * hexRadius;
      const sy = sin(a) * hexRadius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
    
    // Draw outline
    stroke(255, 30);
    noFill();
    beginShape();
    for (let a = 0; a < TWO_PI; a += TWO_PI / 6) {
      const sx = cos(a) * hexRadius;
      const sy = sin(a) * hexRadius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
