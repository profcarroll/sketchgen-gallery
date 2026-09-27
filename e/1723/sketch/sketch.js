let stars = [];
let nebula;
let driftOffset = 0;
let supernovae = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create a nebula background using gradient and noise
  nebula = createGraphics(width, height);
  nebula.colorMode(HSB, 360, 100, 100, 1);
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      let n = noise(x * 0.001, y * 0.001, frameCount * 0.0005);
      let c = color(240 + n * 30, 60 + n * 20, 10 + n * 10, n * 0.2);
      nebula.set(x, y, c);
    }
  }
  nebula.loadPixels();

  // Create thousands of stars
  for (let i = 0; i < 3000; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      brightness: random(0.5, 1),
      pulseSpeed: 0.03,
      pulsePhase: random(TWO_PI)
    });
  }
}

function draw() {
  // Draw nebula background
  image(nebula, 0, 0);
  
  // Calculate a unified pulse for all stars
  let pulse = sin(frameCount * 0.03) * 0.5 + 0.5;
  
  // Draw and animate stars with synchronized pulsing
  for (let star of stars) {
    let size = star.size * (1 + pulse * 0.8);
    fill(240, 50, 100, star.brightness);
    noStroke();
    ellipse(star.x, star.y, size);
  }

  // Occasionally create a supernova
  if (random() < 0.002) {
    supernovae.push({
      x: random(width),
      y: random(height),
      maxRadius: random(10, 30),
      age: 0,
      maxAge: 30
    });
  }

  // Update and draw supernovae
  for (let i = supernovae.length - 1; i >= 0; i--) {
    let sn = supernovae[i];
    sn.age++;
    
    // Create explosion effect
    let alpha = map(sn.age, 0, sn.maxAge, 255, 0);
    let radius = map(sn.age, 0, sn.maxAge, 0, sn.maxRadius);
    
    // Draw core (bright white)
    fill(255, 255, 255, alpha);
    noStroke();
    ellipse(sn.x, sn.y, radius * 2);
    
    // Draw glow
    fill(255, 255, 255, alpha * 0.3);
    ellipse(sn.x, sn.y, radius * 4);
    
    // Remove old supernovae
    if (sn.age > sn.maxAge) {
      supernovae.splice(i, 1);
    }
  }

  // Slowly shift the nebula for motion effect
  driftOffset += 0.001;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
