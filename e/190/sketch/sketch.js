let circles = [];
let stars = [];
let rippleCount = 0;
const maxRipples = 50;
let ripples = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create background circles
  for (let i = 0; i < 200; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(50, 300),
      speed: random(0.001, 0.005),
      hue: random(180, 240),
      alpha: random(0.02, 0.08)
    });
  }
  
  // Create stars
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      hue: random(200, 260),
      trail: [],
      maxTrailLength: 20
    });
  }
  
  // Initialize ripples
  for (let i = 0; i < maxRipples; i++) {
    ripples.push({
      x: 0,
      y: 0,
      size: 0,
      alpha: 0,
      maxAlpha: random(0.3, 0.6),
      growth: random(0.5, 2),
      decay: random(0.005, 0.01)
    });
  }
}

function draw() {
  background(220, 10, 5);
  
  // Update and display circles
  for (let circle of circles) {
    circle.x += sin(frameCount * circle.speed) * 0.5;
    circle.y += cos(frameCount * circle.speed) * 0.5;
    
    noFill();
    stroke(circle.hue, 30, 90, circle.alpha);
    ellipse(circle.x, circle.y, circle.size);
  }
  
  // Update and display stars
  for (let star of stars) {
    // Move star
    star.x += star.speedX;
    star.y += star.speedY;
    
    // Wrap around edges
    if (star.x < -10) star.x = width + 10;
    if (star.x > width + 10) star.x = -10;
    if (star.y < -10) star.y = height + 10;
    if (star.y > height + 10) star.y = -10;
    
    // Add to trail
    star.trail.push({x: star.x, y: star.y});
    if (star.trail.length > star.maxTrailLength) {
      star.trail.shift();
    }
    
    // Draw trail
    noFill();
    stroke(star.hue, 80, 90, 0.5);
    beginShape();
    for (let point of star.trail) {
      vertex(point.x, point.y);
    }
    endShape();
    
    // Draw star
    fill(star.hue, 80, 90);
    noStroke();
    ellipse(star.x, star.y, star.size);
  }
  
  // Create ripples occasionally
  if (frameCount % 100 === 0 && rippleCount < maxRipples) {
    let ripple = ripples[rippleCount];
    ripple.x = random(width);
    ripple.y = random(height);
    ripple.size = 0;
    ripple.alpha = ripple.maxAlpha;
    rippleCount++;
  }
  
  // Update and display ripples
  for (let i = 0; i < rippleCount; i++) {
    let ripple = ripples[i];
    ripple.size += ripple.growth;
    ripple.alpha -= ripple.decay;
    
    if (ripple.alpha <= 0) {
      // Reset ripple
      ripple.x = random(width);
      ripple.y = random(height);
      ripple.size = 0;
      ripple.alpha = ripple.maxAlpha;
    }
    
    noFill();
    stroke(200, 30, 90, ripple.alpha * 0.5);
    ellipse(ripple.x, ripple.y, ripple.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
