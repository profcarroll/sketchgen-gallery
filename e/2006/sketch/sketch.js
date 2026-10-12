let particles = [];
let noiseScale = 0.005;
let noiseStrength = 3;
let slateTexture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a detailed slate texture
  slateTexture = createGraphics(width, height * 0.4);
  slateTexture.colorMode(HSB, 360, 100, 100, 1);
  slateTexture.noiseSeed(42);
  
  for (let y = 0; y < slateTexture.height; y += 2) {
    for (let x = 0; x < slateTexture.width; x += 2) {
      let n = slateTexture.noise(x * noiseScale, y * noiseScale) * noiseStrength;
      let c = color(200, 60, 15 + n);
      slateTexture.set(x, y, c);
    }
  }
  slateTexture.updatePixels();
  
  // Initialize particles
  for (let i = 0; i < 1500; i++) {
    particles.push({
      x: random(width),
      y: random(height * 0.6, height),
      size: random(1, 3),
      speed: random(0.2, 1.5),
      angle: random(TWO_PI),
      opacity: random(0.1, 0.3),
      noiseOffset: random(1000)
    });
  }
}

function draw() {
  // Create deep blue atmospheric background
  background(200, 80, 90);
  
  // Draw polished slate surface with crystalline texture
  drawSlateSurface();
  
  // Draw ethereal nebula dust plumes drifting across the surface
  drawNebulaDust();
}

function drawSlateSurface() {
  // Draw the main slate surface with texture
  tint(255, 100);
  image(slateTexture, 0, height * 0.6, width, height * 0.4);
  
  // Add crystalline texture details
  noStroke();
  fill(180, 20, 80, 0.3);
  for (let i = 0; i < 2000; i++) {
    let x = random(width);
    let y = random(height * 0.6, height);
    ellipse(x, y, random(0.5, 1.5));
  }
}

function drawNebulaDust() {
  // Draw drifting plumes of nebula dust
  blendMode(ADD);
  
  beginShape(POINTS);
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    
    // Update particle position with noise
    let noiseX = noise(p.noiseOffset + frameCount * 0.002, p.y * 0.01) * noiseStrength;
    let noiseY = noise(p.noiseOffset + 1000 + frameCount * 0.002, p.x * 0.01) * noiseStrength;
    
    p.x += cos(p.angle) * p.speed + noiseX;
    p.y += sin(p.angle) * p.speed + noiseY;
    
    // Reset if out of bounds
    if (p.x > width + 50 || p.x < -50 || p.y > height + 50) {
      p.x = random(width);
      p.y = random(height * 0.6, height);
      p.noiseOffset = random(1000);
    }
    
    // Add particle to shape
    fill(200, 60, 70, p.opacity);
    vertex(p.x, p.y);
  }
  endShape();
  
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
