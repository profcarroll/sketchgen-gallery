let hexagons = [];
let gridSize = 20;
let hueOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Initialize grid of hexagonal modules
  for (let y = 0; y < height; y += gridSize * 1.5) {
    for (let x = 0; x < width; x += gridSize * 1.75) {
      // Offset every other row for hexagonal grid
      let offsetX = (y / (gridSize * 1.5)) % 2 === 0 ? 0 : gridSize * 0.875;
      hexagons.push({
        x: x + offsetX,
        y: y,
        radius: gridSize * 0.4,
        active: random() > 0.7,
        pulsePhase: random(TWO_PI),
        hue: random(180, 240)
      });
    }
  }
}

function draw() {
  background(0);
  
  // Update hue offset for electric blue cycling
  hueOffset = (hueOffset + 0.3) % 360;
  
  // Draw hexagonal grid with glowing effect
  for (let hex of hexagons) {
    if (hex.active) {
      // Use dynamic hue for neon glow effect in electric blue range
      let hue = (hueOffset + frameCount * 1.5) % 360;
      // Keep within electric blue range (180-240 degrees)
      hue = map(hue, 0, 360, 180, 240);
      
      // Draw hexagon with glow
      push();
      translate(hex.x, hex.y);
      
      // Inner core
      fill(hue, 255, 255, 200);
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI * i / 6;
        let x = cos(angle) * hex.radius * 0.7;
        let y = sin(angle) * hex.radius * 0.7;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      // Outer glow
      fill(hue, 255, 255, 60);
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI * i / 6;
        let x = cos(angle) * hex.radius * 1.2;
        let y = sin(angle) * hex.radius * 1.2;
        vertex(x, y);
      }
      endShape(CLOSE);
      
      pop();
      
      // Add radial pulses from active hexagons
      hex.pulsePhase += 0.1;
      let pulseRadius = (hex.pulsePhase % TWO_PI) * 30;
      let alpha = map(pulseRadius, 0, 60, 150, 0);
      
      if (pulseRadius > 0) {
        let pulseHue = (hueOffset + frameCount * 3 + random(60)) % 360;
        pulseHue = map(pulseHue, 0, 360, 180, 240);
        
        push();
        translate(hex.x, hex.y);
        
        noStroke();
        fill(pulseHue, 255, 255, alpha);
        
        // Draw radial pulses
        for (let i = 0; i < 8; i++) {
          let angle = TWO_PI * i / 8;
          let x1 = cos(angle) * pulseRadius * 0.3;
          let y1 = sin(angle) * pulseRadius * 0.3;
          let x2 = cos(angle) * pulseRadius;
          let y2 = sin(angle) * pulseRadius;
          
          line(x1, y1, x2, y2);
        }
        
        pop();
      }
    }
  }
  
  // Randomly activate/deactivate hexagons
  if (random() > 0.995) {
    let idx = int(random(hexagons.length));
    hexagons[idx].active = !hexagons[idx].active;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
