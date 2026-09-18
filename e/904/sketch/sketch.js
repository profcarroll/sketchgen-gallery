let bands = [];
const numBands = 20;
const bandHeight = 40;
const time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  
  // Initialize bands with varying properties
  for (let i = 0; i < numBands; i++) {
    bands.push({
      y: i * bandHeight + bandHeight / 2,
      amplitude: random(5, 15),
      frequency: random(0.01, 0.03),
      speed: random(0.005, 0.02),
      color: color(random(50, 200), random(100, 255), random(200, 255), 200),
      microEddies: []
    });
  }
  
  // Initialize micro-eddies for each band
  for (let i = 0; i < numBands; i++) {
    const band = bands[i];
    band.microEddies = [];
    const numEddies = floor(random(3, 8));
    for (let j = 0; j < numEddies; j++) {
      band.microEddies.push({
        x: random(width),
        size: random(5, 20),
        speed: random(0.01, 0.05),
        phase: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(10, 20, 40);
  
  const t = millis() * 0.001;
  
  for (let i = 0; i < numBands; i++) {
    const band = bands[i];
    
    // Update main oscillation
    const waveOffset = sin(t * band.speed + i * 0.5) * band.amplitude;
    
    // Draw main band with gradient
    fill(band.color);
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      const y = band.y + waveOffset + sin(x * band.frequency + t * band.speed) * 5;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
    
    // Draw micro-eddies
    for (let j = 0; j < band.microEddies.length; j++) {
      const eddy = band.microEddies[j];
      const eddyX = (eddy.x + sin(t * eddy.speed + eddy.phase) * 30) % width;
      const eddyY = band.y + waveOffset;
      
      fill(255, 150);
      ellipse(eddyX, eddyY, eddy.size);
    }
  }
  
  // Add some structure by drawing clear channels
  if (frameCount % 60 === 0) {
    const channelY = height * 0.7;
    fill(255, 30);
    rect(0, channelY - 10, width, 20);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
