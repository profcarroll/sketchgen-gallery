let stitches = [];
let stitchHeight = 15;
let stitchWidth = 8;
let colorPalette = [
  [255, 200, 200], // light red
  [200, 255, 200], // light green
  [200, 200, 255], // light blue
  [255, 255, 200], // light yellow
  [255, 200, 255], // light magenta
  [200, 255, 255]  // light cyan
];
let currentColorIndex = 0;
let fabricHeight = 0;
let stallChance = 0.001;
let stallDuration = 30; // frames
let stallCounter = 0;
let knots = [];
let tearLines = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  noStroke();
  
  // Initialize with some stitches at the top
  for (let y = -stitchHeight * 10; y < 0; y += stitchHeight) {
    for (let x = 0; x < width; x += stitchWidth * 2) {
      const color = colorPalette[currentColorIndex];
      currentColorIndex = (currentColorIndex + 1) % colorPalette.length;
      
      stitches.push({
        x: x,
        y: y,
        color: color,
        type: 'normal'
      });
    }
  }
}

function draw() {
  background(245);
  
  // Grow the fabric
  fabricHeight += 0.5;
  
  // Occasionally trigger a stall
  if (random() < stallChance && stallCounter <= 0) {
    stallCounter = stallDuration;
  }
  
  if (stallCounter > 0) {
    // During stall, add knots and tears
    if (frameCount % 5 === 0) {
      knots.push({
        x: random(width),
        y: random(height / 2),
        size: random(10, 30),
        age: 0
      });
    }
    
    // Create tear lines
    if (frameCount % 10 === 0) {
      tearLines.push({
        x1: random(width),
        y1: random(height / 2),
        x2: random(width),
        y2: random(height / 2, height),
        age: 0
      });
    }
    
    stallCounter--;
  } else {
    // Normal knitting process
    if (frameCount % 2 === 0) {
      for (let x = 0; x < width; x += stitchWidth * 2) {
        const y = -stitchHeight;
        const color = colorPalette[currentColorIndex];
        currentColorIndex = (currentColorIndex + 1) % colorPalette.length;
        
        stitches.push({
          x: x,
          y: y,
          color: color,
          type: 'normal'
        });
      }
    }
  }
  
  // Draw existing stitches
  for (let i = 0; i < stitches.length; i++) {
    const s = stitches[i];
    fill(s.color);
    
    // Draw different stitch types
    if (s.type === 'knot') {
      ellipse(s.x, s.y, 15, 15);
    } else {
      beginShape();
      vertex(s.x, s.y);
      vertex(s.x + stitchWidth / 2, s.y + stitchHeight);
      vertex(s.x + stitchWidth, s.y);
      vertex(s.x + stitchWidth / 2, s.y - stitchHeight);
      endShape(CLOSE);
    }
  }
  
  // Draw knots
  for (let i = 0; i < knots.length; i++) {
    const k = knots[i];
    fill(150);
    ellipse(k.x, k.y, k.size, k.size);
    k.age++;
    
    if (k.age > 30) {
      knots.splice(i, 1);
      i--;
    }
  }
  
  // Draw tear lines
  for (let i = 0; i < tearLines.length; i++) {
    const t = tearLines[i];
    stroke(200);
    strokeWeight(2);
    line(t.x1, t.y1, t.x2, t.y2);
    t.age++;
    
    if (t.age > 20) {
      tearLines.splice(i, 1);
      i--;
    }
  }
  
  // Move all stitches downward
  for (let i = 0; i < stitches.length; i++) {
    stitches[i].y += 1;
  }
  
  // Remove stitches that are off screen
  stitches = stitches.filter(s => s.y < height + stitchHeight * 2);
}
