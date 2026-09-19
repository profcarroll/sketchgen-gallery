let keys = [];
let synth;
let fft;

function setup() {
  createCanvas(800, 200);
  noStroke();
  
  // Create keyboard keys
  for (let i = 0; i < 12; i++) {
    keys.push({
      x: i * (width / 12),
      y: 0,
      w: width / 12,
      h: height,
      color: color(random(100, 255), random(100, 255), random(100, 255)),
      note: noteFromIndex(i),
      glow: 0,
      isPressed: false
    });
  }
  
  // Setup audio
  synth = new p5.PolySynth();
  fft = new p5.FFT();
}

function draw() {
  background(20);
  
  // Draw keys
  for (let key of keys) {
    fill(key.color);
    rect(key.x, key.y, key.w, key.h);
    
    // Glow effect
    if (key.glow > 0) {
      noFill();
      stroke(255, 200);
      strokeWeight(key.glow);
      rect(key.x - key.glow/2, key.y - key.glow/2, key.w + key.glow, key.h + key.glow);
      key.glow -= 2;
    }
  }
  
  // Analyze audio for visual feedback
  let spectrum = fft.analyze();
  let bass = fft.getEnergy('bass');
  fill(bass, 100, 100);
  ellipse(width/2, height/2, bass*2, bass*2);
}

function mousePressed() {
  // Start audio on first interaction
  if (!getAudioContext().state || getAudioContext().state === 'suspended') {
    userStartAudio();
  }
  
  // Find clicked key
  for (let key of keys) {
    if (mouseX > key.x && mouseX < key.x + key.w) {
      key.isPressed = true;
      key.glow = 30;
      
      // Play note
      synth.play(key.note, 0.5, 0, 0.2);
      break;
    }
  }
}

function noteFromIndex(i) {
  const notes = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];
  return notes[i];
}
