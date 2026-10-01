let circles = [];
let time = 0;
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create floating circles with continuous motion and fluctuating properties
  for (let i = 0; i < 100; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      radius: random(30, 120),
      speedX: random(-0.1, 0.1),
      speedY: random(-0.1, 0.1),
      alpha: random(15, 40),
      hue: random(200, 260),
      pulseSpeed: random(0.01, 0.02),
      pulsePhase: random(TWO_PI),
      trail: []
    });
  }
  
  // Create stars
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 2.5),
      brightness: random(180, 255),
      pulseSpeed: random(0.02, 0.04),
      pulsePhase: random(TWO_PI),
      hue: random(360)
    });
  }
}

function draw() {
  background(10, 10, 25, 20); // Semi-transparent background for trail effect

  time += 0.005;

  // Draw stars with rainbow pulsation
  for (let star of stars) {
    let pulse = sin(time * star.pulseSpeed + star.pulsePhase) * 0.5 + 0.5;
    let currentBrightness = star.brightness * pulse;
    fill(star.hue, 100, 90, currentBrightness);
    ellipse(star.x, star.y, star.size);
    
    // Update hue for rainbow effect
    star.hue = (star.hue + 0.2) % 360;
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
    if (circle.trail.length > 15) {
      circle.trail.shift();
    }

    // Create internal fluctuation in luminosity and opacity
    let pulse = sin(time * circle.pulseSpeed + circle.pulsePhase) * 0.5 + 0.5;
    let currentAlpha = circle.alpha * pulse;
    let currentHue = (circle.hue + time * 0.3) % 360;

    // Draw trail
    for (let i = 0; i < circle.trail.length; i++) {
      let point = circle.trail[i];
      let trailAlpha = map(i, 0, circle.trail.length, 0, currentAlpha);
      fill(currentHue, 70, 90, trailAlpha);
      ellipse(point.x, point.y, circle.radius * (i / circle.trail.length) * 0.4);
    }

    // Draw main circle
    fill(currentHue, 70, 90, currentAlpha);
    ellipse(circle.x, circle.y, circle.radius * 1.5);
    
    // Occasionally create sparkles from trail
    if (frameCount % 15 === 0 && circle.trail.length > 5) {
      let lastPoint = circle.trail[circle.trail.length - 1];
      for (let i = 0; i < 2; i++) {
        fill(currentHue, 80, 95, 100);
        ellipse(
          lastPoint.x + random(-15, 15),
          lastPoint.y + random(-15, 15),
          random(0.5, 2)
        );
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
