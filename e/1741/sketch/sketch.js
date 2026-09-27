let lights = [];
let flashInterval = 2000; // milliseconds between flashes
let flashDuration = 100; // milliseconds for flash duration

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize light sources at random positions
  for (let i = 0; i < 15; i++) {
    lights.push({
      x: random(width),
      y: random(height),
      size: random(20, 80),
      color: [random(200, 255), random(150, 255), random(100, 255)],
      lastFlashTime: random(flashInterval)
    });
  }
}

function draw() {
  background(0);
  
  // Draw a dark field with subtle star-like particles
  noStroke();
  fill(50, 50, 80);
  for (let i = 0; i < 1000; i++) {
    let x = (i * 37) % width;
    let y = (i * 73) % height;
    ellipse(x, y, 0.5);
  }
  
  // Update and draw lights
  for (let light of lights) {
    let timeSinceLastFlash = millis() - light.lastFlashTime;
    
    if (timeSinceLastFlash > flashInterval) {
      // Start a new flash cycle
      light.lastFlashTime = millis();
    }
    
    let flashTimeElapsed = millis() - light.lastFlashTime;
    
    if (flashTimeElapsed < flashDuration) {
      // Flash is active
      let alpha = map(flashTimeElapsed, 0, flashDuration, 255, 0);
      fill(light.color[0], light.color[1], light.color[2], alpha);
      ellipse(light.x, light.y, light.size * (1 + flashTimeElapsed / 50));
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
