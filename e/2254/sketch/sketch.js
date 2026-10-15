let segments = [];
let gravity = 0.15;
let isCollapsing = false;
let collapseStartTime = 0;
let baseRotation = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Create initial ziggurat structure with glass prisms
  for (let i = 0; i < 30; i++) {
    segments.push({
      x: random(-150, 150),
      y: i * 25,
      z: random(-150, 150),
      width: random(25, 40),
      height: 8,
      depth: random(25, 40),
      rotation: random(TWO_PI),
      spin: random(-0.01, 0.01),
      speed: random(0.03, 0.1),
      opacity: map(i, 0, 30, 160, 80),
      color: [random(150, 200), random(180, 220), random(220, 255)],
      originalY: i * 25,
      velocity: 0,
      isFalling: false
    });
  }
}

function draw() {
  background(15);
  noStroke();
  
  // Center the view and rotate slowly
  translate(0, 0, -600);
  baseRotation += 0.002;
  rotateY(baseRotation);
  
  // Apply physics to segments
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    
    if (!seg.isFalling) {
      // Apply physics
      seg.velocity += gravity;
      seg.y += seg.velocity;
      
      // Add some lateral movement and rotation
      seg.x += sin(frameCount * seg.speed) * 0.2;
      seg.z += cos(frameCount * seg.speed) * 0.2;
      seg.rotation += seg.spin;
    } else {
      // Apply stronger gravity to falling segments
      seg.velocity += gravity * 1.5;
      seg.y += seg.velocity;
      
      // Add some lateral movement for falling segments
      seg.x += sin(frameCount * seg.speed) * 0.3;
      seg.z += cos(frameCount * seg.speed) * 0.3;
      seg.rotation += seg.spin * 2;
    }
    
    // Fade out segments that have fallen below view
    const alpha = map(seg.y, -300, 1500, seg.opacity, 0);
    if (alpha <= 0 && !isCollapsing) {
      segments.splice(i, 1);
      i--;
      continue;
    }
    
    // Set dark glass-like color with slight transparency
    fill(seg.color[0], seg.color[1], seg.color[2], alpha);
    
    push();
    translate(seg.x, seg.y, seg.z);
    rotateY(seg.rotation);
    box(seg.width, seg.height, seg.depth);
    pop();
  }
  
  // Occasionally add new segments to simulate growth
  if (frameCount % 40 === 0 && segments.length < 100) {
    const baseSeg = segments[segments.length - 1];
    if (baseSeg) {
      segments.push({
        x: baseSeg.x + random(-25, 25),
        y: baseSeg.y,
        z: baseSeg.z + random(-25, 25),
        width: random(20, 35),
        height: 8,
        depth: random(20, 35),
        rotation: random(TWO_PI),
        spin: random(-0.02, 0.02),
        speed: random(0.05, 0.2),
        opacity: baseSeg.opacity,
        color: [random(150, 200), random(180, 220), random(220, 255)],
        originalY: baseSeg.y,
        velocity: 0,
        isFalling: false
      });
    }
  }
}

function mousePressed() {
  // Trigger collapse effect
  isCollapsing = true;
  collapseStartTime = frameCount;
  
  // Mark some segments as falling
  for (let i = 0; i < segments.length; i++) {
    if (random() > 0.7) {
      segments[i].isFalling = true;
    }
  }
  
  // Add new segments that peel off from the structure
  for (let i = 0; i < 20; i++) {
    if (segments.length > 0) {
      const baseSeg = segments[segments.length - 1];
      segments.push({
        x: baseSeg.x + random(-20, 20),
        y: baseSeg.y,
        z: baseSeg.z + random(-20, 20),
        width: random(10, 25),
        height: 8,
        depth: random(10, 25),
        rotation: random(TWO_PI),
        spin: random(-0.03, 0.03),
        speed: random(0.1, 0.3),
        opacity: baseSeg.opacity,
        color: [random(150, 200), random(180, 220), random(220, 255)],
        originalY: baseSeg.y,
        velocity: 0,
        isFalling: true
      });
    }
  }
}
