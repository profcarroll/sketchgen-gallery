let audio;
let amplitude;
let waveform = [];

function setup() {
  createCanvas(400, 400);
  audio = new p5.AudioIn();
  amplitude = new p5.Amplitude();
  amplitude.setInput(audio);
  
  // Generate base EKG waveform pattern
  generateEKG();
}

function generateEKG() {
  waveform = [];
  let sampleRate = 100;
  for (let t = 0; t < 1000; t++) {
    let y = 200;
    let phase = (t % 100) / 100;
    
    // Create EKG pattern
    if (phase < 0.1) {
      y = 180 + 20 * sin(TWO_PI * phase * 10);
    } else if (phase < 0.2) {
      y = 180 + 20 * sin(TWO_PI * phase * 10);
    } else if (phase < 0.3) {
      y = 180 + 20 * sin(TWO_PI * phase * 10);
    } else if (phase < 0.4) {
      y = 200 - 20 * (phase - 0.3) * 10;
    } else if (phase < 0.5) {
      y = 120 + 40 * sin(TWO_PI * (phase - 0.4) * 5);
    } else if (phase < 0.6) {
      y = 160 + 20 * sin(TWO_PI * (phase - 0.5) * 5);
    } else {
      y = 200;
    }
    waveform.push(y);
  }
}

function draw() {
  // Deep indigo background
  background(25, 25, 70);
  
  // Get audio amplitude
  let amp = amplitude.getLevel();
  
  // Draw EKG waveform
  stroke(255);
  strokeWeight(2);
  noFill();
  
  let waveLen = waveform.length;
  let xStep = width / 4;
  
  for (let i = 0; i < 4; i++) {
    let offset = frameCount * 0.5 + i * 25;
    beginShape();
    for (let x = 0; x <= width; x += 2) {
      let t = (x + offset) % waveLen;
      let idx = floor(t) % waveLen;
      let y = waveform[idx];
      let oscillation = amp * 30 * sin(TWO_PI * (x + frameCount * 0.1) / 20);
      vertex(x, y + oscillation);
    }
    endShape();
  }
}

function mousePressed() {
  userStartAudio();
  audio.start();
  amplitude.setInput(audio);
}
