function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(220, 50, 10);

  let time = millis() * 0.0005;

  // Draw tessellated hexagons with dynamic transparency
  let hexSize = 60;
  let spacing = hexSize * 1.732; // sqrt(3) for tight hex packing

  for (let y = -hexSize; y < height + hexSize; y += spacing) {
    for (let x = -hexSize; x < width + hexSize; x += spacing) {
      // Offset every other row
      let offsetX = ((y / spacing) % 2 === 0) ? spacing / 2 : 0;

      let px = x + offsetX;
      let py = y;

      // Create a dynamic hue based on position and time
      let hue = (frameCount * 0.5 + (px + py) * 0.01) % 360;

      // Create a pulsing transparency effect
      let alpha = map(sin(time * 2 + px * 0.01 + py * 0.01), -1, 1, 0.3, 0.8);

      push();
      translate(px, py);
      rotate(time * 0.2 + (px + py) * 0.005);

      // Draw hexagon with dynamic fill
      fill(hue, 80, 90, alpha);
      noStroke();

      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i;
        let vx = cos(angle) * hexSize;
        let vy = sin(angle) * hexSize;
        vertex(vx, vy);
      }
      endShape(CLOSE);

      // Draw inner hexagon for a more intricate look
      fill(hue, 80, 50, alpha * 0.5);
      beginShape();
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i;
        let vx = cos(angle) * hexSize * 0.6;
        let vy = sin(angle) * hexSize * 0.6;
        vertex(vx, vy);
      }
      endShape(CLOSE);

      pop();
    }
  }

  // Add a subtle wave effect to the whole pattern
  blendMode(DIFFERENCE);
  fill(255, 10);
  noStroke();
  rect(0, 0, width, height);
  blendMode(BLEND);
}
