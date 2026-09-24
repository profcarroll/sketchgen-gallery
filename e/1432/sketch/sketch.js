let groundTexture;
let dustDevils = [];
let skyColor;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(RGB);
  
  // Create a rich terracotta ground color with variation
  skyColor = color(200, 180, 160); // Pale beige sky
  
  // Generate ground texture with cracks and fissures
  groundTexture = createGraphics(width, height);
  groundTexture.colorMode(RGB);
  groundTexture.background(150, 50, 30); // Deep terracotta base

  // Add cracks and fissures to the ground
  groundTexture.stroke(80, 20, 10);
  groundTexture.strokeWeight(2);
  
  for (let i = 0; i < 500; i++) {
    let x1 = random(width);
    let y1 = random(height);
    let x2 = x1 + random(-100, 100);
    let y2 = y1 + random(-100, 100);
    groundTexture.line(x1, y1, x2, y2);
  }

  // Add some low scrub vegetation
  groundTexture.stroke(60, 40, 20);
  groundTexture.strokeWeight(1);
  
  for (let i = 0; i < 300; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(5, 15);
    groundTexture.ellipse(x, y, size, size * 0.5);
  }

  // Create dust devils
  for (let i = 0; i < 20; i++) {
    dustDevils.push({
      x: random(width),
      y: height - 100,
      size: random(10, 50),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      sway: random(-0.05, 0.05),
      opacity: random(50, 150)
    });
  }
}

function draw() {
  // Draw sky
  background(skyColor);
  
  // Draw textured ground
  image(groundTexture, 0, 0);
  
  // Draw distant rock formation
  fill(120, 80, 60);
  noStroke();
  for (let i = 0; i < 30; i++) {
    let x = map(i, 0, 29, width * 0.3, width * 0.7);
    let h = map(sin(frameCount * 0.01 + i), -1, 1, 50, 150);
    rect(x, height - 100, 30, h);
  }
  
  // Update and draw dust devils
  for (let devil of dustDevils) {
    // Animate the dust devil
    devil.angle += devil.sway;
    devil.x += cos(devil.angle) * devil.speed;
    devil.y -= sin(devil.angle) * devil.speed;
    
    // Reset if off screen
    if (devil.y < 0 || devil.x < -100 || devil.x > width + 100) {
      devil.x = random(width);
      devil.y = height - 100;
      devil.size = random(10, 50);
      devil.angle = random(TWO_PI);
    }
    
    // Draw the dust devil
    fill(200, 180, 160, devil.opacity);
    noStroke();
    ellipse(devil.x, devil.y, devil.size, devil.size * 0.8);
  }
  
  // Add dramatic shadows in crevices
  stroke(30, 15, 10);
  strokeWeight(1);
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    if (random() > 0.8) { // Only draw some shadows
      line(x, y, x + random(-20, 20), y + random(10, 30));
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
