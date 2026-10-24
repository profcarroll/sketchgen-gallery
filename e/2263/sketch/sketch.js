let waveYPositions = [];
let numWavePoints = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  
  // Pre-calculate wave positions for smooth EKG pattern
  for (let i = 0; i < numWavePoints; i++) {
    let t = map(i, 0, numWavePoints - 1, 0, TWO_PI * 4);
    let baseY = height * 0.5 + sin(i * 0.3) * 30 + cos(i * 0.15) * 15;
    waveYPositions.push(baseY);
  }
}

function draw() {
  // Deep indigo static background
  background(25, 25, 70);
  
  // Draw multiple EKG-style waveforms with varying hues
  strokeWeight(1.5);
  noFill();
  
  for (let wave = 0; wave < 3; wave++) {
    let yOffset = height * 0.3 + wave * 40;
    let hueVal = map(wave, 0, 2, 40, 180);
    
    beginShape();
    for (let i = 0; i < waveYPositions.length; i++) {
      let x = map(i, 0, waveYPositions.length - 1, -30, width + 30);
      let offset = sin(map(i, 0, waveYPositions.length - 1, 0, TWO_PI * 3)) * 20;
      let y = yOffset + sin(x * 0.02 + wave * 0.5) * 15 + offset * 0.3;
      stroke(hueVal + wave * 0.5, 60, 90, 90);
      vertex(x, y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
