let bubbles = [];
let currentColor;
let lightShafts = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial bubbles
  for (let i = 0; i < 150; i++) {
    bubbles.push({
      x: random(width),
      y: random(height),
      size: random(5, 30),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.2, 0.2),
      hue: random(180, 240)
    });
  }
  
  // Create light shafts
  for (let i = 0; i < 8; i++) {
    lightShafts.push({
      x: random(width),
      y: random(height),
      size: random(50, 150),
      speed: random(0.1, 0.3),
      opacity: random(0.1, 0.4)
    });
  }
  
  noStroke();
}

function draw() {
  // Create a subtle gradient background
  for (let y = 0; y < height; y += 2) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(180, 30, 20), color(220, 40, 30), inter);
    stroke(c);
    line(0, y, width, y);
  }

  // Update and draw light shafts
  for (let shaft of lightShafts) {
    shaft.y += shaft.speed;
    if (shaft.y > height + shaft.size) {
      shaft.y = -shaft.size;
      shaft.x = random(width);
    }
    
    fill(200, 50, 100, shaft.opacity);
    ellipse(shaft.x, shaft.y, shaft.size, shaft.size * 0.4);
  }

  // Update and draw bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let b = bubbles[i];
    
    // Move bubble
    b.x += b.speedX;
    b.y += b.speedY;
    
    // Apply gentle current
    b.speedY += 0.01;
    
    // Bounce off edges
    if (b.x < 0 || b.x > width) {
      b.speedX *= -1;
    }
    
    if (b.y < 0 || b.y > height) {
      b.speedY *= -1;
    }
    
    // Create distortion effect using sine waves
    let distortion = sin(frameCount * 0.02 + b.x * 0.01) * 2;
    
    // Draw bubble with semi-transparency
    fill(b.hue, 70, 90, 0.3);
    ellipse(b.x + distortion, b.y, b.size, b.size);
    
    // Add highlight to bubble
    fill(255, 80, 100, 0.6);
    ellipse(b.x + distortion - b.size * 0.2, b.y - b.size * 0.2, b.size * 0.3, b.size * 0.3);
  }

  // Add some subtle ripples
  if (frameCount % 10 === 0) {
    for (let i = 0; i < 5; i++) {
      let rippleX = random(width);
      let rippleY = random(height);
      let size = random(20, 80);
      
      fill(180, 40, 80, 0.1);
      ellipse(rippleX, rippleY, size, size * 0.3);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
