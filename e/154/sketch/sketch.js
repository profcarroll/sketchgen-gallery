let blobs = [];
let cursorBlob;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create initial blobs
  for (let i = 0; i < 20; i++) {
    blobs.push({
      x: random(width),
      y: random(height),
      size: random(50, 200),
      speedX: random(-0.2, 0.2),
      speedY: random(-0.2, 0.2),
      hue: random(220, 280), // midnight blues and violets
      saturation: random(40, 70),
      brightness: random(10, 30),
      pulseSpeed: random(0.01, 0.03),
      pulsePhase: random(TWO_PI)
    });
  }
  
  cursorBlob = {
    x: width/2,
    y: height/2,
    size: 0,
    targetSize: 0,
    brightness: 0
  };
}

function draw() {
  // Deep background
  background(240, 10, 5);
  
  // Update and display blobs
  for (let blob of blobs) {
    // Move blob
    blob.x += blob.speedX;
    blob.y += blob.speedY;
    
    // Wrap around edges
    if (blob.x < -blob.size) blob.x = width + blob.size;
    if (blob.x > width + blob.size) blob.x = -blob.size;
    if (blob.y < -blob.size) blob.y = height + blob.size;
    if (blob.y > height + blob.size) blob.y = -blob.size;
    
    // Pulsing effect
    let pulse = sin(blob.pulsePhase) * 0.5 + 0.5;
    let currentSize = blob.size * (1 + pulse * 0.2);
    blob.pulsePhase += blob.pulseSpeed;
    
    // Draw blob with soft glow
    noStroke();
    fill(blob.hue, blob.saturation, blob.brightness * (0.3 + pulse * 0.7), 0.4);
    drawBlob(blob.x, blob.y, currentSize);
    
    // Add occasional neon flares
    if (frameCount % 120 === 0 && random() > 0.7) {
      let flareHue = random(330, 360); // neon pink
      if (random() > 0.5) flareHue = 120; // emerald green
      fill(flareHue, 80, 90, 0.8);
      drawBlob(blob.x, blob.y, currentSize * 1.5);
    }
  }
  
  // Cursor interaction
  if (cursorBlob.targetSize > 0) {
    cursorBlob.size += (cursorBlob.targetSize - cursorBlob.size) * 0.1;
    cursorBlob.brightness += (50 - cursorBlob.brightness) * 0.1;
    
    noStroke();
    fill(330, 80, cursorBlob.brightness, 0.6);
    drawBlob(cursorBlob.x, cursorBlob.y, cursorBlob.size);
    
    // Fade out
    if (cursorBlob.size > cursorBlob.targetSize * 0.95) {
      cursorBlob.targetSize = 0;
    }
  } else {
    cursorBlob.size *= 0.95;
    cursorBlob.brightness *= 0.95;
  }
}

function mouseMoved() {
  // Update cursor blob
  cursorBlob.x = mouseX;
  cursorBlob.y = mouseY;
  cursorBlob.targetSize = random(30, 80);
  cursorBlob.brightness = 50;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Draw a soft, nebulous blob
function drawBlob(x, y, size) {
  beginShape();
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI);
    let radius = size * (0.8 + noise(x * 0.01, y * 0.01, i) * 0.4);
    let px = x + cos(angle) * radius;
    let py = y + sin(angle) * radius;
    vertex(px, py);
  }
  endShape(CLOSE);
}
