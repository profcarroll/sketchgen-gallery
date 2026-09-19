let keys = [];
let audioContext;
let oscillator;
let gainNode;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Create piano keys
  const keyWidth = width / 52;
  let x = 0;
  
  for (let i = 0; i < 52; i++) {
    // Determine if key is white or black
    const isBlack = !(i % 7 === 0 || i % 7 === 2 || i % 7 === 4);
    
    if (isBlack) {
      keys.push({
        x: x - keyWidth * 0.25,
        y: height * 0.3,
        width: keyWidth * 0.5,
        height: height * 0.7,
        isWhite: false,
        depressed: false
      });
    } else {
      keys.push({
        x: x,
        y: 0,
        width: keyWidth,
        height: height,
        isWhite: true,
        depressed: false
      });
    }
    
    if (!isBlack) {
      x += keyWidth;
    } else {
      x += keyWidth * 0.75;
    }
  }
  
  // Setup audio context
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);
  gainNode.gain.value = 0;
}

function draw() {
  background(240);
  
  // Draw keys
  for (let key of keys) {
    if (key.isWhite) {
      fill(255);
      rect(key.x, key.y, key.width, key.height);
      
      // Draw black key shadow if depressed
      if (key.depressed) {
        fill(180);
        rect(key.x, key.y, key.width, key.height * 0.2);
      }
    } else {
      fill(0);
      rect(key.x, key.y, key.width, key.height);
      
      // Draw depressed black key
      if (key.depressed) {
        fill(80);
        rect(key.x, key.y, key.width, key.height * 0.25);
      }
    }
    
    // Draw key border
    stroke(200);
    rect(key.x, key.y, key.width, key.height);
  }
}

function mousePressed() {
  // Start audio context on first user gesture
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  // Find clicked key
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    
    if (mouseX > key.x && mouseX < key.x + key.width &&
        mouseY > key.y && mouseY < key.y + key.height) {
      
      // Play tone
      playTone(i);
      
      // Depress key visually
      key.depressed = true;
      
      // Reset after delay
      setTimeout(() => {
        key.depressed = false;
      }, 150);
      
      break;
    }
  }
}

function playTone(keyIndex) {
  // Create oscillator for this key
  const frequencies = [
    261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, // C4
    392.00, 415.30, 440.00, 466.16, 493.88, 523.25, 554.37, // D4
    587.33, 622.25, 659.25, 698.46, 739.99, 783.99, 830.61, // E4
    880.00, 932.33, 987.77, 1046.50, 1108.73, 1174.66, 1244.51, // F4
    1318.51, 1396.91, 1479.98, 1567.98, 1661.22, 1760.00, 1864.66, // G4
    1975.53, 2093.00, 2217.46, 2349.32, 2489.02, 2637.02, 2793.83, // A4
    2959.96, 3135.96, 3322.44, 3520.00, 3729.31, 3951.07, 4186.01 // B4
  ];
  
  const freq = frequencies[keyIndex % frequencies.length];
  
  oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.value = freq;
  oscillator.connect(gainNode);
  oscillator.start(0);
  
  // Fade out quickly to avoid clicking
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  
  oscillator.stop(audioContext.currentTime + 0.2);
}
