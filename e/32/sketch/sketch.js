function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noLoop();
}

function draw() {
  background(0);
  
  // Set up lighting
  ambientLight(60);
  directionalLight(255, 255, 255, 1, 1, -1);
  pointLight(255, 255, 255, 0, 0, 500);
  
  // Create a subtle chromatic gradient background
  drawBackgroundGradient();
  
  // Draw geometric self-portrait using three-point perspective
  push();
  translate(-width/4, -height/6, -300);
  rotateY(PI/6);
  rotateX(PI/12);
  drawGeometricPortrait();
  pop();
}

function drawBackgroundGradient() {
  // Draw multiple planes with smooth color transitions for depth illusion
  for (let i = 0; i < 15; i++) {
    push();
    translate(0, 0, -i * 50);
    rotateY(i * 0.02);
    rotateX(i * 0.01);
    
    // Chromatic gradient from blue to purple to pink
    let hue = map(i, 0, 14, 240, 330); // Blue to pink
    fill(hue, 50, 30);
    noStroke();
    
    plane(width * 1.5, height * 1.5);
    pop();
  }
}

function drawGeometricPortrait() {
  // Head structure - modeled as a series of geometric forms
  push();
  fill(200, 180, 160);
  noStroke();
  
  // Main head
  sphere(100);
  
  // Eyes - two small spheres
  push();
  translate(-30, -20, 95);
  fill(0);
  sphere(10);
  pop();
  
  push();
  translate(30, -20, 95);
  fill(0);
  sphere(10);
  pop();
  
  // Nose - cone
  push();
  translate(0, 10, 85);
  rotateX(PI/2);
  cone(15, 30);
  pop();
  
  // Mouth - rectangle with curved top
  push();
  translate(0, 40, 90);
  fill(180, 60, 60);
  rect(-20, -10, 40, 20);
  pop();
  
  // Hair - modeled as a series of cones and cylinders
  push();
  translate(0, -80, 0);
  rotateX(PI/2);
  fill(80, 50, 30);
  cylinder(80, 4);
  pop();
  
  // Neck - cylinder
  push();
  translate(0, 70, 0);
  rotateX(PI/2);
  fill(200, 180, 160);
  cylinder(30, 4);
  pop();
  
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
