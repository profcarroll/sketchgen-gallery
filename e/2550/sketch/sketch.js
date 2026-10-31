let pulseAngle = 0;
let numWaveformPoints = 100;
let waveformY = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Pre-calculate waveform points for smooth animation
  for (let i = 0; i < numWaveformPoints; i++) {
    waveformY.push(height / 2);
  }
}

function draw() {
  background(20, 20, 50);
  
  drawWaveform();
  
  pulseAngle += 0.015;
}

function drawWaveform() {
  let waveformHeight = 120;
  let pulseIntensity = (sin(pulseAngle) + 1) / 2;
  
  // Update waveform positions
  for (let i = 0; i < numWaveformPoints; i++) {
    let wave = sin(map(i, 0, numWaveformPoints, 0, TWO_PI * 5) + pulseAngle * 10) * 30;
    let pulse = sin(map(i, 0, numWaveformPoints, 0, TWO_PI * 2) + pulseAngle * 2) * 20 * pulseIntensity;
    waveformY[i] = height / 2 + wave + pulse;
  }
  
  // Draw waveform path with flowing color
  stroke(255, 255, 255);
  strokeWeight(4);
  
  noFill();
  beginShape();
  for (let i = 0; i < numWaveformPoints; i++) {
    let x = map(i, 0, numWaveformPoints - 1, 0, width);
    let y = waveformY[i];
    
    // Color flows along the trace
    let hueVal = map(x, 0, width, 180, 280);
    stroke(hueVal, 180, 255);
    
    vertex(x, y);
  }
  endShape();
  
  // Draw trace particles following the waveform
  noStroke();
  for (let i = 0; i < 50; i++) {
    let offset = map(i, 0, 50, 0, TWO_PI);
    let index = floor(map(i, 0, 50, 0, numWaveformPoints - 1));
    
    if (index >= 0 && index < numWaveformPoints) {
      let x = map(index, 0, numWaveformPoints - 1, 0, width);
      let y = waveformY[index];
      
      // Particle pulse
      let sz = 6 + sin(pulseAngle + offset * 3) * 3;
      fill(255, 220, 100, 180);
      ellipse(x, y, sz);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
