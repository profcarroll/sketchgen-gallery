let time = 0;
let stripes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Precompute stripe positions and colors for performance
  for (let i = 0; i < 20; i++) {
    stripes.push({
      y: i * (height / 20),
      speed: random(0.001, 0.005),
      color: color(random(100, 255), random(100, 255), random(100, 255), 200)
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Draw warped diagonal stripes
  for (let i = 0; i < stripes.length; i++) {
    const stripe = stripes[i];
    fill(stripe.color);
    
    beginShape();
    for (let x = 0; x <= width; x += 20) {
      // Create a wavy, shifting pattern
      const wave = sin(x * 0.01 + time * stripe.speed) * 30;
      const y = stripe.y + wave + sin(time * 0.5 + i * 0.2) * 20;
      
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
  
  // Add halftone texture
  drawHalftone();
}

function drawHalftone() {
  loadPixels();
  const dotSize = 8;
  const spacing = 16;
  
  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      // Create a halftone pattern with varying density
      const density = noise(x * 0.01, y * 0.01, time) * 0.5 + 0.5;
      
      if (density > 0.3) {
        const px = x + random(-dotSize/2, dotSize/2);
        const py = y + random(-dotSize/2, dotSize/2);
        
        if (px >= 0 && px < width && py >= 0 && py < height) {
          pixels[(py * width + px) * 4] = 255;
          pixels[(py * width + px) * 4 + 1] = 255;
          pixels[(py * width + px) * 4 + 2] = 255;
        }
      }
    }
  }
  updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
