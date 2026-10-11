let blobs = [];
const blobCount = 30;
let fluidColor = [100, 150, 200, 180];
let vessel;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize blobs with more organic properties
  for (let i = 0; i < blobCount; i++) {
    blobs.push({
      x: random(width),
      y: random(height),
      size: random(30, 80),
      speedX: random(-0.3, 0.3),
      speedY: random(-0.3, 0.3),
      color: [
        random(150, 255),
        random(80, 180),
        random(40, 120),
        220
      ],
      offset: random(TWO_PI),
      viscosity: random(0.95, 0.99),
      elasticity: random(0.1, 0.3)
    });
  }
  
  // Create a transparent vessel
  vessel = createGraphics(width, height);
  vessel.noStroke();
  vessel.fill(255, 30);
  vessel.rect(0, 0, width, height);
}

function draw() {
  // Draw the transparent vessel
  image(vessel, 0, 0);
  
  // Draw fluid background
  fill(fluidColor);
  rect(0, 0, width, height);
  
  // Update and display each blob with more viscous movement
  for (let i = 0; i < blobs.length; i++) {
    let b = blobs[i];
    
    // Apply slow, fluid-like motion
    b.x += b.speedX;
    b.y += b.speedY;
    
    // Add gentle viscosity effect
    b.speedX *= b.viscosity;
    b.speedY *= b.viscosity;
    
    // Add subtle noise-based movement for organic feel
    let noiseFactor = 0.01;
    b.speedX += map(noise(b.x * noiseFactor, b.y * noiseFactor, frameCount * 0.001), 0, 1, -0.2, 0.2);
    b.speedY += map(noise(b.x * noiseFactor, b.y * noiseFactor, frameCount * 0.001 + 1000), 0, 1, -0.2, 0.2);
    
    // Keep blobs within canvas bounds with soft bouncing
    if (b.x < 0 || b.x > width) {
      b.speedX *= -b.elasticity;
      b.x = constrain(b.x, 0, width);
    }
    if (b.y < 0 || b.y > height) {
      b.speedY *= -b.elasticity;
      b.y = constrain(b.y, 0, height);
    }
    
    // Draw blob with textural effect
    fill(b.color);
    drawTexturedBlob(b.x, b.y, b.size);
    
    // Add subtle highlight for 3D effect
    fill(255, 100);
    ellipse(b.x - b.size/4, b.y - b.size/4, b.size/4);
  }
}

function drawTexturedBlob(x, y, size) {
  // Draw a more amorphous blob with textural variation
  beginShape();
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI);
    let r = size/2 + random(-size/6, size/6);
    let px = x + cos(angle) * r;
    let py = y + sin(angle) * r;
    vertex(px, py);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Re-create vessel on resize
  vessel = createGraphics(width, height);
  vessel.noStroke();
  vessel.fill(255, 30);
  vessel.rect(0, 0, width, height);
}
