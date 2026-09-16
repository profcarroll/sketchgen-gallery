let clouds = [];
let bgHue = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create cloud structures
  for (let i = 0; i < 100; i++) {
    clouds.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      speed: random(0.001, 0.005),
      opacity: random(30, 80),
      phase: random(TWO_PI)
    });
  }
}

function draw() {
  // Animate background color
  bgHue = (bgHue + 0.2) % 360;
  let bg = color(bgHue, 50, 10);
  background(bg);
  
  // Draw clouds
  for (let cloud of clouds) {
    cloud.x += sin(frameCount * cloud.speed) * 0.5;
    cloud.y += cos(frameCount * cloud.speed) * 0.3;
    cloud.phase += 0.01;
    
    let alpha = cloud.opacity + sin(cloud.phase) * 20;
    fill(255, alpha);
    
    // Draw soft, flowing cloud shape
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = map(i, 0, 8, 0, TWO_PI);
      let radius = cloud.size * (0.8 + sin(cloud.phase + angle) * 0.2);
      let x = cloud.x + cos(angle) * radius;
      let y = cloud.y + sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add bright stars in dense areas
    if (cloud.size > 150 && random() < 0.3) {
      fill(255, 200);
      noStroke();
      ellipse(
        cloud.x + random(-cloud.size/3, cloud.size/3),
        cloud.y + random(-cloud.size/3, cloud.size/3),
        random(1, 3)
      );
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
