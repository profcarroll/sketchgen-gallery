let typingText = "The quick brown fox jumps over the lazy dog. ";
let currentIndex = 0;
let typingSpeed = 500; // milliseconds per character
let lastTime = 0;
let startTime = 0;
let paperWarp = 0;
let warpDirection = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  textSize(24);
  textAlign(LEFT, TOP);
  startTime = millis();
}

function draw() {
  // Simulate paper warping effect
  paperWarp += 0.02 * warpDirection;
  if (paperWarp > 1 || paperWarp < -1) {
    warpDirection *= -1;
  }

  // Typing animation
  if (millis() - lastTime > typingSpeed) {
    if (currentIndex < typingText.length) {
      // Draw the character with subtle paper warping
      fill(0);
      noStroke();
      
      // Apply warping effect to character position
      let x = 50 + (currentIndex % 20) * 15;
      let y = 50 + floor(currentIndex / 20) * 30 + paperWarp * 5;
      
      text(typingText[currentIndex], x, y);
      
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
