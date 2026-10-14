function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();
}

function draw() {
  background(0);
  
  // Create a large central brass clock mechanism
  push();
  translate(0, 0, -500);
  rotateY(frameCount * 0.001);
  drawClockMechanism();
  pop();
  
  // Add subtle ambient lighting
  pointLight(255, 255, 255, 0, -300, 500);
  pointLight(200, 180, 140, 300, 0, 300);
}

function drawClockMechanism() {
  // Main clock body
  fill(180, 140, 80);
  noStroke();
  sphere(200, 32, 16);
  
  // Central gear
  push();
  rotateX(HALF_PI);
  drawGear(150, 20, 12);
  pop();
  
  // Outer gears
  for (let i = 0; i < 8; i++) {
    let angle = map(i, 0, 8, 0, TWO_PI);
    let x = cos(angle) * 180;
    let z = sin(angle) * 180;
    push();
    translate(x, 0, z);
    rotateY(-angle);
    drawGear(100, 15, 16);
    pop();
  }
  
  // Cams and connecting rods
  for (let i = 0; i < 24; i++) {
    let angle = map(i, 0, 24, 0, TWO_PI);
    let x = cos(angle) * 130;
    let z = sin(angle) * 130;
    let y = sin(frameCount * 0.01 + angle) * 30;
    
    push();
    translate(x, y, z);
    rotateY(-angle);
    drawCam(25, 40, 8);
    pop();
  }
  
  // Axles
  stroke(100, 80, 40);
  strokeWeight(3);
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 12, 0, TWO_PI);
    let x1 = cos(angle) * 150;
    let z1 = sin(angle) * 150;
    let x2 = cos(angle) * 180;
    let z2 = sin(angle) * 180;
    line(x1, 0, z1, x2, 0, z2);
  }
}

function drawGear(radius, thickness, teeth) {
  stroke(100, 80, 40);
  strokeWeight(2);
  fill(160, 120, 60);
  
  // Gear rim
  beginShape();
  for (let i = 0; i < teeth * 2; i++) {
    let angle = map(i, 0, teeth * 2, 0, TWO_PI);
    let r = radius + (i % 2 === 0 ? 0 : thickness);
    let x = cos(angle) * r;
    let z = sin(angle) * r;
    vertex(x, 0, z);
  }
  endShape(CLOSE);
  
  // Gear center
  noStroke();
  fill(120, 90, 40);
  sphere(radius * 0.3, 8, 6);
}

function drawCam(radius, height, segments) {
  stroke(100, 80, 40);
  strokeWeight(2);
  fill(160, 120, 60);
  
  // Cam shape
  beginShape();
  for (let i = 0; i < segments; i++) {
    let angle = map(i, 0, segments, 0, TWO_PI);
    let x = cos(angle) * radius;
    let z = sin(angle) * radius;
    let y = height * sin(frameCount * 0.02 + angle) * 0.5;
    vertex(x, y, z);
  }
  endShape(CLOSE);
  
  // Cam axle
  stroke(80, 60, 30);
  line(0, -height/2, 0, 0, height/2, 0);
}
