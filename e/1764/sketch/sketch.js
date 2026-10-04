let waterRipples = [];
let shadowCasters = [];
let floorMesh;
let wallMeshes;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize ripples with fewer particles for performance
  for (let i = 0; i < 80; i++) {
    waterRipples.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      radius: random(30, 150),
      speed: random(0.01, 0.04),
      time: random(TWO_PI)
    });
  }

  // Initialize shadow casters (light sources that create sharp shadows)
  for (let i = 0; i < 15; i++) {
    shadowCasters.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(0, 200),
      size: random(30, 100),
      speed: random(0.005, 0.02),
      time: random(TWO_PI)
    });
  }

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
  const resolution = 40;
  
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
  const resolution = 40;
  
  for (let i = 0; i < resolution; i++) {
    const wallHeight = 300;
    const wallWidth = 600;
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
  ambientLight(30);
  pointLight(255, 255, 255, 0, -height/4, 500);

  // Water surface with ripples
  push();
  translate(0, 0, -150);
  rotateX(PI / 2);
  noStroke();
  fill(200, 70, 20, 0.8);
  
  beginShape();
  for (let i = 0; i < 100; i++) {
    let angle = map(i, 0, 100, 0, TWO_PI);
    let x = cos(angle) * 400;
    let y = sin(angle) * 400;
    let z = sin(frameCount * 0.02 + angle) * 30;
    vertex(x, y, z);
  }
  endShape(CLOSE);
  pop();

  // Ripple effects - batched in one shape
  beginShape(POINTS);
  for (let ripple of waterRipples) {
    ripple.time += ripple.speed;
    
    for (let i = 0; i < 30; i++) { // Reduced from 50 to reduce calls
      let angle = map(i, 0, 30, 0, TWO_PI);
      let radius = ripple.radius + sin(ripple.time + angle) * 15;
      let x = ripple.x + cos(angle) * radius;
      let y = ripple.y + sin(angle) * radius;
      vertex(x, y, -150); // Fixed Z position for all ripples
    }
  }
  endShape();

  // Shadow casters - create sharp, geometric shadows on floor and walls
  beginShape(POINTS);
  for (let caster of shadowCasters) {
    caster.time += caster.speed;
    
    // Move light sources
    let x = caster.x + sin(frameCount * 0.01 + caster.time) * 30;
    let y = caster.y + cos(frameCount * 0.01 + caster.time) * 30;
    let z = caster.z + sin(frameCount * 0.005 + caster.time) * 50;

    // Cast shadow to floor
    fill(0, 0, 0, 0.7);
    vertex(x, y, -150);

    // Cast shadow to walls
    let wallX = map(caster.x, -width/2, width/2, -300, 300);
    let wallY = map(caster.y, -height/2, height/2, -300, 300);
    
    fill(0, 0, 0, 0.7);
    vertex(wallX, wallY, z);
  }
  endShape();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
