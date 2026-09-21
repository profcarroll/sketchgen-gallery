let hexGrid = [];
let pulseParticles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  
  // Create hexagonal grid
  const hexSize = 60;
  const cols = ceil(width / (hexSize * 1.5)) + 2;
  const rows = ceil(height / (sqrt(3) * hexSize)) + 2;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * hexSize * 1.5 - width/2;
      const y = row * sqrt(3) * hexSize - height/2;
      // Offset every other row
      const offset = (row % 2) * (hexSize * 0.75);
      hexGrid.push({
        x: x + offset,
        y: y,
        z: 0,
        size: hexSize,
        life: 1,
        originalSize: hexSize
      });
    }
  }
}

function draw() {
  background(0);
  
  time += 0.02;
  
  // Update and draw hexagons
  for (let i = 0; i < hexGrid.length; i++) {
    const hex = hexGrid[i];
    
    // Apply stress effect - weaken from edges inward
    const distFromCenter = dist(hex.x, hex.y, 0, 0);
    const maxDist = dist(0, 0, width/2, height/2);
    const edgeFactor = map(distFromCenter, 0, maxDist, 0.3, 1);
    
    // Random life based on distance from center and time
    hex.life = constrain(1 - (time * 0.5) * edgeFactor, 0, 1);
    
    if (hex.life > 0) {
      push();
      translate(hex.x, hex.y, hex.z);
      
      // Apply warping effect
      const warp = sin(time + i * 0.1) * 0.3;
      const scale = hex.originalSize * (0.8 + warp * 0.2) * hex.life;
      
      // Glow effect based on life and time
      const glow = map(hex.life, 0, 1, 0, 255);
      const hue = (time * 10 + i * 2) % 360;
      
      fill(hue, 100, 80, glow * 0.7);
      
      // Draw hexagon
      beginShape();
      for (let j = 0; j < 6; j++) {
        const angle = TWO_PI * j / 6;
        const px = cos(angle) * scale;
        const py = sin(angle) * scale;
        vertex(px, py, 0);
      }
      endShape(CLOSE);
      
      pop();
    }
  }
  
  // Create electrical pulses
  if (frameCount % 5 === 0) {
    pulseParticles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: 0,
      life: 1,
      size: random(5, 20)
    });
  }
  
  // Update and draw pulse particles
  for (let i = pulseParticles.length - 1; i >= 0; i--) {
    const p = pulseParticles[i];
    
    p.life -= 0.02;
    p.size *= 0.98;
    
    if (p.life <= 0) {
      pulseParticles.splice(i, 1);
      continue;
    }
    
    push();
    translate(p.x, p.y, p.z);
    
    // Pulse glow effect
    const alpha = map(p.life, 0, 1, 0, 200);
    fill(255, 255, 0, alpha);
    noStroke();
    
    sphere(p.size);
    
    pop();
  }
  
  // Create stress waves that erode lattice
  if (frameCount % 10 === 0) {
    for (let i = 0; i < hexGrid.length; i++) {
      const hex = hexGrid[i];
      
      // Random chance to create a pulse at each hexagon
      if (random() < 0.05 * hex.life) {
        pulseParticles.push({
          x: hex.x,
          y: hex.y,
          z: 0,
          life: 1,
          size: random(3, 10)
        });
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
