let bands = [];
const numBands = 8;
const waveSpeed = 0.02;
const waveAmplitude = 15;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize bands with varying properties
  for (let i = 0; i < numBands; i++) {
    bands.push({
      y: map(i, 0, numBands - 1, 0, height),
      color: color(
        map(i, 0, numBands - 1, 255, 100),
        map(i, 0, numBands - 1, 100, 200),
        map(i, 0, numBands - 1, 200, 50),
        200
      ),
      speed: random(0.01, 0.03),
      amplitude: random(5, 20),
      frequency: random(0.005, 0.02)
    });
  }
}

function draw() {
  background(0);
  // Draw each band with dynamic wave motion
  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    fill(band.color);
    noStroke();
    
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      // Create a complex wave pattern
      const waveY = sin(frameCount * band.speed + x * band.frequency) * band.amplitude;
      const noiseY = noise(x * 0.01, frameCount * 0.01) * waveAmplitude;
      
      vertex(x, band.y + waveY + noiseY);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
