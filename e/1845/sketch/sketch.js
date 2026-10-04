let sandParticles = [];
let flashTime = 0;
let flashDuration = 800; // milliseconds for flash duration
let flashInterval = 3000; // milliseconds between flashes
let flashCenterX, flashCenterY;
let flashRadius = 0;
let flashActive = false;

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
  
  // Initialize flash center to a random point
  flashCenterX = random(width);
  flashCenterY = random(height);
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
  
  // Determine if flash is active and update flash parameters
  if (flashTime < flashDuration) {
    flashActive = true;
    let progress = map(flashTime, 0, flashDuration, 0, 1);
    if (progress > 1) progress = 2 - progress;
    
    flashRadius = map(progress, 0, 1, 0, width * 0.3);
    
    // Draw the flash effect
    drawingContext.globalCompositeOperation = 'screen';
    fill(255, 255, 200, 150 * progress);
    noStroke();
    ellipse(flashCenterX, flashCenterY, flashRadius, flashRadius);
    drawingContext.globalCompositeOperation = 'source-over';
    
    // Apply the flash effect to nearby particles
    for (let particle of sandParticles) {
      let d = dist(particle.x, particle.y, flashCenterX, flashCenterY);
      if (d < flashRadius * 0.8) {
        let brightFactor = map(d, 0, flashRadius * 0.8, 1, 0.3);
        fill(particle.hue, particle.saturation, particle.brightness * brightFactor);
        ellipse(particle.x, particle.y, particle.size);
      }
    }
  } else {
    flashActive = false;
  }
  
  // Occasionally change the flash center for dynamic effect
  if (frameCount % 100 === 0) {
    flashCenterX = random(width);
    flashCenterY = random(height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
