let blobs = [];
const blobCount = 20;
const fluidColor = [100, 150, 200, 180]; // Semi-transparent blue fluid

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize blobs with random properties
  for (let i = 0; i < blobCount; i++) {
    blobs.push({
      x: random(width),
      y: random(height),
      size: random(20, 60),
      speedX: random(-0.5, 0.5),
      speedY: random(-0.3, 0.3),
      color: [
        random(200, 255),
        random(100, 200),
        random(50, 150),
        200
      ],
      offset: random(TWO_PI)
    });
  }
}

function draw() {
  // Create a fluid-like background with semi-transparent blue
  fill(fluidColor);
  rect(0, 0, width, height);
  
  // Update and display each blob
  for (let i = 0; i < blobs.length; i++) {
    let b = blobs[i];
    
    // Apply gentle floating motion using sine wave
    b.y += b.speedY + sin(frameCount * 0.01 + b.offset) * 0.2;
    b.x += b.speedX;
    
    // Keep blobs within canvas bounds with soft bouncing
    if (b.x < 0 || b.x > width) b.speedX *= -0.9;
    if (b.y < 0 || b.y > height) b.speedY *= -0.9;
    
    // Adjust position to keep within canvas
    b.x = constrain(b.x, 0, width);
    b.y = constrain(b.y, 0, height);
    
    // Draw blob with a soft glow effect
    fill(b.color);
    ellipse(b.x, b.y, b.size);
    
    // Add subtle highlight for 3D effect
    fill(255, 150);
    ellipse(b.x - b.size/4, b.y - b.size/4, b.size/3);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
