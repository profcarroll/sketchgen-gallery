let circles = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create floating circles with continuous motion and fluctuating properties
  for (let i = 0; i < 150; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      radius: random(30, 150),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.2, 0.2),
      alpha: random(20, 60),
      hue: random(200, 260),
      pulseSpeed: random(0.01, 0.03),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 10, 20);

  time += 0.01;

  // Draw floating and pulsing circles
  for (let circle of circles) {
    // Update position with steady tide-like motion
    circle.x += circle.speedX;
    circle.y += circle.speedY;

    // Keep circles on canvas by wrapping around edges
    if (circle.x < -circle.radius) circle.x = width + circle.radius;
    if (circle.x > width + circle.radius) circle.x = -circle.radius;
    if (circle.y < -circle.radius) circle.y = height + circle.radius;
    if (circle.y > height + circle.radius) circle.y = -circle.radius;

    // Create internal fluctuation in luminosity and opacity
    let pulse = sin(time * circle.pulseSpeed + circle.pulsePhase) * 0.5 + 0.5;
    let currentAlpha = circle.alpha * pulse;
    let currentHue = (circle.hue + time * 0.5) % 255;

    fill(currentHue, 70, 90, currentAlpha);
    ellipse(circle.x, circle.y, circle.radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
