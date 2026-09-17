let terminalLines = [];
let inputLine = '';
let commandHistory = [];
let currentStoryIndex = 0;
let isTyping = false;
let typingText = '';
let charIndex = 0;
let lastCommandTime = 0;

// Detective story segments
const storySegments = [
  "SYSTEM: Initializing secure terminal...",
  "SECURITY PROTOCOL: ACCESS GRANTED",
  "DETECTIVE: Welcome to the case file.",
  "CASE FILE #427: The Vanishing Artist",
  "CLUE #1: Found at the scene - a single red rose.",
  "SYSTEM: Scanning for related files...",
  "DETECTIVE: The rose was not from any known garden.",
  "CLUE #2: Database shows no matches for this variety.",
  "SYSTEM: Searching hidden archives...",
  "DETECTIVE: This might be a signature item.",
  "CLUE #3: A note found in the artist's studio.",
  "NOTE: 'The colors of betrayal are always the same.'",
  "SYSTEM: Analyzing color patterns...",
  "DETECTIVE: Red, blue, and yellow mix to create purple.",
  "CLUE #4: The victim's last words were 'I know the truth.'",
  "SYSTEM: Cross-referencing with historical records...",
  "DETECTIVE: A pattern emerges - someone is trying to hide something.",
  "CLUE #5: The missing artist was last seen at a gallery.",
  "SYSTEM: Gallery security footage retrieved.",
  "DETECTIVE: The gallery's color scheme matches the crime scene.",
  "CLUE #6: A sketch found with unusual color combinations.",
  "SYSTEM: Analyzing artistic techniques...",
  "DETECTIVE: These colors were never used together before.",
  "CASE SUMMARY: The artist disappeared after creating a masterpiece.",
  "SYSTEM: File encryption detected. Decryption in progress...",
  "DETECTIVE: The final clue leads to the artist's hidden studio.",
  "SYSTEM: Accessing restricted area...",
  "CONCLUSION: The artist created a hidden message using color theory.",
  "SYSTEM: Case file closed. All evidence archived."
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  textSize(14);
  textAlign(LEFT, TOP);
  fill(255, 200, 0); // Amber color for text
  noStroke();
  
  // Initialize with first few lines
  terminalLines = [
    "TERMINAL v2.3.7",
    "TYPE 'HELP' FOR COMMANDS",
    "SYSTEM: READY",
    ""
  ];
  
  lastCommandTime = millis();
}

function draw() {
  background(0);
  
  // Draw terminal border with subtle glow
  stroke(255, 150, 0, 30);
  noFill();
  rect(10, 10, width - 20, height - 20, 10);
  
  // Draw terminal content
  let y = 20;
  for (let i = 0; i < terminalLines.length; i++) {
    if (i === terminalLines.length - 1) {
      fill(255, 200, 0); // Current line in amber
    } else {
      fill(200, 150, 0); // Previous lines in dimmer amber
    }
    
    text(terminalLines[i], 20, y);
    y += 20;
  }
  
  // Draw input prompt
  fill(255, 200, 0);
  text(">", 20, height - 40);
  text(inputLine, 35, height - 40);
  
  // Handle typing effect if needed
  if (isTyping && millis() - lastCommandTime > 50) {
    if (charIndex < typingText.length) {
      terminalLines[terminalLines.length - 1] += typingText.charAt(charIndex);
      charIndex++;
      lastCommandTime = millis();
    } else {
      isTyping = false;
    }
  }
}

function mousePressed() {
  // Only respond to clicks in the center of the canvas
  if (dist(mouseX, mouseY, width/2, height/2) < 100) {
    // Start typing a random story segment
    const segment = storySegments[currentStoryIndex];
    currentStoryIndex = (currentStoryIndex + 1) % storySegments.length;
    
    // Add new line to terminal
    if (terminalLines.length > 30) {
      terminalLines.shift(); // Remove oldest line
    }
    
    terminalLines.push(segment);
    
    // Start typing effect for the new line
    isTyping = true;
    typingText = segment;
    charIndex = 0;
    lastCommandTime = millis();
    
    // Add to command history
    commandHistory.push(segment);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === 'Enter') {
    // Process the command and add it to history
    if (inputLine.trim() !== '') {
      commandHistory.push(inputLine);
      if (terminalLines.length > 30) {
        terminalLines.shift();
      }
      terminalLines.push(`> ${inputLine}`);
      inputLine = '';
      
      // Add a response based on the command
      const response = generateResponse(inputLine);
      if (response) {
        if (terminalLines.length > 30) {
          terminalLines.shift();
        }
        terminalLines.push(response);
        
        // Start typing effect for the response
        isTyping = true;
        typingText = response;
        charIndex = 0;
        lastCommandTime = millis();
      }
    }
  } else if (key === 'Backspace') {
    inputLine = inputLine.slice(0, -1);
  } else if (key.length === 1) {
    inputLine += key;
  }
}

function generateResponse(command) {
  command = command.toLowerCase().trim();
  
  if (command.includes('help')) {
    return "COMMANDS: HELP, LOOK, INVESTIGATE, CLUES, SUMMARY";
  } else if (command.includes('look')) {
    return "You examine the scene. Nothing unusual catches your eye.";
  } else if (command.includes('investigate')) {
    return "You investigate further. A small note is found in the corner.";
  } else if (command.includes('clues')) {
    return "Available clues: Red rose, note with colors, gallery security.";
  } else if (command.includes('summary')) {
    return "The artist disappeared after creating a masterpiece using color theory.";
  }
  
  return "Command not recognized. Type 'HELP' for available commands.";
}
