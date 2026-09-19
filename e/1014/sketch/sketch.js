let osc, fft, amp;
let waveform = [];
let freqValue = 0;

function setup() {
  createCanvas(400, 400);
  noFill();
  strokeWeight(2);
  
  // Initialize audio
  osc = new p5.Oscillator();
  osc.setType('sine');
  osc.freq(440);
  osc.amp(0);
  osc.start();
  
  fft = new p5.FFT(0.8, 1024);
  amp = new p5.Amplitude();
  
  // Initialize waveform array
  for (let i = 0; i < 100; i++) {
    waveform[i] = 0;
  }
}

function draw() {
  background(0);
  
  // Get amplitude and frequency data
  let vol = amp.getLevel();
  let spectrum = fft.analyze();
  
  // Map cursor position to frequency and volume
  let freq = map(mouseX, 0, width, 100, 800);
  let volume = map(mouseY, height, 0, 0, 0.5);
  
  osc.freq(freq);
  osc.amp(volume);
  
  // Update waveform with spectrum data
  for (let i = 0; i < waveform.length; i++) {
    waveform[i] = map(spectrum[i], 0, 255, -100, 100);
  }
  
  // Draw waveform
  stroke(map(freq, 100, 800, 0, 255), 100, 200);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = height/2 + waveform[i];
    vertex(x, y);
  }
  endShape();
  
  // Display frequency value
  textSize(16);
  fill(map(freq, 100, 800, 0, 255), 100, 200);
  textAlign(CENTER);
  text(`Frequency: ${Math.round(freq)} Hz`, width/2, 30);
}

function mousePressed() {
  userStartAudio();
}
