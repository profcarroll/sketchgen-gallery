let waves = [];
let isDrawing = false;
let waveCount = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize wave patterns
  for (let i = 0; i < waveCount; i++) {
    waves.push({
      x: random(width),
      y: random(height),
      radius: random(50, 200),
      speed: random(0.005, 0.02),
      angle: random(TWO_PI),
      hue: random(20, 40), // sepia tones
      alpha: random(0.05, 0.15)
    });
  }
}

function draw() {
  background(0, 0, 0, 0.02); // very slight fade
  
  // Draw waves
  for (let i = 0; i < waves.length; i++) {
    let wave = waves[i];
    
    // Update wave properties
    wave.angle += wave.speed;
    wave.radius += sin(wave.angle) * 0.5;
    
    // Draw the wave ripple
    noFill();
    stroke(wave.hue, 30, 80, wave.alpha);
    strokeWeight(1);
    ellipse(wave.x, wave.y, wave.radius * 2);
    
    // Reset wave if it gets too big or small
    if (wave.radius > 300 || wave.radius < 10) {
      wave.x = random(width);
      wave.y = random(height);
      wave.radius = random(50, 200);
      wave.angle = random(TWO_PI);
    }
  }
  
  // Occasionally trigger a crystallization effect
  if (frameCount % 300 === 0) {
    isDrawing = true;
    setTimeout(() => isDrawing = false, 1000);
  }
  
  // Draw temporary crystalline structures
  if (isDrawing) {
    let centerX = width / 2;
    let centerY = height / 2;
    
    for (let i = 0; i < 5; i++) {
      let angle = map(i, 0, 5, 0, TWO_PI);
      let x = centerX + cos(angle) * 100;
      let y = centerY + sin(angle) * 100;
      
      stroke(20, 30, 90, 0.7);
      strokeWeight(2);
      line(centerX, centerY, x, y);
    }
    
    // Draw some faint lines in a grid pattern
    for (let i = 0; i < 10; i++) {
      let y = map(i, 0, 10, 0, height);
      stroke(20, 20, 85, 0.3);
      strokeWeight(1);
      line(0, y, width, y);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
