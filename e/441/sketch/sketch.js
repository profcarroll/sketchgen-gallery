let bands = [];
const bandCount = 20;
const waveSpeed = 0.02;
let time = 0;

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  for (let i = 0; i < bandCount; i++) {
    bands.push({
      y: height * (i / bandCount),
      amplitude: random(5, 20),
      frequency: random(0.01, 0.03),
      speed: random(0.01, 0.03),
      color: color(20, 60, 180, 180 - i * 8)
    });
  }
}

function draw() {
  background(10, 20, 40);
  
  time += waveSpeed;
  
  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    
    // Create a sine wave that compresses and expands
    const waveOffset = sin(time * band.speed) * band.amplitude;
    const y = band.y + waveOffset;
    
    // Draw the water band
    fill(band.color);
    
    // Create a more complex, flowing shape
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      const wave = sin((x * band.frequency) + time * band.speed) * band.amplitude;
      const yVal = y + wave;
      vertex(x, yVal);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    
    // Draw a darker band for high water level
    if (i === Math.floor(bandCount / 2)) {
      fill(10, 30, 100);
      beginShape();
      for (let x = 0; x <= width; x += 10) {
        const wave = sin((x * band.frequency) + time * band.speed) * band.amplitude;
        const yVal = y + wave;
        vertex(x, yVal);
      }
      vertex(width, height);
      vertex(0, height);
      endShape(CLOSE);
    }
  }
}
