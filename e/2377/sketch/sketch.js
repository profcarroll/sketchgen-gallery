let waveHue = 200;
let pulseSpeed = 0.02;
let wavePoints = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  
  // Pre-calculate wave positions for smooth EKG pattern
  for (let i = 0; i < 200; i++) {
    let t = i / 200;
    wavePoints.push(t);
  }
}

function draw() {
  // Deep indigo static background
  background(25, 25, 70);
  
  // Calculate current wave offset based on pulse
  let waveOffset = sin(frameCount * pulseSpeed) * 0.5 + 0.5;
  
  // Draw the waveform - a continuous line across the canvas
  noFill();
  stroke(waveHue, 80, 90, 80);
  strokeWeight(3);
  
  beginShape();
  for (let i = 0; i < wavePoints.length; i++) {
    let t = map(i, 0, wavePoints.length - 1, 0, width);
    
    // Create EKG-like waveform pattern
    let baseY = height * 0.5;
    let waveform = sin(t * 0.02) * 30;
    let harmonic = sin(t * 0.08) * 15;
    let ekgPattern1 = sin(t * 0.04) > 0.5 ? 40 : 0;
    
    // Add distinctive EKG spikes
    if (sin(t * 0.02 + frameCount * 0.01) > 0.9) {
      ekgPattern1 = 50;
    }
    
    let y = baseY + waveform + harmonic + ekgPattern1 + (waveOffset * 20);
    vertex(t, y);
  }
  endShape();
  
  // Add pulsing circles along the wave
  noStroke();
  for (let i = 0; i < 20; i++) {
    let tIndex = floor(map(i, 0, 19, 0, wavePoints.length));
    let t = map(i, 0, 19, 0, width);
    let baseY = height * 0.5;
    let waveform = sin(t * 0.02) * 30;
    let harmonic = sin(t * 0.08) * 15;
    let y = baseY + waveform + harmonic + (waveOffset * 20);
    
    // Pulsing effect based on position and time
    let pulse = sin(frameCount * 0.03 + i * 0.2) * 0.5 + 0.5;
    let circleSize = 8 + pulse * 10;
    
    fill((waveHue + i * 10) % 360, 80, 90, 70);
    ellipse(t, y, circleSize);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // Change hue and pulse speed on click
  waveHue = (waveHue + random(50, 150)) % 360;
  pulseSpeed = random(0.01, 0.05);
}
