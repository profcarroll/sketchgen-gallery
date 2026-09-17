let segments = [];
let segmentWidth = 40;
let segmentHeight = 20;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Start with one base segment
  segments.push({
    x: 0,
    y: 0,
    z: 0,
    width: segmentWidth,
    height: segmentHeight,
    depth: segmentWidth
  });
}

function draw() {
  background(30);
  noStroke();
  
  // Center the entire structure
  translate(-segmentWidth/2, -segmentHeight/2, 0);
  
  // Draw all segments
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    
    // Set shade based on height (darker towards base)
    const shade = map(i, 0, segments.length - 1, 60, 20);
    fill(shade);
    
    // Draw the segment
    push();
    translate(seg.x, seg.y, seg.z);
    box(seg.width, seg.height, seg.depth);
    pop();
  }
}

function mousePressed() {
  // Add a new segment at the top of the structure
  const lastSegment = segments[segments.length - 1];
  const newX = lastSegment.x;
  const newY = lastSegment.y - lastSegment.height;
  const newZ = lastSegment.z;
  
  segments.push({
    x: newX,
    y: newY,
    z: newZ,
    width: segmentWidth,
    height: segmentHeight,
    depth: segmentWidth
  });
}
