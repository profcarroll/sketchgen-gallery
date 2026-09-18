let hexagons = [];
const numHexagons = 150;
const baseSize = 60;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize hexagons with random positions and properties
  for (let i = 0; i < numHexagons; i++) {
    hexagons.push({
      x: random(width),
      y: random(height),
      size: baseSize + random(-10, 10),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.02, 0.02),
      color: color(random(360), 80, 90, 0.7),
      phase: random(TWO_PI),
      fractureTime: 0,
      isFractured: false
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  time += 0.01;
  
  // Draw connections between nearby hexagons
  for (let i = 0; i < hexagons.length; i++) {
    for (let j = i + 1; j < hexagons.length; j++) {
      let d = dist(hexagons[i].x, hexagons[i].y, hexagons[j].x, hexagons[j].y);
      if (d < baseSize * 3) {
        stroke(200, 50, 80, 0.1);
        line(hexagons[i].x, hexagons[i].y, hexagons[j].x, hexagons[j].y);
      }
    }
  }

  // Update and draw each hexagon
  for (let i = 0; i < hexagons.length; i++) {
    let h = hexagons[i];
    
    // Apply some subtle movement to each hexagon
    h.x += sin(time * 0.3 + h.phase) * 0.5;
    h.y += cos(time * 0.2 + h.phase) * 0.5;
    
    // Update rotation
    h.rotation += h.rotationSpeed;
    
    // Occasionally fracture a hexagon
    if (frameCount % 180 === 0 && !h.isFractured) {
      h.fractureTime = frameCount;
      h.isFractured = true;
    }
    
    // Reset fracture after some time
    if (h.isFractured && frameCount - h.fractureTime > 60) {
      h.isFractured = false;
    }
    
    push();
    translate(h.x, h.y);
    rotate(h.rotation);
    
    if (h.isFractured) {
      // Draw fractured hexagon
      fill(h.color);
      noStroke();
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i;
        let x = h.size * cos(angle);
        let y = h.size * sin(angle);
        // Add some displacement to break the symmetry
        x += random(-15, 15);
        y += random(-15, 15);
        vertex(x, y);
      }
      endShape(CLOSE);
    } else {
      // Draw normal hexagon
      stroke(h.color);
      strokeWeight(1);
      noFill();
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i;
        let x = h.size * cos(angle);
        let y = h.size * sin(angle);
        vertex(x, y);
      }
      endShape(CLOSE);
    }
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
