let hyphae = [];
let substrate;
let points = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create substrate texture
  substrate = createGraphics(width, height);
  substrate.colorMode(HSB, 360, 100, 100, 1);
  substrate.background(20, 10, 85);
  
  // Add paper-like texture
  substrate.noStroke();
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(0.5, 2);
    let brightness = random(70, 90);
    substrate.fill(20, 5, brightness, 0.1);
    substrate.ellipse(x, y, size, size);
  }
  
  // Create hyphae network
  for (let i = 0; i < 800; i++) {
    hyphae.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      hue: random(200, 240),
      saturation: random(80, 100),
      brightness: random(70, 90),
      speed: random(0.001, 0.005),
      angle: random(TWO_PI),
      segments: floor(random(3, 8)),
      segmentLength: random(10, 30)
    });
  }
  
  // Build point cloud for bioluminescence
  points = [];
  for (let i = 0; i < 2000; i++) {
    points.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2)
    });
  }
}

function draw() {
  background(0, 0, 10);
  
  // Draw substrate
  image(substrate, 0, 0);
  
  // Create bioluminescent glow effect
  blendMode(ADD);
  
  // Draw hyphae network as point cloud
  beginShape(POINTS);
  for (let h of hyphae) {
    // Animate position
    let nX = noise(h.x * 0.001, h.y * 0.001, frameCount * 0.001) * 2;
    let nY = noise(h.x * 0.001 + 1000, h.y * 0.001 + 1000, frameCount * 0.001) * 2;
    
    h.x += cos(h.angle) * h.speed + nX;
    h.y += sin(h.angle) * h.speed + nY;
    
    // Wrap around edges
    if (h.x > width) h.x = 0;
    if (h.x < 0) h.x = width;
    if (h.y > height) h.y = 0;
    if (h.y < 0) h.y = height;
    
    fill(h.hue, h.saturation, h.brightness, 0.8);
    noStroke();
    vertex(h.x, h.y);
  }
  endShape();
  
  // Draw bioluminescent points
  blendMode(BLEND);
  noStroke();
  for (let p of points) {
    let alpha = sin(frameCount * 0.01 + p.x * 0.01) * 0.5 + 0.5;
    fill(220, 90, 100, alpha * 0.3);
    ellipse(p.x, p.y, p.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
