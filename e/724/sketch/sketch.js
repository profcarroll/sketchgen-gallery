let terminalText = [];
let glitchActive = false;
let glitchTimer = 0;
let commandIndex = 0;
let lastUpdate = 0;

const commands = [
  "INITIATING SYSTEM SCAN...",
  "ACCESSING SECURE DATABASE...",
  "LOCATING MISSING PERSONS FILE...",
  "ANALYZING CRIME SCENE DATA...",
  "RETRIEVING WITNESS STATEMENTS...",
  "DECRYPTING ENCRYPTED MESSAGE...",
  "CONNECTING TO MAINFRAME...",
  "SYSTEM ERROR DETECTED",
  "REBOOTING CORE PROTOCOLS...",
  "RETRIEVING CASE FILE #7429...",
  "ANALYZING FINGERPRINTS...",
  "ACCESSING CCTV FEEDS...",
  "TRANSMITTING DATA TO HEADQUARTERS...",
  "DETECTED UNUSUAL ACTIVITY",
  "SYSTEM OVERLOAD IN PROGRESS...",
  "REBOOT COMPLETE",
  "PROCEEDING WITH INVESTIGATION...",
  "FOUND LEAD ON SUSPECT...",
  "INVESTIGATING ALIBI...",
  "LOCATING LAST KNOWN LOCATION..."
];

const messages = [
  "A mysterious case has emerged.",
  "The victim was found in an abandoned warehouse.",
  "No signs of forced entry were detected.",
  "A strange symbol was carved into the wall.",
  "The symbol matches a pattern from previous cases.",
  "Our suspect is known to frequent the area.",
  "The crime scene was locked from the inside.",
  "Security footage shows a figure in a black hoodie.",
  "The time of death is estimated at 11:47 PM.",
  "No witnesses came forward.",
  "The case remains unsolved.",
  "Our investigation continues...",
  "More data is being analyzed.",
  "The suspect's identity is unknown.",
  "A breakthrough may be near."
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(16);
  textAlign(LEFT, TOP);
  fill(255, 204, 0); // Amber color
  noStroke();
  
  // Initialize with some text
  terminalText.push("SYSTEM READY");
  terminalText.push(">");
  
  lastUpdate = millis();
}

function draw() {
  background(0);
  
  // Draw terminal screen with amber glow effect
  fill(0, 255, 0, 10); // Greenish background with low opacity for glow
  rect(0, 0, width, height);
  
  // Draw terminal text
  let y = 20;
  for (let i = 0; i < terminalText.length; i++) {
    let textLine = terminalText[i];
    
    // Apply glitch effect occasionally
    if (glitchActive && i === terminalText.length - 1) {
      fill(255, 204, 0);
      textLine = glitchText(textLine);
    } else {
      fill(255, 204, 0);
    }
    
    text(textLine, 20, y);
    y += 20;
  }
  
  // Update the system
  if (millis() - lastUpdate > 1000) {
    updateSystem();
    lastUpdate = millis();
  }
}

function updateSystem() {
  // Add new command or message
  if (commandIndex < commands.length && random() > 0.3) {
    terminalText.push(commands[commandIndex]);
    commandIndex++;
  } else if (messages.length > 0 && random() > 0.7) {
    const msg = messages.splice(0, 1)[0];
    terminalText.push(msg);
  }
  
  // Add prompt
  terminalText.push(">");
  
  // Limit text lines to prevent memory issues
  if (terminalText.length > 50) {
    terminalText.shift();
  }
  
  // Occasionally trigger glitch effect
  if (random() > 0.9) {
    glitchActive = true;
    glitchTimer = millis();
  }
  
  if (glitchActive && millis() - glitchTimer > 200) {
    glitchActive = false;
  }
}

function glitchText(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    if (random() > 0.95) {
      // Replace with random character
      const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      result += chars.charAt(floor(random(chars.length)));
    } else {
      result += str[i];
    }
  }
  return result;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
