let ribbons = [];
let fogDensity = 0.7;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create silk ribbons
  for (let i = 0; i < 150; i++) {
    ribbons.push({
      x: random(width),
      y: random(height),
      z: random(-100, 100),
      size: random(20, 60),
      speed: random(0.2, 0.8),
      color: color(random(150, 255), random(50, 200), random(50, 200), random(100, 200)),
      angle: random(TWO_PI),
      sway: random(TWO_PI),
      swaySpeed: random(0.01, 0.03)
    });
  }
}

function draw() {
  // Soft fog background
  background(30, 40, 60);
  
  // Draw ribbons
  for (let ribbon of ribbons) {
    // Update position with gentle movement
    ribbon.x += sin(ribbon.angle) * ribbon.speed;
    ribbon.y += cos(ribbon.angle) * ribbon.speed;
    ribbon.z += random(-0.5, 0.5);
    
    // Gentle sway
    ribbon.sway += ribbon.swaySpeed;
    ribbon.angle += sin(ribbon.sway) * 0.01;
    
    // Reset if out of bounds
    if (ribbon.x < -50 || ribbon.x > width + 50 || 
        ribbon.y < -50 || ribbon.y > height + 50) {
      ribbon.x = random(width);
      ribbon.y = random(height);
      ribbon.z = random(-100, 100);
    }
    
    // Apply fog effect
    let alpha = map(ribbon.z, -100, 100, 30, 180);
    let size = map(ribbon.z, -100, 100, ribbon.size * 0.5, ribbon.size * 1.5);
    
    // Draw ribbon
    fill(red(ribbon.color), green(ribbon.color), blue(ribbon.color), alpha);
    noStroke();
    
    push();
    translate(ribbon.x, ribbon.y);
    rotate(ribbon.angle);
    
    // Create a soft, flowing shape
    beginShape();
    for (let i = 0; i < 10; i++) {
      let angle = map(i, 0, 9, 0, TWO_PI);
      let radius = size * 0.5 + sin(frameCount * 0.02 + angle) * size * 0.3;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    pop();
  }
  
  // Add soft fog layer
  blendMode(LIGHTEST);
  for (let i = 0; i < 200; i++) {
    let x = (frameCount * 0.1 + i * 10) % width;
    let y = (frameCount * 0.05 + i * 7) % height;
    let alpha = map(noise(x * 0.01, y * 0.01), 0, 1, 10, 40);
    
    fill(255, 255, 255, alpha);
    noStroke();
    ellipse(x, y, 20, 20);
  }
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
