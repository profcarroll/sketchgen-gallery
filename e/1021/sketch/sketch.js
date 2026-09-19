let audioContext;
let oscillator;
let gainNode;
let isPlaying = false;
let lastX = 0;
let lastY = 0;
let lastTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(240);
  drawFretboard();
}

function draw() {
  // Nothing to do here, all drawing happens in mouseDragged
}

function mousePressed() {
  userStartAudio();
  return false;
}

function mouseDragged() {
  const now = millis();
  const deltaTime = now - lastTime;
  
  if (deltaTime > 0) {
    // Calculate pitch based on vertical position and speed
    const pitch = map(mouseY, 0, height, 200, 800); // Lower = lower pitch
    const speed = dist(lastX, lastY, mouseX, mouseY) / deltaTime;
    
    // Play tone if moving fast enough
    if (speed > 5 && !isPlaying) {
      playTone(pitch);
      isPlaying = true;
    } else if (speed <= 5) {
      stopTone();
      isPlaying = false;
    }
    
    // Draw a line from last position to current position
    stroke(0, 100, 200);
    strokeWeight(3);
    line(lastX, lastY, mouseX, mouseY);
    
    // Draw a circle at current position for visual feedback
    noStroke();
    fill(0, 100, 200, 150);
    ellipse(mouseX, mouseY, 10, 10);
  }
  
  lastX = mouseX;
  lastY = mouseY;
  lastTime = now;
}

function playTone(frequency) {
  if (oscillator) {
    oscillator.stop();
  }
  
  oscillator = new p5.Oscillator();
  oscillator.setType('sine');
  oscillator.freq(frequency);
  oscillator.amp(0.3);
  oscillator.start();
}

function stopTone() {
  if (oscillator) {
    oscillator.stop();
  }
}

function drawFretboard() {
  // Draw a guitar fretboard
  background(240);
  
  // Fretboard background
  fill(139, 69, 19);
  rect(0, 0, width, height);
  
  // Fret lines
  stroke(100);
  strokeWeight(1);
  for (let i = 0; i < 12; i++) {
    line(width * i / 12, 0, width * i / 12, height);
  }
  
  // String lines
  stroke(255);
  strokeWeight(2);
  const stringSpacing = height / 6;
  for (let i = 0; i < 6; i++) {
    line(0, stringSpacing * i, width, stringSpacing * i);
  }
  
  // Fret markers
  fill(255);
  noStroke();
  const markerSpacing = width / 12;
  for (let fret = 3; fret < 12; fret += 5) {
    for (let string = 0; string < 6; string++) {
      const x = markerSpacing * fret;
      const y = stringSpacing * string + stringSpacing / 2;
      ellipse(x, y, 8, 8);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawFretboard();
}
