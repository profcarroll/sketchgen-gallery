let inkParticles = [];
let paperTexture;
let particleCount = 1500;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  
  // Create a subtle paper texture
  paperTexture = createGraphics(width, height);
  paperTexture.noiseDetail(2, 0.5);
  paperTexture.loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let noiseVal = paperTexture.noise(x * 0.01, y * 0.01) * 255;
      paperTexture.set(x, y, color(noiseVal * 0.3, noiseVal * 0.2, noiseVal * 0.1));
    }
  }
  paperTexture.updatePixels();
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    inkParticles.push({
      x: random(width),
      y: random(height),
      size: random(2, 8),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.5, 0.5),
      color: color(random(100, 180), random(50, 120), random(20, 60), random(100, 200)),
      cohesion: random(0.01, 0.05),
      spreadRate: random(0.001, 0.005)
    });
  }
}

function draw() {
  // Draw the damp paper background
  image(paperTexture, 0, 0);
  
  // Draw and update particles
  for (let i = 0; i < inkParticles.length; i++) {
    let p = inkParticles[i];
    
    // Apply movement with some randomness
    p.x += p.speedX;
    p.y += p.speedY;
    
    // Add some spreading force
    p.size += p.spreadRate;
    
    // Slowly blend into surroundings (simulate absorption)
    p.color = lerpColor(p.color, color(100, 50, 20, 150), 0.001);
    
    // Boundary checks - wrap around
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Draw particle with soft edges
    fill(p.color);
    noStroke();
    ellipse(p.x, p.y, p.size);
  }
  
  // Occasionally create new ink blobs
  if (frameCount % 30 === 0 && random() > 0.7) {
    for (let i = 0; i < 5; i++) {
      inkParticles.push({
        x: random(width),
        y: random(height),
        size: random(1, 4),
        speedX: random(-0.3, 0.3),
        speedY: random(-0.3, 0.3),
        color: color(random(120, 180), random(60, 100), random(30, 70), random(150, 255)),
        cohesion: random(0.01, 0.05),
        spreadRate: random(0.002, 0.008)
      });
    }
  }
  
  // Keep particle count stable
  if (inkParticles.length > particleCount) {
    inkParticles.splice(0, inkParticles.length - particleCount);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
