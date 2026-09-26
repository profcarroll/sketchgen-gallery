let waterRipples = [];
let shadowPoints = [];
let lightPosition;
let floorMesh;
let wallMeshes;

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

  // Set up lighting
  lightPosition = createVector(0, -height/4, 500);

  // Build static meshes for floor and walls
  floorMesh = buildFloorGeometry();
  wallMeshes = [
    buildWallGeometry(-width/2, 0, 0), // Left wall
    buildWallGeometry(width/2, 0, 0),  // Right wall
    buildWallGeometry(0, -height/2, 0), // Front wall
    buildWallGeometry(0, height/2, 0)   // Back wall
  ];
}

function buildFloorGeometry() {
  const mesh = [];
  const resolution = 30;
  
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = map(i, 0, resolution-1, -width/2, width/2);
      const z = map(j, 0, resolution-1, -height/2, height/2);
      mesh.push({x, z});
    }
  }
  
  return mesh;
}

function buildWallGeometry(x, y, z) {
  const mesh = [];
  const resolution = 30;
  
  for (let i = 0; i < resolution; i++) {
    const wallHeight = 200;
    const wallWidth = 500;
    let wallX, wallZ;
    
    if (x === 0) { // Vertical walls
      wallX = map(i, 0, resolution-1, -wallWidth/2, wallWidth/2);
      wallZ = z;
    } else {
      wallX = x;
      wallZ = map(i, 0, resolution-1, -wallWidth/2, wallWidth/2);
    }
    
    mesh.push({x: wallX, y: -wallHeight/2, z: wallZ});
    mesh.push({x: wallX, y: wallHeight/2, z: wallZ});
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
