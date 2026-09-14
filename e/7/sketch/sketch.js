function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  noStroke();
}

function draw() {
  background(0, 0, 0, 10); // semi-transparent black for trail effect

  const time = millis() * 0.0005; // slow time multiplier
  const centerX = width / 2;
  const centerY = height / 2;

  // Draw multiple concentric rings with pulsing and color variation
  for (let i = 0; i < 10; i++) {
    const radius = 50 + i * 40 + sin(time + i * 0.3) * 20;
    const hue = (frameCount * 0.5 + i * 20) % 255;
    const saturation = 200 + sin(time * 0.7 + i) * 50;
    const alpha = 100 + sin(time * 0.5 + i) * 50;

    fill(hue, saturation, 255, alpha);
    ellipse(centerX, centerY, radius * 2, radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
