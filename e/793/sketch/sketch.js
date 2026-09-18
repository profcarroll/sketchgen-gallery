let terminalText = [];
let commandBuffer = '';
let isTyping = false;
let glitchActive = false;
let glitchTimer = 0;
let cursorBlink = 0;

// Sample detective story lines
const storyLines = [
  "DETECTIVE TERMINAL v1.0",
  "SYSTEM INITIALIZED",
  "LOADING CASE FILES...",
  "CASE: MISSING INVESTIGATOR",
  "EVIDENCE FOUND: RED KEYCARD",
  "LOCATION: LABORATORY B2",
  "CLUE: FINGERPRINTS ON DOOR",
  "HINT: CHECK SECURITY LOGS",
  "EVIDENCE: VIDEO RECORDING",
  "WARNING: SYSTEM GLITCH DETECTED",
  "REBOOTING TERMINAL...",
  "NEW CLUE: UNIDENTIFIED VOICE",
  "CASE FILE CORRUPTED",
  "ACCESS GRANTED",
  "INVESTIGATION COMPLETE"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  
  // Initialize terminal with some text
  for (let i = 0; i < 10; i++) {
    terminalText.push({
      text: storyLines[i % storyLines.length],
      y: i * 20,
      opacity: 255
    });
  }
  
  textSize(16);
  textAlign(LEFT, TOP);
  noStroke();
}

function draw() {
  background(0);
  
  // Update glitch effect
  if (glitchActive) {
    glitchTimer--;
    if (glitchTimer <= 0) {
      glitchActive = false;
    }
    
    // Apply random glitch effects
    for (let i = 0; i < 5; i++) {
      let x = random(width);
      let y = random(height);
      let w = random(10, 50);
      let h = random(2, 10);
      fill(random(255), random(255), 0, 100);
      rect(x, y, w, h);
    }
  }
  
  // Update cursor blink
  cursorBlink++;
  
  // Draw terminal text with glow effect
  for (let i = 0; i < terminalText.length; i++) {
    let line = terminalText[i];
    fill(255, 200, 0, line.opacity); // Amber glow color
    
    if (i === terminalText.length - 1) {
      // Last line (input line)
      text(line.text + (cursorBlink % 60 < 30 ? '_' : ''), 10, line.y);
    } else {
      text(line.text, 10, line.y);
    }
    
    // Fade out old lines
    if (line.opacity > 0) {
      line.opacity -= 2;
    }
  }
  
  // Add new text occasionally to simulate output
  if (frameCount % 60 === 0 && terminalText.length < 30) {
    let newText = storyLines[Math.floor(random(storyLines.length))];
    terminalText.push({
      text: newText,
      y: (terminalText.length) * 20,
      opacity: 255
    });
    
    // Randomly trigger glitch effect
    if (random() < 0.1) {
      glitchActive = true;
      glitchTimer = 10;
    }
  }
  
  // Scroll text when needed
  if (terminalText.length > 20) {
    terminalText.shift();
  }
}

function mousePressed() {
  // Start typing on click
  isTyping = true;
  commandBuffer = '';
}

function keyPressed() {
  if (!isTyping) return;
  
  if (key === '\n') {
    // Process command
    terminalText.push({
      text: '> ' + commandBuffer,
      y: terminalText.length * 20,
      opacity: 255
    });
    
    // Simulate response based on command
    let response = "COMMAND RECOGNIZED";
    if (commandBuffer.includes('help')) {
      response = "AVAILABLE COMMANDS: help, search, examine, exit";
    } else if (commandBuffer.includes('search')) {
      response = "FOUND: CLUE IN LABORATORY B2";
    } else if (commandBuffer.includes('examine')) {
      response = "EVIDENCE: RED KEYCARD WITH FINGERPRINTS";
    }
    
    terminalText.push({
      text: response,
      y: terminalText.length * 20,
      opacity: 255
    });
    
    commandBuffer = '';
  } else if (key === BACKSPACE) {
    commandBuffer = commandBuffer.slice(0, -1);
  } else {
    commandBuffer += key;
  }
  
  // Update last line with current input
  if (terminalText.length > 0) {
    terminalText[terminalText.length - 1].text = '> ' + commandBuffer;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
