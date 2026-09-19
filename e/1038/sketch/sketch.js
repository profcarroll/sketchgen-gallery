let stitches = [];
let stitchHeight = 20;
let stitchWidth = 10;
let colorPalette = [
  [255, 100, 100], // red
  [100, 255, 100], // green
  [100, 100, 255], // blue
  [255, 255, 100], // yellow
  [255, 100, 255], // magenta
  [100, 255, 255]  // cyan
];
let currentColorIndex = 0;
let fabricHeight = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  noStroke();
}

function draw() {
  background(240);
  
  // Grow the fabric
  fabricHeight += 1;
  
  // Draw existing stitches
  for (let i = 0; i < stitches.length; i++) {
    const s = stitches[i];
    fill(s.color);
    beginShape();
    vertex(s.x, s.y);
    vertex(s.x + stitchWidth / 2, s.y + stitchHeight);
    vertex(s.x + stitchWidth, s.y);
    vertex(s.x + stitchWidth / 2, s.y - stitchHeight);
    endShape(CLOSE);
  }
  
  // Add new stitches at the top
  if (frameCount % 3 === 0) {
    for (let x = 0; x < width; x += stitchWidth * 2) {
      const y = -stitchHeight;
      const color = colorPalette[currentColorIndex];
      currentColorIndex = (currentColorIndex + 1) % colorPalette.length;
      
      stitches.push({
        x: x,
        y: y,
        color: color
      });
    }
  }
  
  // Move all stitches downward
  for (let i = 0; i < stitches.length; i++) {
    stitches[i].y += 1;
  }
  
  // Remove stitches that are off screen
  stitches = stitches.filter(s => s.y < height + stitchHeight * 2);
}
