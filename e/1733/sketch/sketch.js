let circles = [];
let time = 0;
let stars = [];

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
      pulsePhase: random(TWO_PI),
      trail: []
    });
  }
  
  // Create stars
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      brightness: random(150, 255),
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 10, 20, 30); // Semi-transparent background for trail effect

  time += 0.01;

  // Draw stars
  for (let star of stars) {
    let pulse = sin(time * star.pulseSpeed + star.pulsePhase) * 0.5 + 0.5;
    let currentBrightness = star.brightness * pulse;
    fill(255, 255, 255, currentBrightness);
    ellipse(star.x, star.y, star.size);
  }

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

    // Add current position to trail
    circle.trail.push({x: circle.x, y: circle.y, alpha: 255});
    
    // Limit trail length
    if (circle.trail.length > 20) {
      circle.trail.shift();
    }

    // Create internal fluctuation in luminosity and opacity
    let pulse = sin(time * circle.pulseSpeed + circle.pulsePhase) * 0.5 + 0.5;
    let currentAlpha = circle.alpha * pulse;
    let currentHue = (circle.hue + time * 0.5) % 255;

    // Draw trail
    for (let i = 0; i < circle.trail.length; i++) {
      let point = circle.trail[i];
      let trailAlpha = map(i, 0, circle.trail.length, 0, currentAlpha);
      fill(currentHue, 70, 90, trailAlpha);
      ellipse(point.x, point.y, circle.radius * (i / circle.trail.length) * 0.5);
    }

    // Draw main circle
    fill(currentHue, 70, 90, currentAlpha);
    ellipse(circle.x, circle.y, circle.radius * 2);
    
    // Occasionally create sparkles from trail
    if (frameCount % 10 === 0 && circle.trail.length > 5) {
      let lastPoint = circle.trail[circle.trail.length - 1];
      for (let i = 0; i < 3; i++) {
        fill(currentHue, 80, 95, 100);
        ellipse(
          lastPoint.x + random(-20, 20),
          lastPoint.y + random(-20, 20),
          random(1, 3)
        );
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
