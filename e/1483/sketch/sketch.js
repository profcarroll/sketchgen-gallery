let typingText = "The quick brown fox jumps over the lazy dog. ";
let currentIndex = 0;
let typingSpeed = 500; // milliseconds per character
let lastTime = 0;
let startTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  textSize(24);
  textAlign(LEFT, TOP);
  startTime = millis();
}

function draw() {
  if (millis() - lastTime > typingSpeed) {
    if (currentIndex < typingText.length) {
      // Draw the character
      fill(0);
      noStroke();
      text(typingText[currentIndex], 50, 50 + (currentIndex * 25));
      
      currentIndex++;
      
      // Gradually increase speed (decrease typingSpeed)
      typingSpeed = max(50, 500 - (millis() - startTime) / 10);
    } else {
      // Reset after completing the text
      currentIndex = 0;
      typingSpeed = 500;
      startTime = millis();
    }
    
    lastTime = millis();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
