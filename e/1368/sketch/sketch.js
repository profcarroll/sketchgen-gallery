let bands = [];
let tideLevel = 0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create horizontal bands
  for (let i = 0; i < 20; i++) {
    bands.push({
      y: map(i, 0, 19, 0, height),
      height: height / 20,
      color: color(0, 100 + i * 5, 150 + i * 3, 200),
      phase: i * 0.2
    });
  }
}

function draw() {
  background(10, 20, 40);
  
  time += 0.01;
  
  // Draw the tide level indicator band (darker)
  const highTideY = height * 0.3;
  fill(0, 50, 100, 220);
  noStroke();
  rect(0, highTideY - 10, width, 20);
  
  // Draw the bands with sine wave motion
  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    
    // Calculate wave motion with phase offset
    const waveOffset = sin(time + band.phase) * 15;
    const currentY = band.y + waveOffset;
    
    // Make the high tide band darker
    if (abs(currentY - highTideY) < 20) {
      fill(0, 30, 70, 240);
    } else {
      fill(band.color);
    }
    
    rect(0, currentY, width, band.height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
