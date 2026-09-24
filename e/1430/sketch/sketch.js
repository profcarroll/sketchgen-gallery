let terminalText = [];
let currentIndex = 0;
let glitchActive = false;
let glitchTimer = 0;
let fontSize = 16;
let font;

// Story segments - each represents a line of narrative text
const storySegments = [
  "SYSTEM INITIALIZATION COMPLETE",
  "DETECTIVE PROGRAM LOADING...",
  "ACCESSING DATABASE: CRIME_RECORDS",
  "RETRIEVING CASE FILE: CASE-7429",
  "EVIDENCE FOUND: BLOOD STAINED HANDKERCHIEF",
  "LOCATION: MUSEUM LOUNGE - 10:47 PM",
  "WITNESS STATEMENT: 'THE MAN IN THE BLACK COAT'",
  "SUSPECT IDENTIFIED: MR. VICTOR MORRISON",
  "ALIBI CONFIRMED: WENT TO BARTER'S BAR",
  "RETRIEVING SECURITY FOOTAGE...",
  "FOOTAGE SHOWS SUSPECT LEAVING MUSEUM",
  "TIME STAMP: 10:52 PM - 11:05 PM",
  "EVIDENCE ANALYSIS: FIBER MATCHES BARTER'S BAR",
  "RETRIEVING POLICE DATABASE...",
  "MR. MORRISON HAS PRIOR RECORDS",
  "HISTORICAL CRIMES: THEFT, ASSAULT, ARSON",
  "THE CASE IS NOW INCOMPLETE",
  "PROCEEDING TO NEXT CLUE...",
  "EVIDENCE FOUND: RECORDED VOICE",
  "VOICE ANALYSIS: 'I WILL NOT BE STOPPED'",
  "SUSPECT'S MOTHER CONFIRMS HE WAS AT HOME",
  "BUT SECURITY CAMERA SHOWS HIM LEAVING",
  "THE CASE IS NOW INCOMPLETE",
  "PROCEEDING TO NEXT CLUE...",
  "EVIDENCE FOUND: SIGNED LETTER",
  "LETTER CONTAINS DIRE WARNING",
  "RECIPIENT: 'TO WHOM IT MAY CONCERN'",
  "THE CASE IS NOW INCOMPLETE",
  "PROCEEDING TO FINAL CLUE...",
  "EVIDENCE FOUND: BLOOD TYPE MATCHES",
  "BLOOD TYPE O POSITIVE - SUSPECT'S TYPE",
  "CASE FILE COMPLETE: MR. MORRISON IS GUILTY",
  "PROCEEDING TO FINAL CONCLUSION...",
  "FINAL CONCLUSION: THE CASE IS SOLVED",
  "MR. MORRISON IS ARRESTED",
  "THE MUSEUM CASE IS NOW CLOSED"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  
  // Load font
  textSize(fontSize);
  textAlign(LEFT, TOP);
  
  // Initialize terminal text with first segment
  terminalText = [storySegments[0]];
}

function draw() {
  background(0);
  
  // Draw terminal screen
  fill(0, 20);
  noStroke();
  rect(0, 0, width, height);
  
  // Draw text
  fill(255, 200);
  textSize(fontSize);
  textAlign(LEFT, TOP);
  
  // Draw the current text
  let y = 20;
  for (let i = 0; i < terminalText.length; i++) {
    let line = terminalText[i];
    
    // Apply glitch effect to some lines
    if (glitchActive && i > terminalText.length - 5) {
      fill(255, 150);
      if (frameCount % 10 < 5) {
        // Draw with random offsets for glitch effect
        let offsetX = random(-3, 3);
        let offsetY = random(-3, 3);
        text(line, 20 + offsetX, y + offsetY);
      } else {
        text(line, 20, y);
      }
    } else {
      fill(255, 150);
      text(line, 20, y);
    }
    
    y += fontSize * 1.2;
  }
  
  // Update glitch timer
  if (glitchActive) {
    glitchTimer--;
    if (glitchTimer <= 0) {
      glitchActive = false;
    }
  }
}

function mousePressed() {
  // Only advance story on click, not on initial load
  if (currentIndex < storySegments.length - 1) {
    currentIndex++;
    
    // Add new line to terminal text
    terminalText.push(storySegments[currentIndex]);
    
    // Keep terminal screen from getting too long
    if (terminalText.length > 20) {
      terminalText.shift();
    }
    
    // Occasionally trigger glitch effect
    if (random() < 0.3) {
      glitchActive = true;
      glitchTimer = 30; // Duration of glitch effect
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
