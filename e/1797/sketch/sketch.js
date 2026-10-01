let textStream = [];
let paperTexture;
let creasePoints = [];
let fracturePoints = [];
let fiberPoints = [];
let fontSize = 24;
let lineSpacing = 30;
let margin = 50;
let lastTime = 0;
let typingSpeed = 50;
let totalChars = 0;
let textContent = "The quick brown fox jumps over the lazy dog. ";
let charIndex = 0;

class TypedChar {
  constructor(char, x, y, time) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.time = time;
    this.life = 1.0;
    this.warpAmount = random(0, 2);
    this.fractureChance = random(0.3, 0.7);
    this.fiberOffset = [];
    // Initialize fiber points around this character
    for (let i = 0; i < 8; i++) {
      this.fiberOffset.push({
        angle: random(TWO_PI),
        distance: random(5, 15),
        life: 1.0,
        originalDistance: random(5, 15)
      });
    }
  }
  
  update() {
    this.life -= 0.01;
    // Update fiber points
    for (let i = 0; i < this.fiberOffset.length; i++) {
      this.fiberOffset[i].life -= 0.02;
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
    
    // Draw fiber points
    stroke(200, 180, 160);
    strokeWeight(0.5);
    for (let i = 0; i < this.fiberOffset.length; i++) {
      let offset = this.fiberOffset[i];
      if (offset.life > 0) {
        let x = cos(offset.angle) * offset.distance;
        let y = sin(offset.angle) * offset.distance;
        point(x, y);
      }
    }
    
    pop();
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
    
    // Add crease effect
    creasePoints.push({x: x, y: y, time: millis()});
    
    // Occasionally add fracture points
    if (random() < 0.1) {
      fracturePoints.push({
        x: x + random(-10, 10),
        y: y + random(-10, 10),
        time: millis(),
        size: random(2, 8)
      });
    }
    
    // Occasionally add fiber points
    if (random() < 0.3) {
      fiberPoints.push({
        x: x + random(-5, 5),
        y: y + random(-5, 5),
        time: millis(),
        life: 1.0,
        size: random(2, 6)
      });
    }
    
    lastTime = millis();
  }
  
  // Update and display characters
  for (let i = textStream.length - 1; i >= 0; i--) {
    if (!textStream[i].update()) {
      textStream.splice(i, 1);
    } else {
      textStream[i].display();
    }
  }
  
  // Apply permanent paper warping effect
  applyPaperWarp();
  
  // Draw fractures
  drawFractures();
  
  // Draw fiber fraying
  drawFiberFraying();
  
  // Cap the number of points to prevent memory issues
  if (creasePoints.length > 500) {
    creasePoints.splice(0, 100);
  }
  
  if (fracturePoints.length > 300) {
    fracturePoints.splice(0, 50);
  }
  
  if (fiberPoints.length > 500) {
    fiberPoints.splice(0, 100);
  }
}

function applyPaperWarp() {
  // Draw permanent creases from text stream
  stroke(200, 180, 160);
  noFill();
  
  for (let i = 0; i < creasePoints.length - 1; i++) {
    let p1 = creasePoints[i];
    let p2 = creasePoints[i + 1];
    
    if (millis() - p1.time < 3000) { // Fade out after 3 seconds
      let alpha = map(millis() - p1.time, 0, 3000, 255, 0);
      stroke(200, 180, 160, alpha);
      
      // Draw a ripple effect around the text position
      beginShape();
      for (let j = 0; j < 10; j++) {
        let angle = map(j, 0, 9, 0, TWO_PI);
        let distance = 5 + sin(frameCount * 0.05 + i) * 3;
        let x = p1.x + cos(angle) * distance;
        let y = p1.y + sin(angle) * distance;
        vertex(x, y);
      }
      endShape(CLOSE);
    }
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

function drawFiberFraying() {
  // Draw fraying fibers
  stroke(200, 180, 160);
  strokeWeight(0.3);
  
  for (let i = fiberPoints.length - 1; i >= 0; i--) {
    let f = fiberPoints[i];
    
    if (millis() - f.time < 4000) { // Fade out after 4 seconds
      let alpha = map(millis() - f.time, 0, 4000, 255, 0);
      stroke(200, 180, 160, alpha);
      
      // Draw a small line to simulate fiber fraying
      let angle = random(TWO_PI);
      let length = f.size * (1 - (millis() - f.time) / 4000);
      let endX = f.x + cos(angle) * length;
      let endY = f.y + sin(angle) * length;
      line(f.x, f.y, endX, endY);
      
      // Add some small points around to simulate fiber ends
      for (let j = 0; j < 3; j++) {
        let angle2 = random(TWO_PI);
        let length2 = random(1, 3) * (1 - (millis() - f.time) / 4000);
        let endX2 = f.x + cos(angle2) * length2;
        let endY2 = f.y + sin(angle2) * length2;
        point(endX2, endY2);
      }
    } else {
      fiberPoints.splice(i, 1);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
