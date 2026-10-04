let stars = [];
let nebula;
let driftOffset = 0;
let waveRadius = 0;
let waveMaxRadius = 0;
let waveStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
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
  
  // Set initial wave parameters
  waveMaxRadius = max(width, height) * 1.5;
}

function draw() {
  background(0);
  
  // Draw nebula background
  image(nebula, -width/2, -height/2);
  
  // Calculate a unified pulse for all stars
  let pulse = sin(frameCount * 0.02) * 0.5 + 0.5;
  
  // Draw and animate stars with synchronized pulsing
  for (let star of stars) {
    let size = star.size * (1 + pulse * 0.8);
    fill(240, 50, 100, star.brightness);
    noStroke();
    ellipse(star.x - width/2, star.y - height/2, size);
  }
  
  // Slowly shift the nebula for motion effect
  driftOffset += 0.001;
  
  // Start the wave after a delay
  if (!waveStarted && frameCount > 60) {
    waveStarted = true;
  }
  
  // Update and draw the expanding wave
  if (waveStarted) {
    waveRadius += 5;
    
    // Draw the wave as a circular glow
    noFill();
    stroke(200, 80, 100, 0.3);
    strokeWeight(2);
    ellipse(0, 0, waveRadius * 2);
    
    // Draw the wave's leading edge more prominently
    stroke(200, 100, 100, 0.7);
    strokeWeight(4);
    ellipse(0, 0, waveRadius * 2 + 10);
    
    // Stop the wave when it reaches max size
    if (waveRadius > waveMaxRadius) {
      waveRadius = 0;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
