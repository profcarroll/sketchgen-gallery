let crankAngle = 0;
let piston1Y = 0;
let piston2Y = 0;
let intake1Open = false;
let exhaust1Open = false;
let intake2Open = false;
let exhaust2Open = false;

function setup() {
  createCanvas(800, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0);
  
  // Engine parameters
  const crankRadius = 50;
  const connectingRodLength = 120;
  const cylinderHeight = 200;
  const pistonDiameter = 40;
  const valveSize = 10;
  
  // Update engine timing
  crankAngle += 0.05;
  if (crankAngle > TWO_PI) crankAngle = 0;
  
  // Calculate piston positions based on crank angle
  const crankX = cos(crankAngle) * crankRadius;
  const crankY = sin(crankAngle) * crankRadius;
  
  // Piston Y position using law of cosines for connecting rod
  const rodLengthSquared = connectingRodLength * connectingRodLength;
  const crankRadiusSquared = crankRadius * crankRadius;
  const pistonDistance = sqrt(rodLengthSquared - crankRadiusSquared + (crankY * crankY));
  piston1Y = cylinderHeight/2 - pistonDistance;
  
  // Calculate valve timing
  const intakeDelay = PI/2;
  const exhaustDelay = PI;
  
  intake1Open = (crankAngle > intakeDelay && crankAngle < intakeDelay + PI/4);
  exhaust1Open = (crankAngle > exhaustDelay && crankAngle < exhaustDelay + PI/4);
  
  // Second cylinder timing
  const crankAngle2 = crankAngle + PI;
  const crankX2 = cos(crankAngle2) * crankRadius;
  const crankY2 = sin(crankAngle2) * crankRadius;
  
  const pistonDistance2 = sqrt(rodLengthSquared - crankRadiusSquared + (crankY2 * crankY2));
  piston2Y = cylinderHeight/2 - pistonDistance2;
  
  const intakeDelay2 = PI/2 + PI;
  const exhaustDelay2 = PI + PI;
  
  intake2Open = (crankAngle2 > intakeDelay2 && crankAngle2 < intakeDelay2 + PI/4);
  exhaust2Open = (crankAngle2 > exhaustDelay2 && crankAngle2 < exhaustDelay2 + PI/4);
  
  // Camera position
  camera(0, -150, 300, 0, 0, 0, 0, 1, 0);
  
  // Lighting
  pointLight(255, 255, 255, 300, 300, 300);
  pointLight(100, 100, 100, -300, -300, -300);
  
  // Engine block
  push();
  fill(80, 50, 50);
  noStroke();
  translate(0, 0, -100);
  box(200, 150, 200);
  pop();
  
  // Cylinder 1
  push();
  translate(-60, 0, 0);
  fill(30, 30, 70);
  noStroke();
  cylinder(40, 200);
  pop();
  
  // Cylinder 2
  push();
  translate(60, 0, 0);
  fill(30, 30, 70);
  noStroke();
  cylinder(40, 200);
  pop();
  
  // Piston 1
  push();
  translate(-60, piston1Y - 100, 0);
  fill(200, 50, 80);
  noStroke();
  sphere(pistonDiameter/2);
  pop();
  
  // Piston 2
  push();
  translate(60, piston2Y - 100, 0);
  fill(200, 50, 80);
  noStroke();
  sphere(pistonDiameter/2);
  pop();
  
  // Connecting rods
  stroke(100, 40, 60);
  strokeWeight(3);
  line(-60, -100, 0, -60, piston1Y - 100, 0);
  line(60, -100, 0, 60, piston2Y - 100, 0);
  
  // Crankshaft
  push();
  translate(0, 0, 0);
  stroke(200, 50, 80);
  strokeWeight(8);
  line(-100, 0, 0, 100, 0, 0);
  
  // Crankshaft journals
  fill(200, 50, 80);
  noStroke();
  sphere(15);
  translate(100, 0, 0);
  sphere(15);
  pop();
  
  // Valves
  // Intake valves
  push();
  translate(-60, -90, 0);
  fill(intake1Open ? 120 : 180, 50, 80);
  noStroke();
  sphere(valveSize/2);
  pop();
  
  push();
  translate(60, -90, 0);
  fill(intake2Open ? 120 : 180, 50, 80);
  noStroke();
  sphere(valveSize/2);
  pop();
  
  // Exhaust valves
  push();
  translate(-60, 90, 0);
  fill(exhaust1Open ? 0 : 180, 50, 80);
  noStroke();
  sphere(valveSize/2);
  pop();
  
  push();
  translate(60, 90, 0);
  fill(exhaust2Open ? 0 : 180, 50, 80);
  noStroke();
  sphere(valveSize/2);
  pop();
  
  // Valve springs
  stroke(50, 30, 40);
  strokeWeight(1);
  line(-60, -90, 0, -60, -75, 0);
  line(60, -90, 0, 60, -75, 0);
  line(-60, 90, 0, -60, 75, 0);
  line(60, 90, 0, 60, 75, 0);
  
  // Valve guides
  stroke(100, 20, 30);
  strokeWeight(1);
  line(-60, -100, 0, -60, -90, 0);
  line(60, -100, 0, 60, -90, 0);
  line(-60, 100, 0, -60, 90, 0);
  line(60, 100, 0, 60, 90, 0);
  
  // Engine bay details
  stroke(50, 20, 30);
  strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    line(-100, -100 + i * 25, 0, 100, -100 + i * 25, 0);
  }
  
  // Crankshaft rotation indicator
  push();
  translate(0, 0, 0);
  stroke(200, 50, 80);
  strokeWeight(2);
  rotateZ(crankAngle);
  line(0, 0, 0, 30, 0, 0);
  pop();
  
  // Labels
  fill(200, 100, 100);
  noStroke();
  textSize(16);
  textAlign(CENTER);
  text("Intake", -60, -95, 0);
  text("Exhaust", -60, 95, 0);
  text("Intake", 60, -95, 0);
  text("Exhaust", 60, 95, 0);
}
