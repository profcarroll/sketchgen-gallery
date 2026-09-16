let bands = [];
let highWaterLevel = 0;
let time = 0;

function setup() {
  createCanvas(800, 600);
  noStroke();
  
  // Create horizontal bands of color
  for (let i = 0; i < 20; i++) {
    bands.push({
      y: i * (height / 20),
      height: height / 20,
      color: color(
        map(i, 0, 20, 100, 255),
        map(i, 0, 20, 150, 200),
        map(i, 0, 20, 200, 255)
      ),
      offset: i * 0.3
    });
  }
}

function draw() {
  background(0);
  
  time += 0.01;
  
  // Update high water level with sine wave
  highWaterLevel = map(sin(time), -1, 1, height * 0.3, height * 0.7);
  
  // Draw bands with sine wave motion
  for (let i = 0; i < bands.length; i++) {
    let band = bands[i];
    
    // Calculate wave offset for this band
    let waveOffset = sin(time + band.offset) * 20;
    
    // Apply wave to band y position
    let y = band.y + waveOffset;
    
    // Draw the band
    fill(band.color);
    rect(0, y, width, band.height);
  }
  
  // Draw high water level band (darker)
  fill(0, 0, 0, 150);
  rect(0, highWaterLevel - 10, width, 20);
}
