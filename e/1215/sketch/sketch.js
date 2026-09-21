let hexagons = [];
let time = 0;
let decayProgress = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Generate hexagonal lattice
  let spacing = 80;
  let cols = Math.ceil(width / spacing) + 2;
  let rows = Math.ceil(height / spacing) + 2;
  
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let x = i * spacing - spacing/2;
      let y = j * spacing - spacing/2;
      // Offset every other row
      if (j % 2 === 1) x += spacing/2;
      
      hexagons.push({
        x: x,
        y: y,
        size: 30,
        originalSize: 30,
        decay: 0,
        isActive: true
      });
    }
  }
}

function draw() {
  background(15, 10, 10);
  
  time += 0.02;
  decayProgress = (sin(time * 0.5) + 1) / 2;
  
  // Draw hexagons with pulsing effect
  for (let h of hexagons) {
    if (!h.isActive) continue;
    
    let pulse = sin(time * 3 + h.x * 0.01 + h.y * 0.01) * 0.5 + 0.5;
    let glow = map(pulse, 0, 1, 20, 80);
    let size = h.size * (1 - h.decay) * (0.9 + pulse * 0.1);
    
    push();
    translate(h.x, h.y);
    
    // Create pulsing glow effect
    noStroke();
    fill(300, 90, glow, 0.8);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6;
      let px = cos(angle) * size * 1.2;
      let py = sin(angle) * size * 1.2;
      vertex(px, py);
    }
    endShape(CLOSE);
    
    // Draw hexagon
    stroke(300, 95, 90);
    strokeWeight(2);
    fill(240, 80, 20, 0.7);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI * i / 6;
      let px = cos(angle) * size;
      let py = sin(angle) * size;
      vertex(px, py);
    }
    endShape(CLOSE);
    
    pop();
    
    // Apply decay from edges inward
    let distToCenter = dist(h.x, h.y, width/2, height/2);
    let maxDist = dist(0, 0, width/2, height/2) * 1.5;
    let edgeDecay = map(distToCenter, 0, maxDist, 0, 1);
    
    // Decay effect
    h.decay = lerp(h.decay, edgeDecay * decayProgress, 0.005);
    
    if (h.decay > 0.98) {
      h.isActive = false;
    }
  }
  
  // Visualize decay progress
  noStroke();
  fill(300, 100, 20, 0.3);
  rect(0, 0, width * decayProgress, 10);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
