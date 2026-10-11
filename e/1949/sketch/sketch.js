let segments = [];
let segmentWidth = 40;
let segmentHeight = 20;
let gravity = 0.2;
let collapseSpeed = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create initial ziggurat structure
  for (let i = 0; i < 30; i++) {
    segments.push({
      x: random(-100, 100),
      y: -i * segmentHeight * 1.5,
      z: random(-50, 50),
      width: segmentWidth,
      height: segmentHeight,
      depth: segmentWidth,
      rotation: random(TWO_PI),
      spin: random(-0.02, 0.02),
      speed: random(0.1, 0.3),
      opacity: map(i, 0, 30, 255, 100)
    });
  }
}

function draw() {
  background(10);
  noStroke();
  
  // Center the view
  translate(0, 0, -500);
  
  // Rotate the entire structure slowly
  rotateY(frameCount * 0.002);
  
  // Draw all segments with dynamic movement
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    
    // Apply physics to each segment
    seg.y += collapseSpeed;
    seg.rotation += seg.spin;
    
    // Add some lateral movement and rotation
    seg.x += sin(frameCount * seg.speed) * 0.1;
    seg.z += cos(frameCount * seg.speed) * 0.1;
    
    // Fade out segments as they fall
    const alpha = map(seg.y, -200, 500, seg.opacity, 0);
    if (alpha <= 0) {
      segments.splice(i, 1);
      i--;
      continue;
    }
    
    // Set color based on position and time
    const shade = map(seg.y, -200, 500, 60, 30);
    fill(shade, alpha);
    
    push();
    translate(seg.x, seg.y, seg.z);
    rotateY(seg.rotation);
    box(seg.width, seg.height, seg.depth);
    pop();
  }
}

function mousePressed() {
  // Add new segments that peel off from the structure
  for (let i = 0; i < 5; i++) {
    const baseSeg = segments[segments.length - 1];
    if (!baseSeg) break;
    
    segments.push({
      x: baseSeg.x + random(-30, 30),
      y: baseSeg.y,
      z: baseSeg.z + random(-30, 30),
      width: segmentWidth * random(0.7, 1.3),
      height: segmentHeight * random(0.7, 1.3),
      depth: segmentWidth * random(0.7, 1.3),
      rotation: random(TWO_PI),
      spin: random(-0.05, 0.05),
      speed: random(0.1, 0.5),
      opacity: baseSeg.opacity
    });
  }
}
