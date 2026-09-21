let crankshaftAngle = 0;
let camshaftAngle = 0;
let piston1Y = 0;
let piston2Y = 0;
let piston3Y = 0;
let piston4Y = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  frameRate(30);
}

function draw() {
  background(0);
  noStroke();
  
  // Lighting
  pointLight(255, 255, 255, 0, -300, 300);
  pointLight(100, 100, 100, 0, 300, -300);
  
  // Engine block
  push();
  translate(0, 0, -150);
  fill(100);
  box(300, 200, 400);
  pop();
  
  // Cylinder heads
  push();
  translate(0, -100, -150);
  fill(120);
  box(300, 50, 400);
  pop();
  
  // Pistons and connecting rods
  let rodLength = 100;
  let crankRadius = 50;
  
  // Piston positions based on crank angle
  piston1Y = -crankRadius * cos(crankshaftAngle) - rodLength * sin(atan2(-crankRadius * sin(crankshaftAngle), rodLength));
  piston2Y = -crankRadius * cos(crankshaftAngle + PI) - rodLength * sin(atan2(-crankRadius * sin(crankshaftAngle + PI), rodLength));
  
  // Piston 1
  push();
  translate(-100, piston1Y, 0);
  fill(200);
  sphere(30);
  pop();
  
  // Piston 2
  push();
  translate(100, piston2Y, 0);
  fill(200);
  sphere(30);
  pop();
  
  // Connecting rods
  stroke(150);
  strokeWeight(4);
  line(-100, -crankRadius * cos(crankshaftAngle), 0, -100, piston1Y, 0);
  line(100, -crankRadius * cos(crankshaftAngle + PI), 0, 100, piston2Y, 0);
  
  // Crankshaft
  push();
  translate(0, 0, -50);
  rotateZ(crankshaftAngle);
  fill(180);
  cylinder(20, 40);
  pop();
  
  // Camshaft
  push();
  translate(0, 0, 150);
  rotateZ(camshaftAngle);
  fill(180);
  cylinder(15, 30);
  pop();
  
  // Timing chain
  stroke(200);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < 360; i += 10) {
    let x = 150 * cos(radians(i));
    let y = 150 * sin(radians(i));
    let z = -20;
    vertex(x, y, z);
  }
  endShape(CLOSE);
  
  // Update angles
  crankshaftAngle += 0.05;
  camshaftAngle += 0.025;
  
  // Make the engine move
  if (frameCount % 120 === 0) {
    noLoop();
  }
}
