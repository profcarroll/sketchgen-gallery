let crankshaftAngle = 0;
let piston1Y = 0;
let piston2Y = 0;
let intake1Open = false;
let exhaust1Open = false;
let intake2Open = false;
let exhaust2Open = false;

function setup() {
  createCanvas(600, 400, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0, 0, 100);

  // Engine block
  push();
  translate(0, 0, -50);
  rotateX(PI/2);
  fill(30, 30, 70);
  noStroke();
  rectMode(CENTER);
  rect(0, 0, 200, 100);
  pop();

  // Cylinders
  push();
  translate(-50, -20, -50);
  rotateX(PI/2);
  fill(30, 30, 80);
  rectMode(CENTER);
  rect(0, 0, 40, 100);
  pop();

  push();
  translate(50, -20, -50);
  rotateX(PI/2);
  fill(30, 30, 80);
  rectMode(CENTER);
  rect(0, 0, 40, 100);
  pop();

  // Pistons
  piston1Y = 30 * sin(crankshaftAngle) + 50;
  piston2Y = 30 * sin(crankshaftAngle + PI) + 50;

  // Piston 1
  push();
  translate(-50, piston1Y, -50);
  rotateX(PI/2);
  fill(40, 80, 60);
  noStroke();
  rectMode(CENTER);
  rect(0, 0, 30, 10);
  pop();

  // Piston 2
  push();
  translate(50, piston2Y, -50);
  rotateX(PI/2);
  fill(40, 80, 60);
  noStroke();
  rectMode(CENTER);
  rect(0, 0, 30, 10);
  pop();

  // Connecting rods
  push();
  translate(-50, 0, -50);
  rotateX(PI/2);
  stroke(20, 60, 40);
  strokeWeight(2);
  line(0, 0, 0, 0, piston1Y - 30, 0);
  pop();

  push();
  translate(50, 0, -50);
  rotateX(PI/2);
  stroke(20, 60, 40);
  strokeWeight(2);
  line(0, 0, 0, 0, piston2Y - 30, 0);
  pop();

  // Crankshaft
  push();
  translate(0, 0, -50);
  rotateZ(crankshaftAngle);
  fill(10, 80, 60);
  noStroke();
  sphere(15);
  pop();

  // Valves
  if (piston1Y < 40) {
    intake1Open = true;
    exhaust1Open = false;
  } else if (piston1Y > 60) {
    intake1Open = false;
    exhaust1Open = true;
  } else {
    intake1Open = false;
    exhaust1Open = false;
  }

  if (piston2Y < 40) {
    intake2Open = true;
    exhaust2Open = false;
  } else if (piston2Y > 60) {
    intake2Open = false;
    exhaust2Open = true;
  } else {
    intake2Open = false;
    exhaust2Open = false;
  }

  // Intake valves
  push();
  translate(-50, -40, -50);
  rotateX(PI/2);
  if (intake1Open) {
    fill(200, 100, 80);
    rectMode(CENTER);
    rect(0, 0, 10, 5);
  }
  pop();

  push();
  translate(50, -40, -50);
  rotateX(PI/2);
  if (intake2Open) {
    fill(200, 100, 80);
    rectMode(CENTER);
    rect(0, 0, 10, 5);
  }
  pop();

  // Exhaust valves
  push();
  translate(-50, 40, -50);
  rotateX(PI/2);
  if (exhaust1Open) {
    fill(0, 100, 80);
    rectMode(CENTER);
    rect(0, 0, 10, 5);
  }
  pop();

  push();
  translate(50, 40, -50);
  rotateX(PI/2);
  if (exhaust2Open) {
    fill(0, 100, 80);
    rectMode(CENTER);
    rect(0, 0, 10, 5);
  }
  pop();

  // Fluids
  if (intake1Open || intake2Open) {
    push();
    translate(0, -40, -50);
    rotateX(PI/2);
    stroke(200, 100, 80);
    strokeWeight(3);
    line(-10, 0, 0, -10, -20, 0);
    line(10, 0, 0, 10, -20, 0);
    pop();
  }

  if (exhaust1Open || exhaust2Open) {
    push();
    translate(0, 40, -50);
    rotateX(PI/2);
    stroke(0, 100, 80);
    strokeWeight(3);
    line(-10, 0, 0, -10, 20, 0);
    line(10, 0, 0, 10, 20, 0);
    pop();
  }

  crankshaftAngle += 0.05;
}
