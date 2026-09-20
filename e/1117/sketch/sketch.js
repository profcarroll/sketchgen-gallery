let t = 0;
let pulseValue = 0;
let bgPhase = 0;
let ekgPoints = [];
const NUM_POINTS = 3;
let audioContext;

function setup() {
  createCanvas(400, 400);
  noStroke();
  
  // Generate EKG waveform points based on time
  for (let i = 0; i < 200; i++) {
    let y = 200 + sin(i * 0.1) * 30 + sin(i * 0.3) * 15;
    ekgPoints.push({ x: map(i, 0, 199, 0, width), y });
  }
}

function draw() {
  // Calculate pulse phase for background and wave color
  let pulsePhase = frameCount * 0.02;
  let pulse = (sin(pulsePhase) + 1) / 2; // 0 to 1
  
  // Background color shifts with pulse (cyan to magenta range)
  let bgR = map(pulse, 0, 1, 0, 255);
  let bgG = map(pulse, 0, 1, 150, 50);
  let bgB = map(pulse, 0, 1, 255, 0);
  background(bgR, bgG, bgB);
  
  // Add time-based motion
  t += 0.02;
  bgPhase += 0.015;
  
  // Calculate wave offset and color based on pulse
  let waveOffset = map(sin(t), -1, 1, 0, width);
  let waveColor = color(
    map(pulse, 0, 1, 255, 0),
    map(pulse, 0, 1, 50, 255),
    map(pulse, 0, 1, 0, 255)
  );
  
  // Draw EKG waveform
  noFill();
  stroke(waveColor);
  strokeWeight(3);
  beginShape();
  for (let pt of ekgPoints) {
    let y = pt.y + sin(t + pt.x * 0.01) * 5;
    let x = (pt.x + waveOffset + t * 20) % width;
    vertex(x, y);
  }
  endShape();
  
  // Draw pulsing circles synchronized with background
  let numCircles = 12;
  for (let i = 0; i < numCircles; i++) {
    let angle = map(i, 0, numCircles, 0, TWO_PI) + bgPhase * 2;
    let radius = 20 + sin(bgPhase * 3 + i) * 10;
    let cx = width / 2 + cos(angle) * 150;
    let cy = height / 2 + sin(angle) * 150;
    
    fill(waveColor);
    circle(cx, cy, radius * (0.5 + pulse));
  }
}

function mousePressed() {
  // Resume audio context on user gesture (for p5.sound if needed)
  if (typeof userStartAudio === 'function') {
    userStartAudio();
  }
}

// Required for frameCount to advance
function windowResized() {
  // Keep canvas responsive
}
