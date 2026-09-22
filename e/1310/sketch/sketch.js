function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(250, 10, 20); // Deep purple background

  const time = millis() * 0.001;
  const numRings = 8;
  const baseRadius = min(width, height) * 0.3;

  for (let i = 0; i < numRings; i++) {
    const radius = baseRadius * (0.7 + 0.3 * sin(time * 0.5 + i * 0.5));
    const segments = 12 + i * 2;
    const angleStep = TWO_PI / segments;

    push();
    translate(width / 2, height / 2);

    for (let j = 0; j < segments; j++) {
      const angle = j * angleStep;
      const segmentSize = 0.8 + 0.2 * sin(time * 3 + i * 0.7 + j * 0.3);
      const rectWidth = radius * 0.1 * segmentSize;
      const rectHeight = radius * 0.05;

      rotate(angle);
      fill(240 + i * 10, 80, 60 + i * 5, 0.8);
      rect(-rectWidth / 2, -radius, rectWidth, rectHeight);
      rotate(-angle);
    }
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
