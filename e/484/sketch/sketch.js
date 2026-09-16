let bands = [];
let time = 0;
const numBands = 8;
const waveHeight = 30;

function setup() {
  createCanvas(600, 400);
  for (let i = 0; i < numBands; i++) {
    bands.push({
      y: height / numBands * i,
      color: color(20, 100 + i * 15, 180 - i * 10),
      speed: 0.005 + i * 0.001,
      amplitude: 5 + i * 2
    });
  }
}

function draw() {
  background(180, 220, 255);
  time += 0.02;

  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    const offset = sin(time * band.speed) * band.amplitude;
    
    fill(band.color);
    noStroke();
    
    // Draw a wave-like band
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      const y = band.y + offset + sin(x * 0.02 + time * band.speed) * 5;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }

  // Draw high water mark
  const highWaterY = height / 2 + sin(time * 0.03) * waveHeight;
  fill(0, 80, 150);
  noStroke();
  rect(0, highWaterY - 5, width, 10);

  // Draw some rocks
  fill(100);
  for (let i = 0; i < 20; i++) {
    const x = (time * 20 + i * 30) % width;
    const y = height - 20 + sin(time * 0.05 + i) * 10;
    ellipse(x, y, 10, 5);
  }
}
