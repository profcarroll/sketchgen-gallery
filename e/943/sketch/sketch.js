let rows = [];
let currentRow = 0;
let stitchSize = 12;
let patternWidth = 800;
let patternHeight = 600;
let colors = [
  [231, 76, 60],   // Red
  [46, 204, 113],  // Green
  [52, 152, 219],  // Blue
  [155, 89, 182],  // Purple
  [241, 196, 15],  // Yellow
  [230, 126, 34]   // Orange
];

function setup() {
  createCanvas(patternWidth, patternHeight);
  noStroke();
  frameRate(30);
  
  // Initialize first row with random stitches
  rows.push([]);
  for (let i = 0; i < width / stitchSize; i++) {
    rows[0].push({
      x: i * stitchSize + stitchSize / 2,
      y: stitchSize / 2,
      color: colors[int(random(colors.length))]
    });
  }
}

function draw() {
  background(245);
  
  // Draw existing rows
  for (let r = 0; r < rows.length; r++) {
    for (let s = 0; s < rows[r].length; s++) {
      fill(rows[r][s].color);
      ellipse(rows[r][s].x, rows[r][s].y, stitchSize - 2, stitchSize - 2);
    }
  }
  
  // Add new row if needed
  if (rows.length < height / stitchSize) {
    let newRow = [];
    for (let i = 0; i < width / stitchSize; i++) {
      let x = i * stitchSize + stitchSize / 2;
      let y = rows.length * stitchSize + stitchSize / 2;
      let color = colors[int(random(colors.length))];
      
      // Create pattern effect by offsetting some stitches
      if (int(random(3)) === 0) {
        x += stitchSize / 4;
        y += stitchSize / 4;
      }
      
      newRow.push({x, y, color});
    }
    rows.push(newRow);
  } else {
    // Once we've filled the canvas, stop growing
    noLoop();
  }
}
