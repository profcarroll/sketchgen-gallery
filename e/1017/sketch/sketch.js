let hexagons = [];
const hexRadius = 60;
const gridSpacing = hexRadius * 1.75;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize the hexagonal grid
  for (let y = -hexRadius; y < height + hexRadius; y += gridSpacing) {
    for (let x = -hexRadius; x < width + hexRadius; x += gridSpacing * 1.5) {
      // Offset every other row
      if ((y / gridSpacing) % 2 === 0) {
        x += gridSpacing * 0.75;
      }
      hexagons.push({
        x: x,
        y: y,
        baseRadius: hexRadius,
        pulse: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(220, 10, 5);
  time += 0.02;
  
  for (let hex of hexagons) {
    // Pulsing effect
    const pulse = sin(time + hex.pulse) * 0.3 + 0.7;
    const radius = hex.baseRadius * pulse;
    
    // Color based on position and time
    const hue = (frameCount * 0.5 + hex.x * 0.01 + hex.y * 0.01) % 360;
    fill(hue, 80, 90, 0.7);
    
    // Draw hexagon
    push();
    translate(hex.x, hex.y);
    drawHexagon(radius);
    pop();
    
    // Glowing boundary effect
    stroke(hue, 100, 100, 0.5);
    strokeWeight(2 + sin(time + hex.pulse) * 0.5);
    noFill();
    push();
    translate(hex.x, hex.y);
    drawHexagon(radius * 1.05);
    pop();
  }
}

function drawHexagon(radius) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    const angle = TWO_PI / 6 * i;
    const x = cos(angle) * radius;
    const y = sin(angle) * radius;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
