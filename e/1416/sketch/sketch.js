let circles = [];
let stars = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Create floating circles
  for (let i = 0; i < 200; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      radius: random(50, 200),
      speed: random(0.001, 0.005),
      alpha: random(30, 80),
      hue: random(200, 260)
    });
  }

  // Create pointillist stars
  for (let i = 0; i < 500; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      pulseSpeed: random(0.01, 0.03),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 10, 20);

  time += 0.01;

  // Draw floating circles
  for (let circle of circles) {
    circle.x += sin(time * circle.speed) * 0.5;
    circle.y += cos(time * circle.speed) * 0.5;

    // Keep circles on canvas
    if (circle.x < -circle.radius) circle.x = width + circle.radius;
    if (circle.x > width + circle.radius) circle.x = -circle.radius;
    if (circle.y < -circle.radius) circle.y = height + circle.radius;
    if (circle.y > height + circle.radius) circle.y = -circle.radius;

    fill(circle.hue, 70, 90, circle.alpha);
    ellipse(circle.x, circle.y, circle.radius * 2);
  }

  // Draw pulsing stars
  for (let star of stars) {
    let pulse = sin(time * star.pulseSpeed + star.pulsePhase) * 0.5 + 0.5;
    let size = star.size * pulse;

    fill(255, 255, 230, 200);
    ellipse(star.x, star.y, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
