let time = 0;
let formType = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
}

function draw() {
  background(220, 5, 95);
  
  time += 0.02;
  
  // Shift between form types
  if (time % 10 < 1) {
    formType = (formType + 1) % 3;
  }
  
  const cycle = time % 10;
  
  // Energy buildup and release
  const energy = map(sin(cycle), -1, 1, 0.3, 1);
  
  push();
  translate(width/2, height/2);
  
  // Draw multiple layers of forms
  for (let i = 0; i < 8; i++) {
    const angle = TWO_PI * i / 8;
    const size = 50 + sin(cycle + i) * 40;
    
    push();
    rotate(angle);
    
    // Form type selection
    if (formType === 0) {
      // Circular form
      fill((time * 10 + i * 30) % 360, 80, 80 * energy, 0.7);
      ellipse(0, 0, size * energy, size * energy);
    } else if (formType === 1) {
      // Square form
      fill((time * 10 + i * 30 + 120) % 360, 80, 80 * energy, 0.7);
      rectMode(CENTER);
      rect(0, 0, size * energy, size * energy);
    } else {
      // Triangle form
      fill((time * 10 + i * 30 + 240) % 360, 80, 80 * energy, 0.7);
      triangle(0, -size/2 * energy, 
               -size/2 * energy, size/2 * energy,
               size/2 * energy, size/2 * energy);
    }
    
    pop();
  }
  
  // Central oscillating form
  const centralSize = 80 + sin(cycle * 3) * 30;
  fill((time * 15) % 360, 90, 90, 0.8);
  ellipse(0, 0, centralSize, centralSize);
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
