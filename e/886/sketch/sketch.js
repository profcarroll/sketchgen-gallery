let stitches = [];
let needleX, needleY;
let yarnColors = [
  [255, 50, 50],   // red
  [50, 255, 50],   // green
  [50, 50, 255],   // blue
  [255, 255, 50],  // yellow
  [255, 50, 255],  // magenta
  [50, 255, 255]   // cyan
];
let stitchDensity = 0.02;
let mouseInfluence = 0;

function setup() {
  createCanvas(400, 600);
  needleX = width / 2;
  needleY = height - 50;
  frameRate(30);
}

function draw() {
  background(240);
  
  // Update mouse influence
  mouseInfluence = map(mouseX, 0, width, 0, 1);
  
  // Add new stitches based on time and mouse influence
  if (frameCount % max(1, int(10 * (1 - mouseInfluence))) === 0) {
    addStitch();
  }
  
  // Draw existing stitches
  drawStitches();
  
  // Update needle position with some randomness
  needleX += random(-1, 1);
  needleY -= random(0.5, 1.5);
  
  // Keep needle within bounds
  needleX = constrain(needleX, 20, width - 20);
  needleY = constrain(needleY, 20, height - 20);
}

function addStitch() {
  let newStitch = {
    x: needleX,
    y: needleY,
    color: yarnColors[int(random(yarnColors.length))],
    size: random(2, 6)
  };
  
  // Adjust color based on mouse influence
  if (mouseInfluence > 0.5) {
    let colorIndex = int(map(mouseX, 0, width, 0, yarnColors.length));
    newStitch.color = yarnColors[colorIndex % yarnColors.length];
  }
  
  stitches.push(newStitch);
  
  // Limit the number of stitches to prevent memory issues
  if (stitches.length > 1000) {
    stitches.shift();
  }
}

function drawStitches() {
  for (let i = 0; i < stitches.length; i++) {
    let s = stitches[i];
    
    noStroke();
    fill(s.color[0], s.color[1], s.color[2], 200);
    ellipse(s.x, s.y, s.size);
    
    // Draw yarn strand from previous stitch to current
    if (i > 0) {
      let prev = stitches[i - 1];
      
      stroke(prev.color[0], prev.color[1], prev.color[2], 150);
      strokeWeight(1.5);
      line(prev.x, prev.y, s.x, s.y);
    }
  }
  
  // Draw needle
  fill(100);
  noStroke();
  ellipse(needleX, needleY, 8, 8);
}
