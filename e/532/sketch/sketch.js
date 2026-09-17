let textLines = [];
let cursorVisible = true;
let lastCursorFlip = 0;
let font;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(16);
  textAlign(LEFT, TOP);
  noStroke();
  
  // Load a monospace font for terminal effect
  textFont('Courier New');
  
  // Pre-populate with some initial lines
  for (let i = 0; i < 30; i++) {
    textLines.push(generateRandomLine());
  }
}

function draw() {
  background(0);
  
  // Display the text lines
  let y = 10;
  for (let i = 0; i < textLines.length; i++) {
    fill(0, 255, 0); // Bright green text
    text(textLines[i], 10, y);
    y += 20;
  }
  
  // Blinking cursor at the end
  if (millis() - lastCursorFlip > 500) {
    cursorVisible = !cursorVisible;
    lastCursorFlip = millis();
  }
  
  if (cursorVisible) {
    fill(0, 255, 0);
    text("_", 10 + textWidth(textLines[textLines.length - 1]), y - 20);
  }
  
  // Add new lines periodically
  if (frameCount % 30 === 0) {
    textLines.push(generateRandomLine());
    
    // Keep only the last 50 lines to prevent memory issues
    if (textLines.length > 50) {
      textLines.shift();
    }
  }
}

function generateRandomLine() {
  const prefixes = ["DEBUG:", "INFO:", "ERROR:", "WARNING:", "TRACE:"];
  const words = [
    "processing", "calculating", "analyzing", "optimizing", "rendering",
    "initializing", "connecting", "transmitting", "receiving", "decrypting",
    "encrypting", "validating", "verifying", "compiling", "linking",
    "executing", "launching", "deploying", "monitoring", "logging"
  ];
  
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  
  let line = `${randomPrefix} ${randomWord}`;
  
  // Add some random numbers and symbols
  for (let i = 0; i < 3; i++) {
    if (Math.random() > 0.5) {
      line += ` ${Math.floor(Math.random() * 1000)}`;
    } else {
      line += ` ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}`;
    }
  }
  
  return line;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
