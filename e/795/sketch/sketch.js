let crankAngle = 0;
let piston1Y, piston2Y;
let connectingRodLength = 80;
let crankRadius = 40;

function setup() {
  createCanvas(600, 600, WEBGL);
}

function draw() {
  background(30);
  noStroke();
  ambientLight(60);
  pointLight(255, 255, 255, 0, -100, 200);

  crankAngle += 0.03;
  
  // Calculate piston positions based on crank angle
  let crankX = cos(crankAngle) * crankRadius;
  let crankY = sin(crankAngle) * crankRadius;

  piston1Y = -crankRadius + sqrt(2 * crankRadius * connectingRodLength - pow(crankRadius, 2));
  piston2Y = crankRadius - sqrt(2 * crankRadius * connectingRodLength - pow(crankRadius, 2));

  // Engine block
  push();
  translate(0, 0, -100);
  rotateX(PI / 2);
  fill(100);
  box(200, 150, 200);
  pop();

  // Cylinders
  push();
  translate(-60, 0, -100);
  rotateX(PI / 2);
  fill(180);
  cylinder(30, 30);
  pop();

  push();
  translate(60, 0, -100);
  rotateX(PI / 2);
  fill(180);
  cylinder(30, 30);
  pop();

  // Pistons
  push();
  translate(-60, piston1Y, -100);
  fill(200);
  sphere(15);
  pop();

  push();
  translate(60, piston2Y, -100);
  fill(200);
  sphere(15);
  pop();

  // Connecting rods
  stroke(150);
  strokeWeight(3);
  line(-60, piston1Y, -100, crankX, crankY, 0);
  line(60, piston2Y, -100, crankX, crankY, 0);

  // Crankshaft
  push();
  translate(crankX, crankY, 0);
  rotateZ(crankAngle);
  fill(150);
  box(30, 10, 10);
  pop();
}
