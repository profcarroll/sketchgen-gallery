let segments = [];
let gravity = 0.1;
let collapseSpeed = 0.3;
let glassColor;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create initial ziggurat structure
  for (let i = 0; i < 50; i++) {
    segments.push({
      x: random(-150, 150),
      y: -i * 25,
      z: random(-100, 100),
      width: random(30, 50),
      height: 15,
      depth: random(30, 50),
      rotation: random(TWO_PI),
      spin: random(-0.01, 0.01),
      speed: random(0.05, 0.2),
      opacity: map(i, 0, 50, 200, 80),
      color: [random(100, 180), random(120, 200), random(180, 255)]
    });
  }
}

function draw() {
  background(10);
  noStroke();
  
  // Center the view
  translate(0, 0, -600);
  
  // Rotate the entire structure slowly
  rotateY(frameCount * 0.003);
  
  // Draw all segments with dynamic movement
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    
    // Apply physics to each segment
    seg.y += collapseSpeed;
    seg.rotation += seg.spin;
    
    // Add some lateral movement and rotation
    seg.x += sin(frameCount * seg.speed) * 0.2;
    seg.z += cos(frameCount * seg.speed) * 0.2;
    
    // Fade out segments as they fall
    const alpha = map(seg.y, -300, 600, seg.opacity, 0);
    if (alpha <= 0) {
      segments.splice(i, 1);
      i--;
      continue;
    }
    
    // Set color with a glass-like appearance
    fill(seg.color[0], seg.color[1], seg.color[2], alpha);
    
    push();
    translate(seg.x, seg.y, seg.z);
    rotateY(seg.rotation);
    box(seg.width, seg.height, seg.depth);
    pop();
  }
}

function mousePressed() {
  // Add new segments that peel off from the structure
  for (let i = 0; i < 8; i++) {
    const baseSeg = segments[segments.length - 1];
    if (!baseSeg) break;
    
    segments.push({
      x: baseSeg.x + random(-20, 20),
      y: baseSeg.y,
      z: baseSeg.z + random(-20, 20),
      width: random(20, 40),
      height: 15,
      depth: random(20, 40),
      rotation: random(TWO_PI),
      spin: random(-0.03, 0.03),
      speed: random(0.1, 0.4),
      opacity: baseSeg.opacity,
      color: [random(100, 180), random(120, 200), random(180, 255)]
    });
  }
}
