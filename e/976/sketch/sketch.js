let oscillator;
let analyzer;
let mic;
let isPlaying = false;
let frequency = 440;
let amplitude = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Create audio context on first user interaction
  userStartAudio();
  
  // Set up analyzer for sound visualization
  analyzer = new p5.FFT(0.8, 32);
  analyzer.setInput(oscillator);
}

function draw() {
  background(0, 0, 10);
  
  if (!isPlaying) {
    // Display initial message
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Click to start sound", width/2, height/2);
    return;
  }
  
  // Update frequency and amplitude based on mouse position
  if (mouseX > 0 && mouseX < width) {
    frequency = map(mouseX, 0, width, 100, 1000);
  }
  
  if (mouseY > 0 && mouseY < height) {
    amplitude = map(mouseY, 0, height, 0, 1);
  }
  
  // Update oscillator
  if (oscillator) {
    oscillator.freq(frequency);
    oscillator.amp(amplitude);
  }
  
  // Visualize sound
  let waveform = analyzer.waveform();
  
  // Draw frequency text
  fill(255);
  textAlign(CENTER, TOP);
  textSize(64);
  text(`${Math.round(frequency)} Hz`, width/2, 50);
  
  // Draw waveform
  noFill();
  stroke(255, 80, 100);
  strokeWeight(3);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height/2 - 100, height/2 + 100);
    vertex(x, y);
  }
  endShape();
  
  // Draw amplitude effect
  stroke(255, 80, 100, 0.3);
  strokeWeight(1);
  for (let i = 0; i < 20; i++) {
    let r = map(i, 0, 20, 100, 200);
    ellipse(width/2, height/2, r + amplitude * 100, r + amplitude * 100);
  }
}

function mousePressed() {
  if (!isPlaying) {
    isPlaying = true;
    
    // Create oscillator
    oscillator = new p5.Oscillator();
    oscillator.setType('sine');
    oscillator.freq(frequency);
    oscillator.amp(amplitude);
    oscillator.start();
  }
}
