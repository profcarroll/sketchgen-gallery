let circles = [];
let stars = [];
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create floating circles with continuous motion and fluctuating properties
  for (let i = 0; i < 80; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      radius: random(40, 150),
      speedX: random(-0.05, 0.05),
      speedY: random(-0.05, 0.05),
      alpha: random(20, 60),
      hue: random(200, 260),
      pulseSpeed: random(0.005, 0.015),
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
      brightness: random(200, 255),
      pulseSpeed: random(0.01, 0.03),
      pulsePhase: random(TWO_PI),
      hue: random(360)
    });
  }
}

function draw() {
  // Semi-transparent background for trail effect
  background(10, 10, 25, 30);
  
  time += 0.003;

  // Draw stars with rainbow pulsation and shimmering trails
  for (let star of stars) {
    let pulse = sin(time * star.pulseSpeed + star.pulsePhase) * 0.5 + 0.5;
    let currentBrightness = star.brightness * pulse;
    fill(star.hue, 100, 90, currentBrightness);
    ellipse(star.x, star.y, star.size);
    
    // Update hue for rainbow effect
    star.hue = (star.hue + 0.3) % 360;
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
    let currentHue = (circle.hue + time * 0.2) % 360;

    // Draw trail
    for (let i = 0; i < circle.trail.length; i++) {
      let point = circle.trail[i];
      let trailAlpha = map(i, 0, circle.trail.length, 0, currentAlpha);
      fill(currentHue, 70, 90, trailAlpha * 0.5);
      ellipse(point.x, point.y, circle.radius * (i / circle.trail.length) * 0.3);
    }

    // Draw main circle
    fill(currentHue, 70, 90, currentAlpha * 0.7);
    ellipse(circle.x, circle.y, circle.radius * 1.2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
