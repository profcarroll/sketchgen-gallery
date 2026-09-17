let terminalText = [];
let currentLine = 0;
let isTyping = false;
let typingIndex = 0;
let lastClickTime = 0;
let commandHistory = [];

// Text content for the terminal
const storyContent = [
  "SYSTEM BOOT SEQUENCE INITIATED",
  "LOADING SECURITY PROTOCOLS...",
  "ACCESS GRANTED TO SECRET DATABASE",
  "",
  "DETECTIVE CASE FILE: 'THE VANISHING ARTIST'",
  "CASE STATUS: ACTIVE",
  "",
  "EVIDENCE FOUND:",
  "1. Cryptic message on canvas",
  "2. Unusual paint residue",
  "3. Missing gallery key",
  "",
  "COMMAND: 'INVESTIGATE MESSAGE'",
  "ANALYZING CRYPTOGRAPHIC SIGNATURE...",
  "DETECTED: BASE64 ENCODED TEXT",
  "",
  "DECODED MESSAGE:",
  "U2VjcmV0IGluZm9ybWF0aW9uIGFib3V0IHRoZSBhcnRpc3Qg",
  "d2hvIG15c3RlcmlvdXNseSBkaWQgbm90IGJlIGFibGUgdG8g",
  "Y29udGludWUu",
  "",
  "COMMAND: 'DECODE MESSAGE'",
  "DECRYPTING...",
  "DECRYPTED TEXT:",
  "'Secret information about the artist who mysteriously did not be able to continue.'",
  "",
  "COMMAND: 'REVEAL CLUE'",
  "CLUE #1: The artist's final painting was hidden in a room with no windows.",
  "CLUE #2: The key to the room was never found.",
  "CLUE #3: The gallery staff reported seeing a shadow at 11:47 PM.",
  "",
  "COMMAND: 'SEARCH ROOM'",
  "SCANNING ROOM...",
  "FOUND: Hidden compartment behind painting",
  "CONTENTS: Journal and another encrypted message",
  "",
  "COMMAND: 'READ JOURNAL'",
  "PAGE 1:",
  "'I was the only one who saw him disappear. I tried to call for help but no one heard me.'",
  "",
  "COMMAND: 'ANALYZE ROOM'",
  "ROOM SCAN COMPLETE",
  "FOUND: Footprints leading to a vent",
  "VENT LOCATION: Gallery storage room",
  "",
  "COMMAND: 'INVESTIGATE VENT'",
  "TRACING FOOTPRINTS...",
  "FOOTPRINTS LEAD TO THE STORAGE ROOM",
  "THE ARTIST'S DISAPPEARANCE WAS NOT AN ACCIDENT",
  "",
  "COMMAND: 'REVEAL SUSPECT'",
  "SUSPECT IDENTIFIED:",
  "Gallery Security Guard - MR. JAMES WILSON",
  "",
  "CASE CLOSED: THE ARTIST WAS TAKEN BY THE SECURITY GUARD.",
  "EVIDENCE: Journal entry, encrypted message, footprints, hidden compartment",
  "",
  "SYSTEM TERMINATED",
  "RETURNING TO MAIN MENU"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textAlign(LEFT, TOP);
  textSize(14);
  fill(0, 255, 0); // Terminal green
  noLoop();
  
  // Initialize terminal text
  for (let i = 0; i < storyContent.length; i++) {
    terminalText.push({
      text: storyContent[i],
      y: i * 20,
      visible: false,
      opacity: 0
    });
  }
  
  // Start with first few lines visible
  for (let i = 0; i < 5; i++) {
    terminalText[i].visible = true;
    terminalText[i].opacity = 255;
  }
  
  // Add a prompt at the end
  terminalText.push({
    text: "> ",
    y: storyContent.length * 20,
    visible: true,
    opacity: 255
  });
}

function draw() {
  background(0);
  
  // Draw terminal text
  for (let i = 0; i < terminalText.length - 1; i++) {
    if (terminalText[i].visible) {
      fill(0, 255, 0, terminalText[i].opacity);
      text(terminalText[i].text, 10, terminalText[i].y);
    }
  }
  
  // Draw prompt
  fill(0, 255, 0, 255);
  text(terminalText[terminalText.length - 1].text, 10, terminalText[terminalText.length - 1].y);
}

function mousePressed() {
  // Prevent rapid clicks from interfering with typing
  if (millis() - lastClickTime < 300) return;
  lastClickTime = millis();
  
  // If we're still typing a line, finish it immediately
  if (isTyping) {
    isTyping = false;
    typingIndex = terminalText[currentLine].text.length;
    terminalText[currentLine].opacity = 255;
    currentLine++;
    
    // Show next lines
    for (let i = currentLine; i < Math.min(currentLine + 3, terminalText.length - 1); i++) {
      terminalText[i].visible = true;
      terminalText[i].opacity = 255;
    }
  } else {
    // Start typing the next line
    if (currentLine < terminalText.length - 1) {
      isTyping = true;
      typingIndex = 0;
      terminalText[currentLine].visible = true;
    }
  }
  
  redraw();
}

function typeNextLine() {
  if (isTyping && currentLine < terminalText.length - 1) {
    const line = terminalText[currentLine];
    if (typingIndex < line.text.length) {
      typingIndex++;
      line.opacity = map(typingIndex, 0, line.text.length, 0, 255);
    } else {
      isTyping = false;
      currentLine++;
      
      // Show next lines
      for (let i = currentLine; i < Math.min(currentLine + 3, terminalText.length - 1); i++) {
        terminalText[i].visible = true;
        terminalText[i].opacity = 255;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
