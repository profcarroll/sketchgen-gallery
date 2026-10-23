let liquidParticles = [];
const numParticles = 800;
let textureMap;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize liquid particles
  for (let i = 0; i < numParticles; i++) {
    liquidParticles.push({
      x: random(width),
      y: random(height),
      hue: random(360),
      size: random(2, 6),
      speed: random(0.2, 0.8),
      drift: random(-0.5, 0.5),
      opacity: random(0.3, 0.7)
    });
  }
  
  // Create texture map for corrugated cardboard effect
  textureMap = createGraphics(width, height);
  textureMap.colorMode(HSB, 360, 100, 100, 1);
  textureMap.background(0, 0, 0, 0);
  
  // Draw corrugated pattern
  textureMap.noiseDetail(2, 0.5);
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const n = textureMap.noise(x * 0.01, y * 0.01, time * 0.001) * 255;
      textureMap.stroke(n * 0.3, 20, 80);
      textureMap.point(x, y);
    }
  }
}

function draw() {
  // Semi-transparent background for motion trails
  background(0, 0, 0, 0.05);
  
  time += 1;
  
  // Update and display particles
  for (let i = 0; i < liquidParticles.length; i++) {
    const p = liquidParticles[i];
    
    // Gentle drift with organic movement
    p.x += p.drift * 0.5;
    p.y += p.speed;
    
    // Wrap around the canvas
    if (p.y > height + 20) p.y = -20;
    if (p.x < -20) p.x = width + 20;
    if (p.x > width + 20) p.x = -20;
    
    // Apply color mixing effect
    const hueShift = sin(time * 0.01 + i * 0.01) * 5;
    const mixedHue = (p.hue + hueShift) % 360;
    
    // Draw particle with texture effect
    noStroke();
    fill(mixedHue, 80, 90, p.opacity);
    ellipse(p.x, p.y, p.size, p.size);
  }
  
  // Apply corrugated cardboard texture
  image(textureMap, 0, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
