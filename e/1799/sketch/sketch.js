let sandParticles = [];
let flashTime = 0;
let flashDuration = 800; // milliseconds for flash duration
let flashInterval = 3000; // milliseconds between flashes

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create sand particles with texture details
  for (let i = 0; i < 5000; i++) {
    sandParticles.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 3),
      brightness: random(150, 220),
      hue: random(20, 40), // sandy orange-brown hues
      saturation: random(20, 60)
    });
  }
}

function draw() {
  background(20); // dark desert base color
  
  // Draw sand field with textured particles
  noStroke();
  for (let particle of sandParticles) {
    fill(particle.hue, particle.saturation, particle.brightness);
    ellipse(particle.x, particle.y, particle.size);
  }
  
  // Update flash timing
  flashTime = millis() % flashInterval;
  
  // Draw pulsing glow wave
  let progress = map(flashTime, 0, flashDuration, 0, 1);
  if (progress > 1) progress = 2 - progress;
  
  let glowIntensity = map(progress, 0, 1, 0, 255);
  let glowRadius = width * 0.8 * progress;
  
  // Create a soft glow effect
  drawingContext.globalCompositeOperation = 'screen';
  fill(255, 255, 200, glowIntensity * 0.3);
  noStroke();
  ellipse(width/2, height/2, glowRadius, glowRadius);
  drawingContext.globalCompositeOperation = 'source-over';
  
  // Add subtle texture overlay that shifts with the glow
  if (glowIntensity > 50) {
    drawingContext.globalCompositeOperation = 'overlay';
    fill(255, 255, 255, glowIntensity * 0.1);
    noStroke();
    ellipse(width/2, height/2, width * 0.6, height * 0.6);
    drawingContext.globalCompositeOperation = 'source-over';
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
