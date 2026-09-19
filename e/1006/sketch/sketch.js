let pianoKeys = [];
let isAudioInitialized = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initializePiano();
}

function draw() {
  background(240);
  drawPiano();
  
  // Static display - no motion
  if (frameCount > 10) noLoop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initializePiano();
}

function initializePiano() {
  const whiteKeyWidth = width / 21;
  const whiteKeyHeight = height * 0.7;
  const blackKeyWidth = whiteKeyWidth * 0.6;
  const blackKeyHeight = whiteKeyHeight * 0.6;
  
  pianoKeys = [];
  
  // White keys
  for (let i = 0; i < 21; i++) {
    pianoKeys.push({
      x: i * whiteKeyWidth,
      y: height - whiteKeyHeight,
      width: whiteKeyWidth,
      height: whiteKeyHeight,
      isBlack: false,
      note: getNoteForWhiteKey(i),
      label: getKeyLabel(i)
    });
  }
  
  // Black keys
  const blackKeyPositions = [1, 3, 6, 8, 10];
  for (let i = 0; i < blackKeyPositions.length; i++) {
    pianoKeys.push({
      x: blackKeyPositions[i] * whiteKeyWidth - blackKeyWidth / 2,
      y: height - whiteKeyHeight * 0.7,
      width: blackKeyWidth,
      height: blackKeyHeight,
      isBlack: true,
      note: getNoteForBlackKey(i),
      label: ""
    });
  }
}

function drawPiano() {
  // Draw white keys
  for (let key of pianoKeys) {
    if (!key.isBlack) {
      fill(255);
      stroke(0);
      rect(key.x, key.y, key.width, key.height);
      
      // Draw key label
      if (key.label) {
        fill(0);
        textSize(16);
        textAlign(CENTER, TOP);
        text(key.label, key.x + key.width/2, key.y + key.height - 25);
      }
    }
  }
  
  // Draw black keys
  for (let key of pianoKeys) {
    if (key.isBlack) {
      fill(0);
      stroke(0);
      rect(key.x, key.y, key.width, key.height);
    }
  }
}

function getNoteForWhiteKey(i) {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  return notes[i % 7];
}

function getNoteForBlackKey(i) {
  const notes = ['C#', 'D#', 'F#', 'G#', 'A#'];
  return notes[i % 5];
}

function getKeyLabel(i) {
  const labels = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  return labels[i % 7];
}

function mousePressed() {
  if (!isAudioInitialized) {
    userStartAudio();
    isAudioInitialized = true;
  }
  
  // Find which key was pressed
  for (let key of pianoKeys) {
    if (mouseX > key.x && mouseX < key.x + key.width &&
        mouseY > key.y && mouseY < key.y + key.height) {
      
      // Play note with a simple oscillator
      const osc = new p5.Oscillator();
      osc.setType('sine');
      osc.freq(getFrequencyForKey(key.note));
      osc.amp(0.3);
      osc.start();
      
      // Stop after 0.5 seconds
      setTimeout(() => {
        osc.stop();
      }, 500);
      
      // Visual feedback - highlight the key
      fill(255, 255, 0); // Yellow highlight
      stroke(255, 255, 0);
      rect(key.x, key.y, key.width, key.height);
      
      if (key.label) {
        fill(0);
        textSize(16);
        textAlign(CENTER, TOP);
        text(key.label, key.x + key.width/2, key.y + key.height - 25);
      }
      
      break;
    }
  }
  
  return false; // Prevent default
}

function getFrequencyForKey(note) {
  const frequencies = {
    'C': 261.63,
    'C#': 277.18,
    'D': 293.66,
    'D#': 311.13,
    'E': 329.63,
    'F': 349.23,
    'F#': 369.99,
    'G': 392.00,
    'G#': 415.30,
    'A': 440.00,
    'A#': 466.16,
    'B': 493.88
  };
  
  return frequencies[note] || 440;
}
