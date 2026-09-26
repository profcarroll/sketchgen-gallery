let planes = [];
let time = 0;
const numPlanes = 12;
let detachedPlane = null;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);

  // Initialize origami planes with fixed positions and rotations to form a crane
  for (let i = 0; i < numPlanes; i++) {
    planes.push({
      x: 0,
      y: 0,
      z: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      size: random(80, 150),
      color: color(random(360), 70, 85),
      speed: random(0.015, 0.025),
      phaseOffset: random(TWO_PI)
    });
  }

  // Initialize detached plane with a random starting position and velocity
  detachedPlane = {
    x: random(-200, 200),
    y: random(-200, 200),
    z: random(-200, 200),
    vx: random(-0.5, 0.5),
    vy: random(-0.5, 0.5),
    vz: random(-0.5, 0.5),
    size: random(80, 120),
    color: color(random(360), 70, 85),
    rotation: 0,
    rotationSpeed: random(-0.02, 0.02)
  };
}

function draw() {
  background(0);
  noStroke();

  // Camera animation
  let camX = sin(time * 0.15) * 300;
  let camY = cos(time * 0.1) * 200;
  camera(0, 0, 400 + sin(time * 0.08) * 100, 0, 0, 0, 0, 1, 0);
  rotateX(sin(time * 0.03) * 0.2);
  rotateY(time * 0.005);

  // Define crane structure with specific connections
  const craneStructure = [
    { index: 0, x: 0, y: 0, z: 0, size: 120 },   // Body
    { index: 1, x: -60, y: -30, z: 0, size: 80 }, // Wing left
    { index: 2, x: 60, y: -30, z: 0, size: 80 },  // Wing right
    { index: 3, x: 0, y: -80, z: 0, size: 100 },  // Head
    { index: 4, x: 0, y: -120, z: 0, size: 60 },  // Beak
    { index: 5, x: -30, y: -60, z: 0, size: 70 }, // Tail left
    { index: 6, x: 30, y: -60, z: 0, size: 70 },  // Tail right
    { index: 7, x: -40, y: 20, z: 0, size: 90 },  // Leg left
    { index: 8, x: 40, y: 20, z: 0, size: 90 },   // Leg right
    { index: 9, x: -30, y: 60, z: 0, size: 60 },  // Foot left
    { index: 10, x: 30, y: 60, z: 0, size: 60 },  // Foot right
    { index: 11, x: 0, y: -150, z: 0, size: 40 }  // Top point
  ];

  for (let i = 0; i < planes.length; i++) {
    let p = planes[i];
    let structure = craneStructure[i];

    push();
    
    // Apply transformations based on the crane structure
    translate(structure.x, structure.y, structure.z);
    
    // Apply folding motion with phase offset for rhythmic unfolding/folding
    let fold = sin(time * p.speed + p.phaseOffset) * 0.5;
    let unfold = cos(time * p.speed + p.phaseOffset) * 0.3;

    rotateX(p.rx + fold * 0.8);
    rotateY(p.ry + unfold * 0.6);
    rotateZ(p.rz + sin(time * p.speed * 1.2 + p.phaseOffset) * 0.4);

    // Color and transparency
    fill(p.color, 0.9);
    
    // Draw plane as a quad (origami paper shape)
    beginShape();
    vertex(-structure.size/2, -structure.size/2, 0);
    vertex(structure.size/2, -structure.size/2, 0);
    vertex(structure.size/2, structure.size/2, 0);
    vertex(-structure.size/2, structure.size/2, 0);
    endShape(CLOSE);

    pop();
  }

  // Draw and update the detached plane
  push();
  translate(detachedPlane.x, detachedPlane.y, detachedPlane.z);
  rotateX(detachedPlane.rotation);
  rotateY(detachedPlane.rotation * 0.5);
  rotateZ(detachedPlane.rotation * 1.2);
  
  fill(detachedPlane.color, 0.9);
  beginShape();
  vertex(-detachedPlane.size/2, -detachedPlane.size/2, 0);
  vertex(detachedPlane.size/2, -detachedPlane.size/2, 0);
  vertex(detachedPlane.size/2, detachedPlane.size/2, 0);
  vertex(-detachedPlane.size/2, detachedPlane.size/2, 0);
  endShape(CLOSE);

  pop();

  // Update detached plane position
  detachedPlane.x += detachedPlane.vx;
  detachedPlane.y += detachedPlane.vy;
  detachedPlane.z += detachedPlane.vz;
  
  // Add some slow drift and rotation to the detached plane
  detachedPlane.vx *= 0.99;
  detachedPlane.vy *= 0.99;
  detachedPlane.vz *= 0.99;
  detachedPlane.rotation += detachedPlane.rotationSpeed;

  time += 0.03;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
