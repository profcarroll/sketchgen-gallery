let crankAngle = 0;
let pistonY = 0;
let gasPressure = 0;

function setup() {
  createCanvas(600, 400, WEBGL);
  noStroke();
}

function draw() {
  background(30);
  
  // Lighting
  ambientLight(60);
  pointLight(255, 255, 255, 100, -100, 200);
  
  // Engine group
  push();
  translate(0, 0, -100);
  rotateY(frameCount * 0.01);
  
  // Cylinder block
  fill(100);
  box(200, 150, 40);
  
  // Cylinder walls
  fill(150);
  for (let i = 0; i < 4; i++) {
    push();
    rotateZ(i * PI/2);
    translate(80, 0, 0);
    cylinder(30, 16, false);
    pop();
  }
  
  // Piston group
  let pistonOffset = 0;
  if (frameCount % 60 < 30) {
    pistonOffset = map(frameCount % 30, 0, 30, 0, 20);
  } else {
    pistonOffset = map(frameCount % 30, 30, 0, 20, 0);
  }
  
  // Combustion gas
  if (frameCount % 60 > 15 && frameCount % 60 < 45) {
    fill(255, 100, 0, 150);
    push();
    translate(0, 0, -30 + pistonOffset);
    sphere(25);
    pop();
  }
  
  // Piston
  fill(200);
  push();
  translate(0, 0, -40 + pistonOffset);
  box(60, 10, 20);
  pop();
  
  // Connecting rod
  fill(150);
  push();
  translate(0, 0, -30 + pistonOffset);
  rotateX(PI/2);
  cylinder(10, 100, false);
  pop();
  
  // Crankshaft
  fill(180);
  push();
  rotateZ(crankAngle);
  translate(-60, 0, 0);
  sphere(15);
  pop();
  
  // Rotate crankshaft
  crankAngle += 0.05;
  
  pop();
}
