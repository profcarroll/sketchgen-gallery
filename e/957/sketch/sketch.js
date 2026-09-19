let crankshaftAngle = 0;
let piston1Y = 0;
let piston2Y = 0;
let valve1Open = 0;
let valve2Open = 0;
let gear1Angle = 0;
let gear2Angle = 0;
let gear3Angle = 0;

function setup() {
  createCanvas(600, 400, WEBGL);
  noStroke();
}

function draw() {
  background(50);
  
  // Update animation
  crankshaftAngle += 0.05;
  piston1Y = sin(crankshaftAngle) * 80;
  piston2Y = sin(crankshaftAngle + PI) * 80;
  
  // Valve timing
  valve1Open = map(sin(crankshaftAngle), -1, 1, 0, 30);
  valve2Open = map(sin(crankshaftAngle + PI), -1, 1, 0, 30);
  
  // Gear rotation
  gear1Angle += 0.02;
  gear2Angle += 0.04;
  gear3Angle += 0.06;
  
  // Engine block
  push();
  translate(0, 50);
  fill(100);
  box(200, 150, 100);
  pop();
  
  // Cylinders
  push();
  translate(-60, 0);
  fill(150);
  cylinder(30, 100);
  pop();
  
  push();
  translate(60, 0);
  fill(150);
  cylinder(30, 100);
  pop();
  
  // Pistons
  push();
  translate(-60, -20 + piston1Y);
  fill(200);
  sphere(20);
  pop();
  
  push();
  translate(60, -20 + piston2Y);
  fill(200);
  sphere(20);
  pop();
  
  // Connecting rods
  push();
  stroke(150);
  strokeWeight(4);
  line(-60, 30 + piston1Y, 0, 0);
  line(60, 30 + piston2Y, 0, 0);
  pop();
  
  // Crankshaft
  push();
  translate(0, 50);
  rotateZ(crankshaftAngle);
  fill(180);
  box(20, 20, 100);
  pop();
  
  // Timing gears
  push();
  translate(-100, -30);
  rotateZ(gear1Angle);
  fill(180);
  circle(0, 0, 40);
  pop();
  
  push();
  translate(-60, -30);
  rotateZ(gear2Angle);
  fill(180);
  circle(0, 0, 30);
  pop();
  
  push();
  translate(60, -30);
  rotateZ(gear3Angle);
  fill(180);
  circle(0, 0, 30);
  pop();
  
  // Valves
  push();
  translate(-60, -70);
  rotateX(valve1Open);
  fill(220);
  box(10, 20, 5);
  pop();
  
  push();
  translate(60, -70);
  rotateX(valve2Open);
  fill(220);
  box(10, 20, 5);
  pop();
}
