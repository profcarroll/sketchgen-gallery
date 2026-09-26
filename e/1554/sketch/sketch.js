let shapes = [];
let scanlineOffset = 0;
let titleCard;
let fontSize = 48;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create title card with blocky typography
  titleCard = createGraphics(width, height);
  titleCard.colorMode(HSB, 360, 100, 100, 1);
  titleCard.background(0, 0, 0);
  titleCard.fill(240, 100, 100); // Electric blue
  titleCard.textAlign(CENTER, CENTER);
  titleCard.textSize(fontSize);
  titleCard.text("NEON SIGNAL", 0, 0);
  
  // Initialize shapes with blocky geometric forms
  for (let i = 0; i < 80; i++) {
    shapes.push({
      x: random(width),
      y: random(height),
      size: random(15, 40),
      hue: random(360),
      speedX: random(-2, 2),
      speedY: random(-2, 2),
      pulse: random(TWO_PI),
      shapeType: floor(random(3)) // 0=rect, 1=circle, 2=diamond
    });
  }
}

function draw() {
  background(0, 0, 0);
  
  // Draw scanline effect
  scanlineOffset += 2;
  for (let y = 0; y < height; y += 4) {
    if ((y + scanlineOffset) % 16 < 8) {
      stroke(0, 0, 100, 0.1);
      line(0, y, width, y);
    }
  }
  
  // Draw abstract geometric shapes
  for (let shape of shapes) {
    // Pulsing effect
    let pulseSize = shape.size + sin(shape.pulse) * 15;
    shape.pulse += 0.1;
    
    // Color based on hue
    fill(shape.hue, 100, 100);
    noStroke();
    
    // Draw different shapes with blocky stylization
    push();
    translate(shape.x, shape.y);
    
    switch(shape.shapeType) {
      case 0: // Rectangle
        rectMode(CENTER);
        rect(0, 0, pulseSize, pulseSize);
        break;
      case 1: // Circle
        ellipse(0, 0, pulseSize);
        break;
      case 2: // Diamond
        rotate(PI/4);
        rectMode(CENTER);
        rect(0, 0, pulseSize, pulseSize);
        break;
    }
    
    pop();
    
    // Update positions
    shape.x += shape.speedX;
    shape.y += shape.speedY;
    
    // Bounce off edges with boundary correction
    if (shape.x > width + 20 || shape.x < -20) shape.speedX *= -1;
    if (shape.y > height + 20 || shape.y < -20) shape.speedY *= -1;
  }
  
  // Draw pulsing wireframe title card
  push();
  translate(width/2, height/2);
  rotate(frameCount * 0.015);
  stroke(240, 100, 100); // Electric blue wireframe
  noFill();
  rectMode(CENTER);
  rect(0, 0, width/3, height/3);
  pop();
  
  // Draw title card on top
  image(titleCard, width/2 - titleCard.width/2, height/2 - titleCard.height/2, width/3, height/3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
