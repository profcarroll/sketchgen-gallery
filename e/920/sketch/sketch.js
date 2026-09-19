let mic;
let fft;
let waveform = [];
let isListening = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  fft = new p5.FFT(0.8, 1024);
  noLoop();
}

function draw() {
  background(0);
  
  if (!isListening) return;
  
  // Get waveform data
  let spectrum = fft.analyze();
  let waveform = fft.waveform();
  
  // Draw the luminous line
  stroke(255, 255, 255, 180);
  strokeWeight(3);
  noFill();
  
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height/2 - 100, height/2 + 100);
    curveVertex(x, y);
  }
  endShape();
  
  // Draw intensity-based glow effect
  stroke(255, 255, 255, 60);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height/2 - 150, height/2 + 150);
    curveVertex(x, y);
  }
  endShape();
}

function mousePressed() {
  if (!isListening) {
    userStartAudio();
    mic.start();
    fft.setInput(mic);
    isListening = true;
    loop();
  }
}
