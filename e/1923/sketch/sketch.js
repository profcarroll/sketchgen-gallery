let blobs = [];
const blobCount = 20;
let fluidColor = [30, 20, 40, 220];
let vessel;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize blobs with more organic properties
  for (let i = 0; i < blobCount; i++) {
    blobs.push({
      x: random(width),
      y: random(height),
      size: random(50, 120),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.2, 0.2),
      color: [
        random(180, 255),
        random(100, 200),
        random(60, 140),
        230
      ],
      offset: random(TWO_PI),
      viscosity: random(0.96, 0.995),
      elasticity: random(0.05, 0.2),
      striation: []
    });
  }
  
  // Create a transparent vessel
  vessel = createGraphics(width, height);
  vessel.noStroke();
  vessel.fill(255, 30);
  vessel.rect(0, 0, width, height);
  
  // Initialize striations for each blob
  for (let i = 0; i < blobs.length; i++) {
    let b = blobs[i];
    for (let j = 0; j < 5; j++) {
      b.striation.push({
        angle: random(TWO_PI),
        length: random(20, 60),
        width: random(1, 3)
      });
    }
  }
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
    let noiseFactor = 0.005;
    b.speedX += map(noise(b.x * noiseFactor, b.y * noiseFactor, frameCount * 0.001), 0, 1, -0.1, 0.1);
    b.speedY += map(noise(b.x * noiseFactor, b.y * noiseFactor, frameCount * 0.001 + 1000), 0, 1, -0.1, 0.1);
    
    // Keep blobs within canvas bounds with soft bouncing
    if (b.x < 0 || b.x > width) {
      b.speedX *= -b.elasticity;
      b.x = constrain(b.x, 0, width);
    }
    if (b.y < 0 || b.y > height) {
      b.speedY *= -b.elasticity;
      b.y = constrain(b.y, 0, height);
    }
    
    // Draw blob with textural effect and striation
    drawStriatedBlob(b.x, b.y, b.size, b.color, b.striation);
  }
}

function drawStriatedBlob(x, y, size, baseColor, striations) {
  // Draw the main blob shape
  fill(baseColor);
  beginShape();
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI);
    let r = size/2 + noise(x * 0.01, y * 0.01, i * 0.5 + frameCount * 0.01) * size/4;
    let px = x + cos(angle) * r;
    let py = y + sin(angle) * r;
    vertex(px, py);
  }
  endShape(CLOSE);
  
  // Draw striations
  for (let i = 0; i < striations.length; i++) {
    let s = striations[i];
    let angle = s.angle + frameCount * 0.01;
    let px1 = x + cos(angle) * size/3;
    let py1 = y + sin(angle) * size/3;
    let px2 = x + cos(angle + PI) * (size/3 + s.length);
    let py2 = y + sin(angle + PI) * (size/3 + s.length);
    
    // Create gradient for striation
    let c1 = color(red(baseColor), green(baseColor), blue(baseColor), 100);
    let c2 = color(red(baseColor) + 50, green(baseColor) + 30, blue(baseColor) + 20, 50);
    
    // Draw a gradient line
    drawingContext.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    drawingContext.lineWidth = s.width;
    beginShape();
    vertex(px1, py1);
    vertex(px2, py2);
    endShape();
  }
  
  // Add subtle highlight for 3D effect
  fill(255, 120);
  ellipse(x - size/4, y - size/4, size/6);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Re-create vessel on resize
  vessel = createGraphics(width, height);
  vessel.noStroke();
  vessel.fill(255, 30);
  vessel.rect(0, 0, width, height);
}
