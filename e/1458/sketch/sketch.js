let circles = [];
let stars = [];
let trails = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create floating circles
  for (let i = 0; i < 150; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      hue: random(360)
    });
  }
  
  // Create stars
  for (let i = 0; i < 20; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speedX: random(-1, 1),
      speedY: random(-1, 1),
      hue: random(360),
      trail: []
    });
  }
}

function draw() {
  background(220, 5, 5, 0.02); // Very light fade for trails
  
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
    fill(circle.hue, 50, 90, 0.05);
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
        ellipse(interX, interY, 10);
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
    if (star.trail.length > 20) {
      star.trail.shift();
    }
    
    // Draw trail
    noFill();
    stroke(star.hue, 80, 100, 0.3);
    strokeWeight(1);
    beginShape();
    for (let point of star.trail) {
      vertex(point.x, point.y);
    }
    endShape();
    
    // Draw star
    noStroke();
    fill(star.hue, 80, 100, 0.8);
    ellipse(star.x, star.y, star.size);
    
    // Luminous flare effect
    let flareSize = map(noise(frameCount * 0.01 + star.x * 0.01), 0, 1, 5, 15);
    fill(star.hue, 80, 100, 0.2);
    ellipse(star.x, star.y, flareSize);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
