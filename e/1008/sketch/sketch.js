let fft;
let amplitude;
let waterParticles = [];
let rippleOffset = 0;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize audio
  fft = new p5.FFT();
  amplitude = new p5.Amplitude();
  
  // Create water particles
  for (let i = 0; i < 2000; i++) {
    waterParticles.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.5, 2),
      angle: random(TWO_PI),
      hue: random(180, 240)
    });
  }
}

function draw() {
  background(200, 10, 90);
  
  // Update ripple offset for animation
  rippleOffset += 0.01;
  
  // Draw water surface with subtle ripples
  drawWaterSurface();
  
  // Draw particles that move gently
  drawParticles();
}

function mousePressed() {
  userStartAudio();
}

function drawWaterSurface() {
  noStroke();
  for (let i = 0; i < width; i += 20) {
    let y = height/2 + sin(i * 0.02 + rippleOffset) * 5;
    fill(200, 15, 70);
    ellipse(i, y, 30, 10);
    
    // Add subtle ripples
    for (let j = 0; j < 5; j++) {
      let offset = sin((i + j * 10) * 0.02 + rippleOffset) * 3;
      fill(200, 10, 80);
      ellipse(i, y + offset, 15, 5);
    }
  }
}

function drawParticles() {
  let vol = amplitude.getLevel();
  
  // Scale particle behavior based on volume
  let scale = map(vol, 0, 0.5, 1, 3);
  
  for (let i = 0; i < waterParticles.length; i++) {
    let p = waterParticles[i];
    
    // Move particles with gentle motion
    p.x += cos(p.angle) * p.speed * scale;
    p.y += sin(p.angle) * p.speed * scale;
    
    // Wrap around edges
    if (p.x > width + 10) p.x = -10;
    if (p.x < -10) p.x = width + 10;
    if (p.y > height + 10) p.y = -10;
    if (p.y < -10) p.y = height + 10;
    
    // Adjust hue based on volume
    let h = p.hue + vol * 20;
    
    fill(h % 360, 80, 90, 0.7);
    ellipse(p.x, p.y, p.size * scale);
    
    // Add sparkle effect when volume is high
    if (vol > 0.3) {
      let sparkle = random(10);
      if (sparkle < 2) {
        fill(240, 100, 100, 0.9);
        ellipse(p.x, p.y, p.size * scale * 2);
      }
    }
  }
}
