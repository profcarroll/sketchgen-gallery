let cultures = [];
const numCultures = 80;
const maxRadius = 60;
const minRadius = 20;
const glowIntensity = 150;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize bacterial culture clusters
  for (let i = 0; i < numCultures; i++) {
    cultures.push({
      x: random(width),
      y: random(height),
      radius: random(minRadius, maxRadius),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI),
      opacity: random(30, 100),
      noiseOffset: random(1000),
      hue: random(180, 260), // Blue-green hues
      saturation: random(70, 100),
      brightness: random(50, 90)
    });
  }
}

function draw() {
  background(10, 15, 30);
  
  // Draw glowing cultures
  for (let i = 0; i < numCultures; i++) {
    let culture = cultures[i];
    
    // Update position with organic noise
    culture.angle += (noise(culture.noiseOffset + frameCount * 0.01) - 0.5) * 0.03;
    culture.x += cos(culture.angle) * culture.speed;
    culture.y += sin(culture.angle) * culture.speed;
    
    // Boundary check
    if (culture.x < -50 || culture.x > width + 50 ||
        culture.y < -50 || culture.y > height + 50) {
      culture.x = random(width);
      culture.y = random(height);
      culture.angle = random(TWO_PI);
    }
    
    // Draw the glowing culture
    noStroke();
    fill(culture.hue, culture.saturation, culture.brightness, culture.opacity);
    
    // Create a soft, irregular shape to simulate a bacterial colony
    push();
    translate(culture.x, culture.y);
    beginShape();
    let sides = floor(random(6, 12));
    for (let j = 0; j < sides; j++) {
      let angle = map(j, 0, sides, 0, TWO_PI);
      let radiusVariation = culture.radius * (0.9 + noise(culture.noiseOffset + frameCount * 0.01 + j) * 0.3);
      let x = cos(angle) * radiusVariation;
      let y = sin(angle) * radiusVariation;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
