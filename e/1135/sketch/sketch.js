let hexagons = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create a grid of hexagons
  const size = 60;
  const cols = Math.ceil(width / (size * 1.5)) + 2;
  const rows = Math.ceil(height / (size * Math.sqrt(3))) + 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * size * 1.5;
      const y = row * size * Math.sqrt(3);
      // Offset every other row
      if (row % 2 === 1) {
        hexagons.push({
          x: x + size * 0.75,
          y: y,
          size: size,
          hue: 45 + (col + row) * 2, // Slight color variation
        });
      } else {
        hexagons.push({
          x: x,
          y: y,
          size: size,
          hue: 45 + (col + row) * 2,
        });
      }
    }
  }
}

function draw() {
  background(0);
  time += 0.02;

  for (let hex of hexagons) {
    // Color pulse effect
    const brightness = 100 * (0.5 + 0.5 * sin(time + hex.hue * 0.05));
    fill(hex.hue, 100, brightness);

    push();
    translate(hex.x, hex.y);
    rotate(time * 0.2); // Slow rotation for motion

    beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = TWO_PI / 6 * i;
      const x = hex.size * cos(angle);
      const y = hex.size * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
