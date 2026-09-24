let waterRipples = [];
let shadowPoints = [];
let rippleMesh;
let lightPosition;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize ripples with fewer particles for performance
  for (let i = 0; i < 50; i++) {
    waterRipples.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      radius: random(50, 200),
      speed: random(0.01, 0.03),
      time: random(TWO_PI)
    });
  }

  // Initialize shadow points in a grid pattern
  const gridSize = 40;
  for (let x = -width/2; x < width/2; x += gridSize) {
    for (let y = -height/2; y < height/2; y += gridSize) {
      shadowPoints.push({
        x: x,
        y: y,
        z: random(100, 300),
        size: random(1, 3)
      });
    }
  }

  // Build a static ripple mesh
  rippleMesh = buildRippleGeometry();

  // Set up lighting
  lightPosition = createVector(0, -height/4, 500);
}

function buildRippleGeometry() {
  const mesh = [];
  const resolution = 20;
  
  for (let i = 0; i < resolution; i++) {
    const angle = map(i, 0, resolution, 0, TWO_PI);
    const x = cos(angle) * 400;
    const y = sin(angle) * 400;
    mesh.push({x, y});
  }
  
  return mesh;
}

function draw() {
  background(0);

  // Ambient lighting
  ambientLight(50);
  pointLight(255, 255, 255, lightPosition.x, lightPosition.y, lightPosition.z);

  // Water surface - using a single shape for efficiency
  push();
  translate(0, 0, -100);
  rotateX(PI / 2);
  noStroke();
  fill(180, 50, 30, 0.7);
  
  beginShape();
  for (let i = 0; i < 100; i++) {
    let angle = map(i, 0, 100, 0, TWO_PI);
    let x = cos(angle) * 400;
    let y = sin(angle) * 400;
    let z = sin(frameCount * 0.01 + angle) * 20;
    vertex(x, y, z);
  }
  endShape(CLOSE);
  pop();

  // Ripple effects - batched in one shape
  beginShape(POINTS);
  for (let ripple of waterRipples) {
    ripple.time += ripple.speed;
    
    for (let i = 0; i < 20; i++) { // Reduced from 50 to reduce calls
      let angle = map(i, 0, 20, 0, TWO_PI);
      let radius = ripple.radius + sin(ripple.time + angle) * 10;
      let x = ripple.x + cos(angle) * radius;
      let y = ripple.y + sin(angle) * radius;
      vertex(x, y, -100); // Fixed Z position for all ripples
    }
  }
  endShape();

  // Shadow casting - batched in one shape
  beginShape(POINTS);
  for (let point of shadowPoints) {
    let shadowOffset = sin(frameCount * 0.01 + point.x * 0.01) * 5;
    let x = point.x;
    let y = point.y;
    let z = point.z - shadowOffset;
    
    vertex(x, y, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
