let circles = [];
let stars = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create tidal circles
  for (let i = 0; i < 150; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      radius: random(20, 100),
      speed: random(0.1, 0.3),
      alpha: random(20, 60),
      hue: random(200, 260)
    });
  }
  
  // Create stars
  for (let i = 0; i < 300; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.01, 0.03),
      brightness: random(150, 255),
      pulseSpeed: random(0.02, 0.05),
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  background(10, 10, 30);
  
  // Update and display circles
  for (let circle of circles) {
    circle.x += sin(frameCount * circle.speed) * 0.2;
    circle.y += cos(frameCount * circle.speed) * 0.2;
    
    fill(circle.hue, 50, 80, circle.alpha);
    ellipse(circle.x, circle.y, circle.radius);
  }
  
  // Update and display stars
  for (let star of stars) {
    let pulse = sin(frameCount * star.pulseSpeed + star.pulsePhase) * 0.5 + 0.5;
    let size = star.size * pulse;
    
    fill(255, 255, 220, star.brightness * pulse);
    noStroke();
    ellipse(star.x, star.y, size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
