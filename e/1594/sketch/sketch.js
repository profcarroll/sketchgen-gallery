let circles = [];
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create floating circles
  for (let i = 0; i < 100; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(30, 100),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.2, 0.2),
      hue: random(360),
      alpha: random(0.03, 0.07)
    });
  }
  
  // Create stars
  for (let i = 0; i < 50; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      hue: random(360),
      trail: [],
      trailLength: random(15, 30)
    });
  }
}

function draw() {
  // Very light fade for trails and background
  background(220, 5, 5, 0.02);
  
  // Update and display circles
  for (let circle of circles) {
    circle.x += circle.speedX;
    circle.y += circle.speedY;
    
    // Wrap around screen
    if (circle.x < -circle.size) circle.x = width + circle.size;
    if (circle.x > width + circle.size) circle.x = -circle.size;
    if (circle.y < -circle.size) circle.y = height + circle.size;
    if (circle.y > height + circle.size) circle.y = -circle.size;
    
    // Draw translucent circle
    noStroke();
    fill(circle.hue, 50, 90, circle.alpha);
    ellipse(circle.x, circle.y, circle.size);
    
    // Check for intersections with other circles
    for (let other of circles) {
      if (circle === other) continue;
      
      let d = dist(circle.x, circle.y, other.x, other.y);
      let sumR = circle.size/2 + other.size/2;
      
      if (d < sumR) {
        // Intersection point
        let angle = atan2(other.y - circle.y, other.x - circle.x);
        let interX = circle.x + cos(angle) * (sumR - d)/2;
        let interY = circle.y + sin(angle) * (sumR - d)/2;
        
        // Intensified glow at intersection
        fill(circle.hue, 80, 100, 0.3);
        ellipse(interX, interY, 15);
      }
    }
  }
  
  // Update and display stars
  for (let star of stars) {
    star.x += star.speedX;
    star.y += star.speedY;
    
    // Wrap around screen
    if (star.x < 0) star.x = width;
    if (star.x > width) star.x = 0;
    if (star.y < 0) star.y = height;
    if (star.y > height) star.y = 0;
    
    // Add to trail
    star.trail.push({x: star.x, y: star.y});
    if (star.trail.length > star.trailLength) {
      star.trail.shift();
    }
    
    // Draw trail as arc
    noFill();
    stroke(star.hue, 80, 100, 0.4);
    strokeWeight(0.5);
    beginShape();
    for (let i = 0; i < star.trail.length; i++) {
      let point = star.trail[i];
      curveVertex(point.x, point.y);
    }
    endShape();
    
    // Draw star
    noStroke();
    fill(star.hue, 80, 100, 0.9);
    ellipse(star.x, star.y, star.size);
    
    // Luminous flare effect
    let flareSize = map(noise(frameCount * 0.02 + star.x * 0.01), 0, 1, 3, 10);
    fill(star.hue, 80, 100, 0.2);
    ellipse(star.x, star.y, flareSize);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
