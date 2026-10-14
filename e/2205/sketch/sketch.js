let segments = [];
let gravity = 0.1;
let growthSpeed = 0.5;
let isGrowing = true;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create initial megalith structure
  for (let i = 0; i < 30; i++) {
    segments.push({
      x: random(-100, 100),
      y: i * 25,
      z: random(-100, 100),
      width: random(40, 60),
      height: 15,
      depth: random(40, 60),
      rotation: random(TWO_PI),
      spin: random(-0.01, 0.01),
      speed: random(0.05, 0.2),
      opacity: map(i, 0, 30, 200, 80),
      color: [random(200, 255), random(220, 255), random(240, 255)]
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
    if (isGrowing) {
      seg.y -= growthSpeed;
    }
    
    seg.rotation += seg.spin;
    
    // Add some lateral movement and rotation
    seg.x += sin(frameCount * seg.speed) * 0.2;
    seg.z += cos(frameCount * seg.speed) * 0.2;
    
    // Fade out segments as they grow upward
    const alpha = map(seg.y, -300, 600, seg.opacity, 0);
    if (alpha <= 0 && !isGrowing) {
      segments.splice(i, 1);
      i--;
      continue;
    }
    
    // Set color with a chalk-like appearance
    fill(seg.color[0], seg.color[1], seg.color[2], alpha);
    
    push();
    translate(seg.x, seg.y, seg.z);
    rotateY(seg.rotation);
    box(seg.width, seg.height, seg.depth);
    pop();
  }
  
  // Occasionally add new segments to simulate growth
  if (isGrowing && frameCount % 30 === 0 && segments.length < 100) {
    const baseSeg = segments[segments.length - 1];
    if (baseSeg) {
      segments.push({
        x: baseSeg.x + random(-20, 20),
        y: baseSeg.y,
        z: baseSeg.z + random(-20, 20),
        width: random(30, 50),
        height: 15,
        depth: random(30, 50),
        rotation: random(TWO_PI),
        spin: random(-0.03, 0.03),
        speed: random(0.1, 0.4),
        opacity: baseSeg.opacity,
        color: [random(200, 255), random(220, 255), random(240, 255)]
      });
    }
  }
}

function mousePressed() {
  // Toggle growth direction
  isGrowing = !isGrowing;
  
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
      color: [random(200, 255), random(220, 255), random(240, 255)]
    });
  }
}
