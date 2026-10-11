let amplitude = 0.5;
let hueValue = 0;
let wavePositions = [];
const numPoints = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  
  for (let i = 0; i < numPoints; i++) {
    wavePositions.push({
      t: map(i, 0, numPoints - 1, 0, TWO_PI * 3),
      baseY: height * 0.3 + sin(i * 0.2) * 20
    });
  }
}

function draw() {
  background(25, 25, 70);
  
  let time = millis() * 0.001;
  let waveIntensity = (sin(time) + 1) * 0.5;
  
  strokeWeight(3);
  beginShape();
  
  for (let i = 0; i < wavePositions.length; i++) {
    let p = wavePositions[i];
    let x = map(i, 0, numPoints - 1, -50, width + 50);
    let y = height * 0.5 + sin(p.t + time * 3) * 40 * waveIntensity + sin(time * 2 + i * 0.1) * 20;
    
    if (i === 0) {
      hueValue = map(x, -50, width + 50, 0, 255);
      stroke(hueValue, 80, 100);
    }
    
    vertex(x, y);
  }
  
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
