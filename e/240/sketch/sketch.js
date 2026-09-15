let circles = [];
let stars = [];
let trails = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize floating circles
  for (let i = 0; i < 20; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      radius: random(50, 200),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.2, 0.2),
      hue: random(360)
    });
  }
  
  // Initialize stars
  for (let i = 0; i < 500; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      speedX: random(-1, 1),
      speedY: random(-1, 1),
      size: random(0.5, 2),
      brightness: random(0.5, 1),
      trail: []
    });
  }
  
  // Initialize trails array
  for (let i = 0; i < 300; i++) {
    trails.push({
      x: random(width),
      y: random(height),
      radius: random(2, 8),
      alpha: random(0.1, 0.5),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.05); // Transparent background to create fading trails

  // Update and draw floating circles
  for (let circle of circles) {
    circle.x += circle.speedX;
    circle.y += circle.speedY;
    
    // Wrap around edges
    if (circle.x < -circle.radius) circle.x = width + circle.radius;
    if (circle.x > width + circle.radius) circle.x = -circle.radius;
    if (circle.y < -circle.radius) circle.y = height + circle.radius;
    if (circle.y > height + circle.radius) circle.y = -circle.radius;
    
    noFill();
    stroke(circle.hue, 30, 90, 0.1);
    ellipse(circle.x, circle.y, circle.radius * 2);
  }

  // Update and draw stars
  for (let star of stars) {
    star.x += star.speedX;
    star.y += star.speedY;

    // Wrap around edges
    if (star.x < 0) star.x = width;
    if (star.x > width) star.x = 0;
    if (star.y < 0) star.y = height;
    if (star.y > height) star.y = 0;

    // Add to trail
    star.trail.push({x: star.x, y: star.y});
    if (star.trail.length > 20) {
      star.trail.shift();
    }

    // Draw trail
    stroke(255, 255, 255, 0.1);
    noFill();
    beginShape();
    for (let point of star.trail) {
      vertex(point.x, point.y);
    }
    endShape();

    // Draw star
    fill(255, 255, 255, star.brightness);
    noStroke();
    ellipse(star.x, star.y, star.size);
  }

  // Update and draw trails
  for (let trail of trails) {
    trail.x += trail.speedX;
    trail.y += trail.speedY;
    
    // Wrap around edges
    if (trail.x < -trail.radius) trail.x = width + trail.radius;
    if (trail.x > width + trail.radius) trail.x = -trail.radius;
    if (trail.y < -trail.radius) trail.y = height + trail.radius;
    if (trail.y > height + trail.radius) trail.y = -trail.radius;

    // Draw trail
    noStroke();
    fill(255, 255, 255, trail.alpha);
    ellipse(trail.x, trail.y, trail.radius * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
