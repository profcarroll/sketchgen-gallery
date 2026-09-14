let stars = [];
let nebulae = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create stars
  for (let i = 0; i < 500; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      brightness: random(100, 255),
      speed: random(0.1, 0.5)
    });
  }
  
  // Create nebula filaments
  for (let i = 0; i < 20; i++) {
    nebulae.push({
      x: random(width),
      y: random(height),
      size: random(50, 300),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      color: color(random(150, 255), random(100, 200), random(200, 255), 30)
    });
  }
}

function draw() {
  // Deep indigo background
  background(10, 5, 30);
  
  // Draw nebula filaments with slow drift
  for (let neb of nebulae) {
    fill(neb.color);
    noStroke();
    
    // Create flowing, organic shape
    beginShape();
    for (let i = 0; i < 100; i++) {
      let angle = neb.angle + i * 0.2;
      let radius = neb.size * (0.8 + 0.2 * sin(frameCount * neb.speed + i * 0.1));
      let x = neb.x + cos(angle) * radius;
      let y = neb.y + sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Slowly move nebula
    neb.x += sin(frameCount * 0.001) * 0.2;
    neb.y += cos(frameCount * 0.001) * 0.2;
    neb.angle += 0.0005;
  }
  
  // Draw stars with twinkling effect
  for (let star of stars) {
    fill(255, star.brightness);
    
    // Twinkling effect using sine wave
    let twinkle = sin(frameCount * star.speed) * 10;
    ellipse(star.x, star.y, star.size + twinkle);
    
    // Slow drift
    star.x += sin(frameCount * 0.001) * 0.1;
    star.y += cos(frameCount * 0.001) * 0.1;
    
    // Reset if off screen
    if (star.x < -20 || star.x > width + 20 || star.y < -20 || star.y > height + 20) {
      star.x = random(width);
      star.y = random(height);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
