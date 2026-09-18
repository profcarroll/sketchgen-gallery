let textLines = [];
let currentIndex = 0;
let glitchActive = false;
let glitchTimer = 0;
let lastLineTime = 0;

// Narrative text content
const narrativeText = [
  "Detective Sarah Chen arrived at the crime scene just after midnight.",
  "The victim, Marcus Webb, was found slumped over his desk in the study.",
  "A single gunshot wound to the chest. No signs of forced entry.",
  "But something didn't add up...",
  "The gun was found in the drawer, locked and secured.",
  "Yet the safety was off.",
  "And there were no fingerprints on the weapon.",
  "Sarah's instincts told her this wasn't a suicide.",
  "She noticed a small piece of paper clutched in his hand.",
  "It read: 'The truth lies in the numbers.'",
  "A cryptic message that would become crucial.",
  "Sarah began examining the room for clues.",
  "On the desk, she found a calculator with a calculation still visible:",
  "342 × 789 = 269,538",
  "The numbers seemed random... until she realized...",
  "3 + 4 + 2 + 7 + 8 + 9 = 33",
  "And 2 + 6 + 9 + 5 + 3 + 8 = 23",
  "The sum of digits in the product.",
  "Suddenly, a glitch appeared on the screen.",
  "The numbers flickered and distorted.",
  "Sarah's pulse quickened as she realized what she'd found.",
  "The killer had used a mathematical cipher to hide their identity.",
  "But the evidence was clear now.",
  "There was no doubt anymore.",
  "The killer was someone who knew the victim intimately.",
  "Someone who had access to his personal calculator.",
  "And the final clue was hidden in plain sight.",
  "The last line of the report would reveal everything."
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(16);
  textAlign(LEFT, TOP);
  fill(0, 255, 255); // Cyan color for text
  noStroke();
  
  // Initialize with first line
  textLines.push({
    text: narrativeText[0],
    time: 0,
    y: 20
  });
  
  lastLineTime = millis();
}

function draw() {
  background(0);
  
  // Update glitch state based on climax moment
  if (currentIndex >= 17 && !glitchActive) {
    glitchActive = true;
    glitchTimer = millis();
  }
  
  // Handle glitch effect
  if (glitchActive) {
    if (millis() - glitchTimer > 200) {
      glitchActive = false;
    } else {
      // Apply glitch effect
      for (let i = 0; i < textLines.length; i++) {
        if (random() > 0.7) {
          const line = textLines[i];
          const originalText = line.text;
          line.text = originalText.split('').map(char => 
            random() > 0.9 ? String.fromCharCode(random(32, 126)) : char
          ).join('');
        }
      }
    }
  }
  
  // Add new lines at intervals
  if (millis() - lastLineTime > 150 && currentIndex < narrativeText.length - 1) {
    currentIndex++;
    textLines.push({
      text: narrativeText[currentIndex],
      time: millis(),
      y: 20 + (textLines.length * 20)
    });
    
    // Remove old lines if too many
    if (textLines.length > 30) {
      textLines.shift();
    }
    
    lastLineTime = millis();
  }
  
  // Draw all lines with glow effect
  for (let i = 0; i < textLines.length; i++) {
    const line = textLines[i];
    fill(0, 255, 255);
    
    if (glitchActive && i === textLines.length - 1) {
      // Draw glitched line
      const glitchText = line.text.split('').map(char => 
        random() > 0.8 ? String.fromCharCode(random(32, 126)) : char
      ).join('');
      
      text(glitchText, 10, line.y);
    } else {
      // Draw normal line
      text(line.text, 10, line.y);
    }
  }
  
  // Reset glitch after it's done
  if (glitchActive && millis() - glitchTimer > 200) {
    glitchActive = false;
    // Restore original text for the last line
    if (textLines.length > 0) {
      const lastLine = textLines[textLines.length - 1];
      if (currentIndex >= 17) {
        lastLine.text = narrativeText[currentIndex];
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
