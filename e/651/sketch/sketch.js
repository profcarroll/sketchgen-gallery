let burnerPositions = [];
let heatPatterns = [];
let noiseScale = 0.02;
let noiseStrength = 5;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Define burner positions (circular stovetop)
  let radius = min(width, height) * 0.3;
  for (let i = 0; i < 4; i++) {
    let angle = TWO_PI * i / 4;
    burnerPositions.push(createVector(
      cos(angle) * radius,
      sin(angle) * radius
    ));
  }
  
  // Initialize heat patterns
  for (let i = 0; i < 100; i++) {
    heatPatterns.push({
      pos: createVector(random(width), random(height)),
      size: random(20, 100),
      speed: random(0.005, 0.02),
      hue: random(360),
      active: false
    });
  }
}

function draw() {
  background(0);
  
  // Draw countertop
  push();
  translate(0, 0, -100);
  rotateX(PI/2);
  fill(80, 10, 30);
  plane(width * 1.5, height * 1.5);
  pop();
  
  // Draw stovetop
  push();
  translate(0, 0, -50);
  rotateX(PI/2);
  fill(40, 20, 20);
  plane(width * 0.7, height * 0.7);
  pop();
  
  // Update and draw heat patterns
  for (let pattern of heatPatterns) {
    // Activate pattern if near active burner
    let isActive = false;
    for (let burner of burnerPositions) {
      let d = dist(pattern.pos.x, pattern.pos.y, burner.x, burner.y);
      if (d < 200) {
        isActive = true;
        pattern.active = true;
        pattern.hue += 1;
        if (pattern.hue > 360) pattern.hue = 0;
        break;
      }
    }
    
    if (!isActive && pattern.active) {
      pattern.active = false;
    }
    
    // Update position based on noise
    let nx = noise(pattern.pos.x * noiseScale, pattern.pos.y * noiseScale, frameCount * pattern.speed) - 0.5;
    let ny = noise(pattern.pos.x * noiseScale, pattern.pos.y * noiseScale + 1000, frameCount * pattern.speed) - 0.5;
    
    pattern.pos.x += nx * noiseStrength;
    pattern.pos.y += ny * noiseStrength;
    
    // Keep within bounds
    if (pattern.pos.x < 0) pattern.pos.x = width;
    if (pattern.pos.x > width) pattern.pos.x = 0;
    if (pattern.pos.y < 0) pattern.pos.y = height;
    if (pattern.pos.y > height) pattern.pos.y = 0;
    
    // Draw heat pattern
    if (pattern.active) {
      push();
      translate(pattern.pos.x - width/2, pattern.pos.y - height/2);
      
      noStroke();
      fill(pattern.hue, 80, 100, 0.3);
      
      beginShape(QUADS);
      vertex(-pattern.size/2, -pattern.size/2);
      vertex(pattern.size/2, -pattern.size/2);
      vertex(pattern.size/2, pattern.size/2);
      vertex(-pattern.size/2, pattern.size/2);
      endShape();
      
      pop();
    }
  }
  
  // Draw burners
  for (let burner of burnerPositions) {
    push();
    translate(burner.x, burner.y, -40);
    
    if (mouseX > width/2 - 100 && mouseX < width/2 + 100 &&
        mouseY > height/2 - 100 && mouseY < height/2 + 100) {
      // Make burners glow when mouse is near
      fill(30, 100, 100, 0.8);
    } else {
      fill(30, 100, 50, 0.6);
    }
    
    sphere(20);
    
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
