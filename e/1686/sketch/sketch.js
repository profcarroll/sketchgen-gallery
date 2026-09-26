let bands = [];
let tideLevel = 0;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create horizontal bands with wave patterns
  for (let i = 0; i < 40; i++) {
    bands.push({
      y: map(i, 0, 39, 0, height),
      height: height / 40,
      color: color(0, 80 + i * 2, 140 + i, 200),
      phase: i * 0.1,
      speed: random(0.005, 0.02)
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
  rect(0, highTideY - 15, width, 30);
  
  // Draw the bands with wave patterns
  for (let i = 0; i < bands.length; i++) {
    const band = bands[i];
    
    // Calculate tide oscillation
    const tideOffset = sin(time * 0.2 + band.phase) * 15;
    
    // Calculate wave pattern effect
    const waveOffsetX = sin(time + i * 0.05) * 10;
    
    // Combine movements
    const currentY = band.y + tideOffset;
    
    // Make the high tide band darker
    if (abs(currentY - highTideY) < 30) {
      fill(0, 30, 70, 240);
    } else {
      fill(band.color);
    }
    
    // Draw with wave pattern displacement for rhythmic waves
    push();
    translate(waveOffsetX, 0);
    rect(0, currentY, width, band.height);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
