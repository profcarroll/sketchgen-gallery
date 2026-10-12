// Derelict dirigible frames tumbling through smog-stained sky
const PALETTE = [
  '#5a4d46', '#8c5e4d', '#b07a5a', '#d49a73',
  '#a23f2a', '#c44a31', '#e66b47', '#ff8c5a'
];
const HAZE = '#a08060';
let frames = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // Create initial frames
  for (let i = 0; i < 150; i++) {
    frames.push(makeFrame());
  }
}

function makeFrame() {
  const size = random(30, 120);
  return {
    x: random(-width * 0.5, width * 0.5),
    y: random(-height * 2, -size),
    z: random(-200, -50),
    size,
    rotX: random(TWO_PI),
    rotY: random(TWO_PI),
    rotZ: random(TWO_PI),
    rotSpeedX: random(-0.02, 0.02),
    rotSpeedY: random(-0.02, 0.02),
    rotSpeedZ: random(-0.02, 0.02),
    color: lerpColor(color(PALETTE[floor(random(PALETTE.length))]), 
                    color(HAZE), random(0.3, 0.7)),
    speed: random(1, 4)
  };
}

function draw() {
  // Create smog-stained sky
  background(58, 45, 37);
  // Draw a gradient sky in the background
  for (let y = 0; y < height; y += 2) {
    const inter = map(y, 0, height, 0, 1);
    const c = lerpColor(color(58, 45, 37), color(154, 122, 106), inter);
    stroke(c);
    line(-width/2, y, width/2, y);
  }

  // Draw frames
  for (let i = frames.length - 1; i >= 0; i--) {
    const f = frames[i];
    
    // Update position with wind influence
    f.y += f.speed;
    f.rotX += f.rotSpeedX;
    f.rotY += f.rotSpeedY;
    f.rotZ += f.rotSpeedZ;
    
    // Apply rotation and movement
    push();
    translate(f.x, f.y, f.z);
    rotateX(f.rotX);
    rotateY(f.rotY);
    rotateZ(f.rotZ);
    
    // Draw frame structure (simplified cube-like structure)
    noStroke();
    fill(f.color);
    box(f.size * 0.8, f.size * 0.15, f.size * 0.15); // Horizontal bar
    box(f.size * 0.15, f.size * 0.8, f.size * 0.15); // Vertical bar
    box(f.size * 0.15, f.size * 0.15, f.size * 0.8); // Depth bar
    
    // Add some rust details (points)
    fill(200, 100, 50);
    sphere(f.size * 0.1, 4, 3);
    
    pop();
    
    // Reset if off screen
    if (f.y > height * 0.5 + f.size) {
      frames.splice(i, 1);
      frames.push(makeFrame());
    }
  }
  
  // Occasionally add new frames to maintain density
  if (random() < 0.02 && frames.length < 200) {
    frames.push(makeFrame());
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
