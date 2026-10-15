let waveYPositions = [];
let ridgeXPositions = [];
let ridgeYPositions = [];
const numWavePoints = 200;
const numRidges = 15;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 100);
  
  for (let i = 0; i < numWavePoints; i++) {
    let t = map(i, 0, numWavePoints - 1, 0, TWO_PI * 4);
    let baseY = height * 0.5 + sin(i * 0.3) * 30 + cos(i * 0.15) * 15;
    waveYPositions.push(baseY);
  }
  
  for (let r = 0; r < numRidges; r++) {
    let x = map(r, 0, numRidges - 1, -50, width + 50);
    let y = height * 0.3 + sin(map(r, 0, numRidges - 1, 0, TWO_PI * 2)) * 80;
    ridgeXPositions.push(x);
    ridgeYPositions.push(y);
  }
}

function draw() {
  background(25, 25, 70);
  
  strokeWeight(1.5);
  noFill();
  
  for (let r = 0; r < numRidges; r++) {
    let ix = ridgeXPositions[r];
    let yBase = ridgeYPositions[r];
    let hueVal = map(r, 0, numRidges - 1, 40, 180);
    
    beginShape();
    for (let i = 0; i < waveYPositions.length; i++) {
      let x = map(i, 0, waveYPositions.length - 1, -30, width + 30);
      let offset = sin(map(i, 0, waveYPositions.length - 1, 0, TWO_PI * 3)) * 20;
      let y = yBase + sin(x * 0.02 + r * 0.5) * 15 + offset * 0.3;
      stroke(hueVal + r * 0.5, 60, 90, 90);
      vertex(x, y);
    }
    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
