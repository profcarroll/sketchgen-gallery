let textStream = [];
let paperTexture;
let creasePoints = [];
let fontSize = 24;
let lineSpacing = 30;
let margin = 50;
let lastTime = 0;
let typingSpeed = 50;

class TypedChar {
  constructor(char, x, y, time) {
    this.char = char;
    this.x = x;
    this.y = y;
    this.time = time;
    this.life = 1.0;
    this.warpAmount = random(0, 2);
  }
  
  update() {
    this.life -= 0.01;
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
    let char = "The quick brown fox jumps over the lazy dog. ";
    let i = frameCount % char.length;
    
    let x = margin + (i % 20) * (fontSize + 2);
    let y = margin + floor(i / 20) * lineSpacing;
    
    textStream.push(new TypedChar(char[i], x, y, millis()));
    
    // Add crease effect
    creasePoints.push({x: x, y: y, time: millis()});
    
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
  
  // Cap the number of crease points to prevent memory issues
  if (creasePoints.length > 500) {
    creasePoints.splice(0, 100);
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
