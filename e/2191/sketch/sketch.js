// Hot air balloons floating in a peaceful sky
const PALETTE = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
  '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
  '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
  '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'
];
const CLOUD_COLORS = ['#FFFFFF', '#F5F5F5', '#E0E0E0'];
let balloons = [];
let clouds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create initial balloons
  for (let i = 0; i < 20; i++) {
    balloons.push({
      x: random(width),
      y: random(height),
      size: random(40, 80),
      color: random(PALETTE),
      speedX: random(-0.5, 0.5),
      speedY: random(0.2, 0.8),
      sway: random(TWO_PI),
      swaySpeed: random(0.01, 0.03),
      bloom: false,
      bloomTimer: 0,
      originalColor: null
    });
  }
  
  // Create initial clouds
  for (let i = 0; i < 8; i++) {
    clouds.push({
      x: random(width),
      y: random(height * 0.3),
      size: random(60, 120),
      speed: random(0.1, 0.3)
    });
  }
}

function draw() {
  // Sky gradient background
  background(135, 206, 235);
  for (let y = 0; y < height; y += 2) {
    const inter = map(y, 0, height, 0, 1);
    const c = lerpColor(color(135, 206, 235), color(255, 255, 255), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Draw clouds
  for (let cloud of clouds) {
    fill(random(CLOUD_COLORS));
    noStroke();
    ellipse(cloud.x, cloud.y, cloud.size, cloud.size * 0.6);
    ellipse(cloud.x + cloud.size * 0.3, cloud.y - cloud.size * 0.2, cloud.size * 0.7, cloud.size * 0.5);
    ellipse(cloud.x - cloud.size * 0.3, cloud.y + cloud.size * 0.1, cloud.size * 0.6, cloud.size * 0.4);
    
    // Move clouds
    cloud.x += cloud.speed;
    if (cloud.x > width + cloud.size) {
      cloud.x = -cloud.size;
    }
  }
  
  // Draw and update balloons
  for (let balloon of balloons) {
    // Update position with sway
    balloon.x += balloon.speedX + sin(balloon.sway) * 0.5;
    balloon.y += balloon.speedY;
    balloon.sway += balloon.swaySpeed;
    
    // Bloom effect
    if (balloon.bloom) {
      balloon.bloomTimer--;
      if (balloon.bloomTimer <= 0) {
        balloon.bloom = false;
        balloon.color = balloon.originalColor;
      }
    }
    
    // Draw balloon body
    noStroke();
    fill(balloon.color);
    ellipse(balloon.x, balloon.y, balloon.size, balloon.size * 1.2);
    
    // Draw basket
    fill(80, 40, 0);
    rect(balloon.x - 10, balloon.y + balloon.size * 0.6, 20, 15, 3);
    
    // Draw rope
    stroke(100);
    strokeWeight(1);
    line(balloon.x, balloon.y + balloon.size * 0.6, balloon.x, balloon.y + balloon.size * 0.8);
    
    // Reset if off screen
    if (balloon.y > height + balloon.size) {
      balloon.y = -balloon.size;
      balloon.x = random(width);
    }
  }
}

function mousePressed() {
  // Find balloons near the click
  for (let balloon of balloons) {
    const d = dist(mouseX, mouseY, balloon.x, balloon.y);
    if (d < 100) {
      // Bloom effect
      balloon.bloom = true;
      balloon.bloomTimer = 30;
      balloon.originalColor = balloon.color;
      balloon.color = random(PALETTE);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
