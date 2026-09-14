let hexagons = [];
let rotationSpeed = 0.005;
let flowField;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a grid of hexagons
  let hexSize = 60;
  for (let y = -hexSize; y < height + hexSize; y += hexSize * 1.75) {
    for (let x = -hexSize; x < width + hexSize; x += hexSize * 2.5) {
      // Offset every other row
      if ((y / (hexSize * 1.75)) % 2 === 0) {
        x += hexSize;
      }
      hexagons.push({
        x: x,
        y: y,
        size: hexSize,
        rotation: random(TWO_PI),
        hue: random(360)
      });
    }
  }

  // Initialize flow field for directional movement
  flowField = new Array(width * height).fill(0);
  for (let i = 0; i < flowField.length; i++) {
    flowField[i] = random(TWO_PI);
  }
}

function draw() {
  background(25, 10, 10); // Dark red background

  // Update and display hexagons
  for (let hex of hexagons) {
    // Apply flow field effect to rotation
    let flowAngle = flowField[int(hex.x / 10) + int(hex.y / 10) * width];
    hex.rotation += rotationSpeed * sin(frameCount * 0.01 + flowAngle);
    
    // Draw the hexagon with a vibrant color from the 80s palette
    push();
    translate(hex.x, hex.y);
    rotate(hex.rotation);
    fill(hex.hue, 90, 90, 0.9);
    stroke(0, 0, 100, 0.5);
    strokeWeight(1);
    
    // Draw hexagon
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x = hex.size * cos(angle);
      let y = hex.size * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }

  // Animate the flow field slightly
  for (let i = 0; i < flowField.length; i++) {
    flowField[i] += 0.001;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
