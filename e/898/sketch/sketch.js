let terminalText = [];
let currentLine = 0;
let glitchActive = false;
let glitchTime = 0;
let commandHistory = [];
let inputBuffer = '';
let cursorVisible = true;
let cursorTimer = 0;

const storyLines = [
  "DETECTIVE LOG - CASE #7429",
  "Location: 123 Elm Street",
  "Date: 2023-11-15",
  "Time: 11:47 PM",
  "",
  "Victim: Margaret Thornfield",
  "Cause of Death: Poisoning",
  "Evidence: Broken teacup, white powder residue",
  "",
  "Initial Interview - Suspect: Robert Thornfield",
  "Statement: 'I was in the kitchen with my wife.'",
  "Alibi verified. No fingerprints found on teacup.",
  "",
  "SEARCHING FOR CLUES...",
  "",
  "[SYSTEM SCAN] Analyzing evidence...",
  "[ANALYZER] White powder identified as arsenic.",
  "[LOG] Victim's final words: 'The key is in the safe.'",
  "[LOG] Safe combination: 19-84-27",
  "",
  "PROCEEDING TO SAFE LOCATION...",
  "",
  "[SYSTEM ERROR] Access denied.",
  "[SYSTEM ERROR] Security override required.",
  "[SYSTEM ERROR] Unauthorized access detected.",
  "",
  "GLITCH DETECTED - SYSTEM MALFUNCTION",
  "WARNING: CRITICAL DATA INTEGRITY COMPROMISED",
  "CRITICAL FAILURE: TERMINAL CORE CORRUPTED",
  "REBOOTING SYSTEM...",
  "SYSTEM REBOOT COMPLETE",
  "[LOG] New evidence found: Hidden journal entry.",
  "[ENTRY] 'The poison was in the tea bag. I didn't know she'd drink it.'",
  "",
  "CASE SOLVED - SUSPECT IDENTIFIED"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(LEFT, TOP);
  textSize(16);
  fill(0, 255, 255);
  noStroke();
  
  // Initialize terminal text
  for (let i = 0; i < storyLines.length; i++) {
    terminalText.push({
      text: storyLines[i],
      glow: 0,
      y: i * 20
    });
  }
  
  // Start with first few lines visible
  currentLine = 3;
}

function draw() {
  background(0);
  
  // Draw terminal effect
  if (glitchActive) {
    drawGlitch();
  } else {
    drawTerminal();
  }
  
  // Update cursor
  cursorTimer++;
  if (cursorTimer > 30) {
    cursorVisible = !cursorVisible;
    cursorTimer = 0;
  }
}

function drawTerminal() {
  // Draw text lines
  for (let i = 0; i < min(currentLine, terminalText.length); i++) {
    const line = terminalText[i];
    fill(0, 255, 255, map(line.glow, 0, 1, 50, 255));
    
    // Draw with glow effect
    if (line.glow > 0) {
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = color(0, 255, 255);
    }
    
    text(line.text, 20, 20 + line.y);
    
    // Reset shadow
    drawingContext.shadowBlur = 0;
  }
  
  // Draw command input
  fill(0, 255, 255);
  text("> " + inputBuffer + (cursorVisible ? "_" : ""), 20, 20 + terminalText[currentLine - 1].y + 20);
}

function drawGlitch() {
  // Draw glitch effect
  glitchTime++;
  
  // Create tearing effect
  for (let y = 0; y < height; y += 5) {
    const offset = sin(frameCount * 0.1 + y * 0.02) * 10;
    const width = map(sin(y * 0.01), -1, 1, 0.8, 1.2);
    
    // Draw glitch lines
    fill(0, 255, 255, 100);
    rect(0, y, width * windowWidth + offset, 2);
  }
  
  // Draw corrupted text
  for (let i = 0; i < min(currentLine, terminalText.length); i++) {
    const line = terminalText[i];
    const glitchOffset = sin(frameCount * 0.1 + i) * 5;
    
    fill(0, 255, 255, map(line.glow, 0, 1, 50, 255));
    
    if (line.glow > 0) {
      drawingContext.shadowBlur = 10;
      drawingContext.shadowColor = color(0, 255, 255);
    }
    
    text(line.text, 20 + glitchOffset, 20 + line.y);
    drawingContext.shadowBlur = 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if (currentLine < terminalText.length) {
    currentLine++;
    
    // Add glow effect to new lines
    if (currentLine <= terminalText.length) {
      terminalText[currentLine - 1].glow = 1;
    }
    
    // Check for glitch condition
    if (terminalText[currentLine - 1].text.includes("GLITCH DETECTED")) {
      glitchActive = true;
      glitchTime = 0;
    }
    
    // Add to command history
    if (inputBuffer.length > 0) {
      commandHistory.push(inputBuffer);
      inputBuffer = '';
    }
  } else {
    // If we've reached the end, start over
    currentLine = 0;
    glitchActive = false;
    for (let i = 0; i < terminalText.length; i++) {
      terminalText[i].glow = 0;
    }
  }
}

function keyPressed() {
  if (key === 'Enter') {
    // Process command
    if (inputBuffer.length > 0) {
      commandHistory.push(inputBuffer);
      inputBuffer = '';
    }
    
    // Move to next line
    if (currentLine < terminalText.length) {
      currentLine++;
      if (currentLine <= terminalText.length) {
        terminalText[currentLine - 1].glow = 1;
      }
      
      // Check for glitch condition
      if (terminalText[currentLine - 1].text.includes("GLITCH DETECTED")) {
        glitchActive = true;
        glitchTime = 0;
      }
    }
  } else if (key === 'Backspace') {
    inputBuffer = inputBuffer.slice(0, -1);
  } else if (key.length === 1) {
    inputBuffer += key;
  }
}
