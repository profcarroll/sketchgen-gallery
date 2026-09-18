function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 1);
  noStroke();
}

function draw() {
  background(0, 0, 0, 0.05); // Semi-transparent black for trail effect

  const time = millis() * 0.001;
  const center = createVector(width / 2, height / 2);
  const maxRadius = min(width, height) * 0.4;

  // Draw nested arcs
  for (let i = 0; i < 20; i++) {
    const radius = maxRadius * (i / 20);
    const hue = (time + i * 0.1) % 1;
    const arcSize = map(sin(time * 0.5 + i), -1, 1, 0.1, 0.8);

    fill(hue, 0.8, 1, 0.7);
    beginShape();
    for (let a = 0; a < TWO_PI * arcSize; a += 0.05) {
      const x = center.x + cos(a) * radius;
      const y = center.y + sin(a) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  // Add pulsating core
  const pulse = map(sin(time * 2), -1, 1, 0.5, 1);
  fill(1, 0.8, 1, 0.5);
  ellipse(center.x, center.y, 30 * pulse, 30 * pulse);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
