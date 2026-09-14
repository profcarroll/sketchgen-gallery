let circles = [];
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create many small stars
  for (let i = 0; i < 500; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      opacity: random(100, 255)
    });
  }
  
  // Create initial circles
  for (let i = 0; i < 30; i++) {
    circles.push({
      x: random(width),
      y: height + random(height),
      size: random(50, 200),
      speed: random(0.1, 0.5),
      opacity: random(30, 80)
    });
  }
}

function draw() {
  background(0);
  
  // Draw stars
  for (let star of stars) {
    fill(255, 255, 255, star.opacity);
    ellipse(star.x, star.y, star.size);
  }
  
  // Update and draw circles
  for (let i = circles.length - 1; i >= 0; i--) {
    let c = circles[i];
    
    // Move circle upward
    c.y -= c.speed;
    
    // Fade out as they rise
    c.opacity -= 0.05;
    
    // Remove old circles and add new ones
    if (c.opacity < 0 || c.y < -c.size) {
      circles.splice(i, 1);
      circles.push({
        x: random(width),
        y: height + random(50),
        size: random(50, 200),
        speed: random(0.1, 0.5),
        opacity: random(30, 80)
      });
    }
    
    // Draw circle with transparency
    fill(0, 100, 255, c.opacity);
    ellipse(c.x, c.y, c.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
