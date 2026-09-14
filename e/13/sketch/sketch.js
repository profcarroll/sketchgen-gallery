let hexagons = [];
let time = 0;
let colors = [
  [255, 50, 255], // magenta
  [50, 255, 255], // cyan
  [255, 255, 50], // yellow
  [50, 255, 50],  // green
  [255, 100, 50]  // orange
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize hexagons in a grid
  let hexRadius = 60;
  let hexWidth = hexRadius * 2;
  let hexHeight = sqrt(3) * hexRadius;
  
  for (let y = -hexHeight; y < height + hexHeight; y += hexHeight) {
    for (let x = -hexWidth; x < width + hexWidth; x += hexWidth * 1.5) {
      // Offset every other row
      if ((y / hexHeight) % 2 === 0) {
        x += hexWidth * 0.75;
      }
      
      hexagons.push({
        x: x,
        y: y,
        radius: hexRadius,
        color: random(colors),
        angle: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(10, 10, 30);
  
  time += 0.01;
  
  for (let hex of hexagons) {
    // Animate each hexagon's position and rotation
    let offsetX = sin(time + hex.angle) * 15;
    let offsetY = cos(time + hex.angle) * 15;
    let rot = sin(time * 0.7 + hex.angle) * 0.2;
    
    // Apply transformation
    push();
    translate(hex.x + offsetX, hex.y + offsetY);
    rotate(rot);
    
    // Draw the hexagon with dynamic color
    let hue = (time * 20 + hex.color[0]) % 360;
    fill(hue, 100, 90, 200);
    
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x = hex.radius * cos(angle);
      let y = hex.radius * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
