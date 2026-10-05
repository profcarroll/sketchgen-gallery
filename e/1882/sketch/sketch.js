let textStream = [];
let paperTexture;
let fontSize = 24;
let lineSpacing = 30;
let margin = 50;
let lastTime = 0;
let typingSpeed = 50;
let totalChars = 0;
let textContent = "The quick brown fox jumps over the lazy dog. ";
let charIndex = 0;
let paperWarps = [];
let fracturePoints = [];

class TypedChar {
  constructor(char, x, y, time) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.time = time;
    this.life = 1.0;
    this.warpAmount = random(0, 2);
    this.fiberPoints = [];
    
    // Create fiber points around the character
    for (let i = 0; i < 8; i++) {
      let angle = random(TWO_PI);
      let distance = random(5, 15);
      this.fiberPoints.push({
        x: this.x + cos(angle) * distance,
        y: this.y + sin(angle) * distance,
        originalX: this.x + cos(angle) * distance,
        originalY: this.y + sin(angle) * distance,
        life: 1.0
      });
    }
  }
  
  update() {
    this.life -= 0.01;
    
    // Update fiber points
    for (let point of this.fiberPoints) {
      point.life -= 0.02;
      if (point.life > 0) {
        // Add some movement to fibers
        let timeOffset = this.time * 0.01;
        point.x += sin(timeOffset + point.originalX * 0.01) * 0.5;
        point.y += cos(timeOffset + point.originalY * 0.01) * 0.5;
      }
    }
    
    return this.life > 0;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // Apply warping effect
    let warpX = sin(frameCount * 0.05 + this.time) * this.warpAmount;
    let warpY = cos(frameCount * 0.03 + this.time) * this.warpAmount;
    translate(warpX, warpY);
    
    fill(0, 180);
    noStroke();
    text(this.char, 0, 0);
    
    pop();
  }
  
  displayFibers() {
    // Draw fibers that peel away
    stroke(180, 160, 140);
    strokeWeight(0.5);
    
    for (let point of this.fiberPoints) {
      if (point.life > 0) {
        let alpha = map(point.life, 1, 0, 255, 0);
        stroke(180, 160, 140, alpha);
        line(this.x, this.y, point.x, point.y);
      }
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(fontSize);
  textAlign(LEFT, TOP);
  
  // Create paper texture
  paperTexture = createGraphics(width, height);
  paperTexture.background(245, 235, 220);
  paperTexture.noiseDetail(2, 0.5);
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let alpha = random(20, 60);
    paperTexture.fill(230, 220, 200, alpha);
    paperTexture.ellipse(x, y, random(1, 3));
  }
  
  // Start typing
  lastTime = millis();
}

function draw() {
  // Draw paper texture background
  image(paperTexture, 0, 0);
  
  // Add new characters
  if (millis() - lastTime > typingSpeed) {
    let char = textContent[charIndex % textContent.length];
    
    let x = margin + (totalChars % 20) * (fontSize + 2);
    let y = margin + floor(totalChars / 20) * lineSpacing;
    
    textStream.push(new TypedChar(char, x, y, millis()));
    totalChars++;
    charIndex++;
    
    // Occasionally add fracture points
    if (random() < 0.15) {
      fracturePoints.push({
        x: x + random(-10, 10),
        y: y + random(-10, 10),
        time: millis(),
        size: random(2, 8)
      });
    }
    
    lastTime = millis();
  }
  
  // Update and display characters
  for (let i = textStream.length - 1; i >= 0; i--) {
    if (!textStream[i].update()) {
      textStream.splice(i, 1);
    } else {
      textStream[i].displayFibers();
      textStream[i].display();
    }
  }
  
  // Draw fractures
  drawFractures();
  
  // Cap the number of points to prevent memory issues
  if (fracturePoints.length > 300) {
    fracturePoints.splice(0, 50);
  }
}

function drawFractures() {
  // Draw hairline fractures
  stroke(180, 160, 140);
  strokeWeight(0.5);
  
  for (let i = fracturePoints.length - 1; i >= 0; i--) {
    let f = fracturePoints[i];
    
    if (millis() - f.time < 5000) { // Fade out after 5 seconds
      let alpha = map(millis() - f.time, 0, 5000, 255, 0);
      stroke(180, 160, 140, alpha);
      
      // Draw a spiderweb-like fracture pattern
      beginShape();
      for (let j = 0; j < 12; j++) {
        let angle = map(j, 0, 11, 0, TWO_PI);
        let distance = f.size + sin(frameCount * 0.03 + i) * 2;
        let x = f.x + cos(angle) * distance;
        let y = f.y + sin(angle) * distance;
        vertex(x, y);
      }
      endShape(CLOSE);
    } else {
      fracturePoints.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
