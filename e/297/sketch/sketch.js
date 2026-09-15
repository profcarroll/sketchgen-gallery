let creatures = [];
let tails = [];
let bgBrightness = 10;
let bgTarget = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial creatures
  for (let i = 0; i < 20; i++) {
    creatures.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      speed: random(0.5, 2),
      hue: random(180, 240),
      alpha: random(0.7, 1),
      angle: random(TWO_PI),
      tail: []
    });
  }
}

function draw() {
  // Smoothly transition background brightness
  bgBrightness += (bgTarget - bgBrightness) * 0.02;
  
  // Dark background with subtle glow
  background(0, 0, bgBrightness);
  
  // Update and display creatures
  for (let i = 0; i < creatures.length; i++) {
    let c = creatures[i];
    
    // Move creature
    c.x += cos(c.angle) * c.speed;
    c.y += sin(c.angle) * c.speed;
    
    // Boundary check with wraparound
    if (c.x < -50) c.x = width + 50;
    if (c.x > width + 50) c.x = -50;
    if (c.y < -50) c.y = height + 50;
    if (c.y > height + 50) c.y = -50;
    
    // Occasionally change direction
    if (random() < 0.02) {
      c.angle += random(-0.5, 0.5);
    }
    
    // Add to tail
    c.tail.push({x: c.x, y: c.y});
    if (c.tail.length > 30) {
      c.tail.shift();
    }
    
    // Draw tail
    noFill();
    stroke(c.hue, 100, 100, 0.3);
    strokeWeight(2);
    beginShape();
    for (let j = 0; j < c.tail.length; j++) {
      let point = c.tail[j];
      curveVertex(point.x, point.y);
    }
    endShape();
    
    // Draw creature body
    noStroke();
    fill(c.hue, 100, 100, c.alpha);
    ellipse(c.x, c.y, c.size);
    
    // Add glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(c.hue, 100, 100, c.alpha * 0.8);
    ellipse(c.x, c.y, c.size);
    drawingContext.shadowBlur = 0;
  }
  
  // Occasionally change background darkness
  if (frameCount % 120 === 0) {
    bgTarget = random(5, 20);
  }
}
