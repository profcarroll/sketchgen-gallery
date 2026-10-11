let stains = [];
let newsprintTexture;
let noiseScale = 0.02;
let noiseStrength = 5;
let bloomSpeed = 0.5;
let dragStain = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create newsprint texture
  newsprintTexture = createGraphics(width, height);
  newsprintTexture.colorMode(HSB, 360, 100, 100, 1);
  for (let i = 0; i < width * height * 0.05; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(1, 3);
    newsprintTexture.noStroke();
    newsprintTexture.fill(0, 0, 0, 0.1);
    newsprintTexture.ellipse(x, y, size, size);
  }
  
  // Initialize stains
  for (let i = 0; i < 20; i++) {
    createStain();
  }
}

function draw() {
  // Draw background with newsprint texture
  image(newsprintTexture, 0, 0);
  
  // Update and display stains
  for (let i = stains.length - 1; i >= 0; i--) {
    let s = stains[i];
    
    // Animate stain
    s.radius += s.growthRate;
    s.alpha -= 0.005;
    
    // Draw stain
    noStroke();
    fill(s.hue, 100, 100, s.alpha);
    ellipse(s.x, s.y, s.radius * 2);
    
    // Add some organic motion to the stain
    s.x += sin(frameCount * 0.01 + s.id) * 0.5;
    s.y += cos(frameCount * 0.01 + s.id) * 0.5;
    
    // Remove old stains
    if (s.alpha <= 0 || s.radius > width * 2) {
      stains.splice(i, 1);
    }
  }
  
  // Occasionally create new stains
  if (frameCount % 30 === 0 && random() < 0.7) {
    createStain();
  }
  
  // Handle drag stain
  if (dragStain) {
    dragStain.radius += 2;
    dragStain.alpha = 1;
    noStroke();
    fill(dragStain.hue, 100, 100, dragStain.alpha);
    ellipse(dragStain.x, dragStain.y, dragStain.radius * 2);
    
    // Add to existing stains
    if (dragStain.radius > 50) {
      stains.push({
        x: dragStain.x,
        y: dragStain.y,
        radius: dragStain.radius,
        alpha: dragStain.alpha,
        hue: dragStain.hue,
        growthRate: random(1, 3),
        id: frameCount
      });
      dragStain = null;
    }
  }
}

function createStain() {
  stains.push({
    x: random(width),
    y: random(height),
    radius: random(5, 20),
    alpha: random(0.7, 1),
    hue: random(360),
    growthRate: random(0.5, 1.5),
    id: frameCount
  });
}

function mousePressed() {
  // Start a new stain at mouse position
  dragStain = {
    x: mouseX,
    y: mouseY,
    radius: 5,
    alpha: 1,
    hue: random(360)
  };
}

function mouseDragged() {
  if (dragStain) {
    dragStain.x = mouseX;
    dragStain.y = mouseY;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
