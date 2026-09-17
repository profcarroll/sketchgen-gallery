let segments = [];
let isGrowing = false;
let baseHeight = 50;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
  noStroke();
  segments.push({
    x: 0,
    y: 0,
    z: 0,
    width: 100,
    depth: 100,
    height: baseHeight
  });
}

function draw() {
  background(220, 20, 90);
  
  // Camera position for better viewing
  camera(0, -height/3, height, 0, 0, 0, 0, 1, 0);

  // Draw base
  push();
  translate(0, height/2 - baseHeight/2, 0);
  fill(180, 30, 50);
  box(200, baseHeight, 200);
  pop();

  // Draw building segments
  for (let i = 0; i < segments.length; i++) {
    let seg = segments[i];
    
    push();
    translate(seg.x, seg.y, seg.z);
    
    if (i === segments.length - 1) {
      // Highlight current segment being built
      fill(240, 80, 80);
    } else {
      fill(180, 30, 50);
    }
    
    box(seg.width, seg.height, seg.depth);
    pop();
  }

  // Draw grid lines for perspective
  drawGrid();
}

function mousePressed() {
  if (isGrowing) return;
  
  isGrowing = true;
  let lastSeg = segments[segments.length - 1];
  
  // Calculate new segment position and size
  let newX = random(-200, 200);
  let newZ = random(-200, 200);
  let newWidth = random(30, 80);
  let newDepth = random(30, 80);
  let newHeight = random(40, 70);
  
  // Position above previous segment
  let newY = lastSeg.y + lastSeg.height/2 + newHeight/2;
  
  segments.push({
    x: newX,
    y: newY,
    z: newZ,
    width: newWidth,
    depth: newDepth,
    height: newHeight
  });
  
  // Reset growth flag after a delay to allow animation
  setTimeout(() => {
    isGrowing = false;
  }, 100);
}

function drawGrid() {
  stroke(200, 20, 80, 0.3);
  strokeWeight(1);
  
  for (let i = -5; i <= 5; i++) {
    // Vertical lines
    line(i * 50, -height/2, -200, i * 50, height/2, -200);
    line(i * 50, -height/2, 200, i * 50, height/2, 200);
    
    // Horizontal lines
    line(-200, -height/2, i * 50, 200, height/2, i * 50);
    line(-200, height/2, i * 50, 200, -height/2, i * 50);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
