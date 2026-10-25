let stitches = [];
let stripeHeight = 0;
const STITCH_HEIGHT = 20;
const PATTERN_WIDTH = 100;
const COLORS = [
  [255, 255, 255], // white
  [0, 0, 0],       // black
  [255, 0, 0],     // red
  [0, 0, 255]      // blue
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  
  // Initialize the bottom stripe
  stripeHeight = STITCH_HEIGHT;
  for (let i = 0; i < width / PATTERN_WIDTH; i++) {
    stitches.push({
      x: i * PATTERN_WIDTH,
      y: height - STITCH_HEIGHT,
      colorIndex: i % COLORS.length,
      active: true
    });
  }
}

function draw() {
  background(240);
  
  // Draw the growing fabric strip
  fill(255);
  noStroke();
  rect(0, height - stripeHeight, width, stripeHeight);
  
  // Update and draw stitches
  for (let i = 0; i < stitches.length; i++) {
    let stitch = stitches[i];
    
    if (stitch.active) {
      fill(COLORS[stitch.colorIndex][0], 
           COLORS[stitch.colorIndex][1], 
           COLORS[stitch.colorIndex][2]);
      
      // Draw the stitch as a rectangle
      rect(stitch.x, stitch.y, PATTERN_WIDTH, STITCH_HEIGHT);
    }
  }
  
  // Add new row of stitches at the bottom
  if (frameCount % 10 === 0) {
    stripeHeight += STITCH_HEIGHT;
    
    // Create new row
    let newRow = [];
    for (let i = 0; i < width / PATTERN_WIDTH; i++) {
      newRow.push({
        x: i * PATTERN_WIDTH,
        y: height - stripeHeight,
        colorIndex: (i + frameCount) % COLORS.length,
        active: true
      });
    }
    
    // Add new stitches to the array
    stitches = stitches.concat(newRow);
    
    // Keep only visible stitches
    if (stitches.length > 1000) {
      stitches = stitches.slice(stitches.length - 1000);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
