let strings = [];
let frets = [];
let audioContext;
let oscillator;
let gainNode;
let isPlaying = false;
let lastX = -1;
let lastY = -1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();

  // Create guitar strings and frets
  const stringCount = 6;
  const fretCount = 12;
  const stringSpacing = height / (stringCount + 1);
  const fretSpacing = width / (fretCount + 1);

  for (let i = 0; i < stringCount; i++) {
    strings.push({
      y: stringSpacing * (i + 1),
      x: 0,
      length: width
    });
  }

  for (let i = 0; i < fretCount; i++) {
    frets.push({
      x: fretSpacing * (i + 1)
    });
  }

  // Initialize audio context on first user interaction
  mousePressed = function() {
    if (!audioContext) {
      audioContext = getAudioContext();
      audioContext.resume();
      isPlaying = true;
      loop();
    }
  };
}

function draw() {
  background(240);

  // Draw fretboard
  stroke(100);
  strokeWeight(2);
  fill(255);
  rect(0, 0, width, height);

  // Draw frets
  for (let i = 0; i < frets.length; i++) {
    line(frets[i].x, 0, frets[i].x, height);
  }

  // Draw strings
  strokeWeight(1);
  for (let i = 0; i < strings.length; i++) {
    line(strings[i].x, strings[i].y, strings[i].x + strings[i].length, strings[i].y);
  }

  // Draw fret markers
  fill(200);
  noStroke();
  for (let i = 0; i < frets.length; i++) {
    if (i === 3 || i === 5 || i === 7 || i === 9) {
      ellipse(frets[i].x, height / 2, 10, 10);
    }
  }

  // Draw string vibration effect
  if (lastX !== -1 && lastY !== -1) {
    stroke(255, 0, 0);
    strokeWeight(3);
    line(lastX, lastY, mouseX, mouseY);
    noStroke();
    fill(255, 0, 0);
    ellipse(mouseX, mouseY, 10, 10);
  }
}

function mouseDragged() {
  if (!isPlaying) return;

  // Find which string was dragged over
  for (let i = 0; i < strings.length; i++) {
    const str = strings[i];
    const distance = abs(mouseY - str.y);
    if (distance < 20) {
      // Play note based on string and position
      playNote(i, mouseX);
      break;
    }
  }

  lastX = mouseX;
  lastY = mouseY;

  redraw();
}

function mousePressed() {
  if (!audioContext) {
    audioContext = getAudioContext();
    audioContext.resume();
    isPlaying = true;
    loop();
  }
}

function playNote(stringIndex, position) {
  // Map position to fret number
  const fretCount = frets.length;
  let fretNumber = Math.floor((position / width) * fretCount);

  // Ensure valid fret number
  fretNumber = constrain(fretNumber, 0, fretCount - 1);

  // Frequencies for standard tuning (E2, A2, D3, G3, B3, E4)
  const frequencies = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63];
  const baseFreq = frequencies[stringIndex];

  // Calculate note based on fret
  const noteFreq = baseFreq * pow(2, fretNumber / 12);

  // Create oscillator for sound
  if (oscillator) {
    oscillator.stop();
  }

  oscillator = new p5.Oscillator('sine');
  oscillator.freq(noteFreq);
  oscillator.amp(0.3);
  oscillator.start();

  // Add a quick fade out to prevent click sounds
  oscillator.amp(0, 0.1);
}
