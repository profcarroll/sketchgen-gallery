let circles = [];
const CIRCLE_COUNT = 500;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  for (let i = 0; i < CIRCLE_COUNT; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      hue: random(180, 260),
      saturation: random(40, 70),
      brightness: random(60, 90),
      alpha: random(30, 80),
      speedX: random(-0.1, 0.1),
      speedY: random(-0.1, 0.1),
      phaseX: random(TWO_PI),
      phaseY: random(TWO_PI),
      trail: [],
      maxTrailLength: 15,
      life: random(3000, 8000),
      age: 0
    });
  }
}

function draw() {
  // Semi-transparent background to create fading trails
  background(10, 15, 25, 15);
  
  time += 0.002;
  
  for (let circle of circles) {
    // Update position with slow drift
    circle.x += circle.speedX + sin(time * 0.3 + circle.phaseX) * 0.1;
    circle.y += circle.speedY + cos(time * 0.3 + circle.phaseY) * 0.1;
    
    // Wrap around edges
    if (circle.x < -50) circle.x = width + 50;
    if (circle.x > width + 50) circle.x = -50;
    if (circle.y < -50) circle.y = height + 50;
    if (circle.y > height + 50) circle.y = -50;
    
    // Age the circle
    circle.age++;
    
    // Add to trail
    circle.trail.push({x: circle.x, y: circle.y});
    if (circle.trail.length > circle.maxTrailLength) {
      circle.trail.shift();
    }
    
    // Fade out as it ages
    let alpha = map(circle.age, 0, circle.life, circle.alpha, 0);
    
    // Reset if too old
    if (circle.age > circle.life) {
      circle.x = random(width);
      circle.y = random(height);
      circle.age = 0;
      circle.trail = [];
      circle.phaseX = random(TWO_PI);
      circle.phaseY = random(TWO_PI);
    }
    
    // Draw the trail
    if (circle.trail.length > 1) {
      beginShape(LINES);
      for (let i = 0; i < circle.trail.length - 1; i++) {
        let pointA = circle.trail[i];
        let pointB = circle.trail[i + 1];
        let trailAlpha = map(i, 0, circle.trail.length - 1, alpha * 0.3, alpha);
        
        stroke(circle.hue, circle.saturation, circle.brightness, trailAlpha);
        vertex(pointA.x, pointA.y);
        vertex(pointB.x, pointB.y);
      }
      endShape();
    }
    
    // Draw the main circle
    fill(circle.hue, circle.saturation, circle.brightness, alpha);
    ellipse(circle.x, circle.y, circle.size);
    
    // Occasionally create sparkles from the trail
    if (circle.age % 50 === 0 && circle.trail.length > 1) {
      let lastPoint = circle.trail[circle.trail.length - 1];
      for (let i = 0; i < 3; i++) {
        let sparkleX = lastPoint.x + random(-20, 20);
        let sparkleY = lastPoint.y + random(-20, 20);
        let sparkleSize = random(1, 3);
        let sparkleAlpha = random(100, 200);
        
        fill(circle.hue + random(-20, 20), circle.saturation, circle.brightness, sparkleAlpha);
        ellipse(sparkleX, sparkleY, sparkleSize);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
