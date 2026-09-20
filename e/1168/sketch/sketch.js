let crankAngle = 0;
let pistonPosition = 0;
let intakeValveOpen = false;
let exhaustValveOpen = false;

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
}

function draw() {
  background(20);
  
  // Rotate the whole engine
  rotateY(crankAngle * 0.01);
  
  // Engine block
  push();
  translate(0, -100, 0);
  fill(100);
  box(200, 300, 150);
  pop();
  
  // Cylinder heads
  push();
  translate(0, -170, 0);
  fill(80);
  box(200, 50, 150);
  pop();
  
  // Cylinders
  for (let i = 0; i < 4; i++) {
    let angle = (TWO_PI / 4) * i;
    let x = cos(angle) * 80;
    let z = sin(angle) * 80;
    
    push();
    translate(x, -100, z);
    fill(50);
    cylinder(20, 10);
    pop();
  }
  
  // Pistons and connecting rods
  for (let i = 0; i < 4; i++) {
    let angle = (TWO_PI / 4) * i + crankAngle;
    let x = cos(angle) * 60;
    let y = -100 + sin(angle) * 40;
    let z = sin(angle) * 60;
    
    // Piston
    push();
    translate(x, y, z);
    fill(200);
    sphere(15);
    pop();
    
    // Connecting rod
    push();
    translate(x, y, z);
    rotateX(PI/2);
    fill(150);
    cylinder(5, 40);
    pop();
  }
  
  // Crankshaft
  push();
  translate(0, -100, 0);
  fill(180);
  rotateZ(crankAngle);
  cylinder(10, 200);
  pop();
  
  // Valves
  for (let i = 0; i < 4; i++) {
    let angle = (TWO_PI / 4) * i;
    let x = cos(angle) * 80;
    let z = sin(angle) * 80;
    
    // Intake valve
    push();
    translate(x, -200, z);
    fill(intakeValveOpen ? 100 : 50);
    box(5, 10, 5);
    pop();
    
    // Exhaust valve
    push();
    translate(x, -200, z + 20);
    fill(exhaustValveOpen ? 100 : 50);
    box(5, 10, 5);
    pop();
  }
  
  // Fluid streams (simplified)
  if (intakeValveOpen) {
    push();
    stroke(0, 255, 255);
    strokeWeight(3);
    beginShape();
    for (let i = 0; i < 10; i++) {
      let t = i / 9;
      vertex(-50 + t * 100, -200, -20 + sin(t * PI) * 10);
    }
    endShape();
    pop();
  }
  
  if (exhaustValveOpen) {
    push();
    stroke(255, 0, 0);
    strokeWeight(3);
    beginShape();
    for (let i = 0; i < 10; i++) {
      let t = i / 9;
      vertex(-50 + t * 100, -200, 20 + sin(t * PI) * 10);
    }
    endShape();
    pop();
  }
  
  // Update animation
  crankAngle += 2;
  pistonPosition = sin(crankAngle * 0.01) * 40;
  
  if (frameCount % 60 === 0) {
    intakeValveOpen = !intakeValveOpen;
  }
  
  if (frameCount % 90 === 0) {
    exhaustValveOpen = !exhaustValveOpen;
  }
}
