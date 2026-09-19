let stitches = [];
let stripeColors = [];
let stripeHeight = 20;
let totalRows = 30;
let currentRow = 0;

function setup() {
  createCanvas(400, 600);
  colorMode(HSB, 360, 100, 100, 1);
  
  // Define stripe colors
  stripeColors = [
    color(240, 80, 90), // Blue
    color(0, 80, 90),   // Red
    color(120, 80, 90)  // Green
  ];
  
  // Initialize first row
  stitches = [];
  for (let i = 0; i < width; i += 10) {
    stitches.push({ x: i, y: 0, colorIndex: floor(random(stripeColors.length)) });
  }
}

function draw() {
  background(220, 20, 95);
  
  // Draw existing stitches
  for (let i = 0; i < stitches.length; i++) {
    let s = stitches[i];
    fill(s.colorIndex % stripeColors.length);
    noStroke();
    ellipse(s.x, s.y, 8, 8);
  }
  
  // Add new row of stitches
  if (currentRow < totalRows) {
    let newRow = [];
    for (let i = 0; i < width; i += 10) {
      let x = i;
      let y = currentRow * stripeHeight;
      let colorIndex = floor(random(stripeColors.length));
      newRow.push({ x: x, y: y, colorIndex: colorIndex });
    }
    stitches = stitches.concat(newRow);
    currentRow++;
  }
  
  // Animate the growth
  if (currentRow >= totalRows) {
    noLoop();
  }
}
