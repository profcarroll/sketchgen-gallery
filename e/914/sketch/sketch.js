let osc, fft, analyzer;
let isPlaying = false;
let wavePattern = [];
let meterLevel = 0;
let frequency = 440;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Setup audio
  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(frequency);
  osc.amp(0);
  osc.start();
  
  fft = new p5.FFT(0.8, 64);
  analyzer = new p5.Amplitude();
  
  // Initialize wave pattern
  for (let i = 0; i < width; i += 5) {
    wavePattern.push(0);
  }
}

function draw() {
  background(0, 0, 10);
  
  if (!isPlaying) {
    // Show initial state
    fill(200, 50, 80);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24);
    text('Click to start', width/2, height/2);
    return;
  }
  
  // Update oscillator based on mouse position
  if (mouseY > 0 && mouseY < height) {
    frequency = map(mouseY, 0, height, 100, 1000);
    osc.freq(frequency);
  }
  
  if (mouseX > 0 && mouseX < width) {
    let volume = map(mouseX, 0, width, 0, 0.5);
    osc.amp(volume);
  }
  
  // Get audio data for visualization
  let spectrum = fft.analyze();
  meterLevel = analyzer.getLevel();
  
  // Update wave pattern
  for (let i = 0; i < wavePattern.length; i++) {
    wavePattern[i] = map(spectrum[i], 0, 255, -50, 50);
  }
  
  // Draw sound waves
  stroke(200, 80, 90);
  strokeWeight(2);
  noFill();
  
  beginShape();
  for (let i = 0; i < wavePattern.length; i++) {
    let x = i * 5;
    let y = height/2 + wavePattern[i];
    vertex(x, y);
  }
  endShape();
  
  // Draw visual meter
  fill(100, 80, 90);
  noStroke();
  rect(10, 10, 20, -meterLevel * 100);
  
  // Draw frequency indicator
  fill(200, 80, 90);
  textSize(16);
  text(`Freq: ${Math.round(frequency)} Hz`, 10, height - 20);
  text(`Vol: ${Math.round(meterLevel * 100)}%`, 10, height - 40);
}

function mousePressed() {
  if (!isPlaying) {
    userStartAudio();
    isPlaying = true;
  }
}
