let waves = [];
let amplitude = 0;
let mouseForce = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  colorMode(HSB, 360, 100, 100, 1);
  
  // Initialize waves
  for (let i = 0; i < 50; i++) {
    waves.push({
      x: random(width),
      y: random(height),
      radius: random(50, 200),
      speed: random(0.005, 0.02),
      hue: random(360),
      amp: random(0.5, 1.5)
    });
  }
}

function draw() {
  // Create a subtle fade effect
  fill(0, 0, 0, 0.05);
  rect(0, 0, width, height);

  // Update mouse interaction
  if (mouseIsPressed) {
    mouseForce = 1;
  } else {
    mouseForce *= 0.95; // Gradually reduce force
  }

  // Draw waves
  for (let wave of waves) {
    // Base pulse effect
    let pulse = sin(frameCount * wave.speed) * wave.amp;
    
    // Mouse interaction effect
    let d = dist(mouseX, mouseY, wave.x, wave.y);
    if (d < 300) {
      let force = map(d, 0, 300, 1, 0);
      pulse += force * mouseForce * 2;
    }
    
    // Apply hue shift over time
    let h = (wave.hue + frameCount * 0.5) % 360;
    
    // Draw the wave
    fill(h, 100, 100, 0.3);
    ellipse(wave.x, wave.y, wave.radius + pulse * 50);
  }
  
  // Simulate heart rate amplitude
  amplitude = map(sin(frameCount * 0.05), -1, 1, 0.8, 1.2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
