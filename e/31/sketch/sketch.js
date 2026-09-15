function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  background(40);
  
  // Dramatic lighting setup
  ambientLight(60);
  pointLight(255, 255, 255, -100, -100, 300);
  pointLight(255, 100, 100, 100, 100, 200);
  
  // Static still life composition
  push();
  translate(-150, -50, 0);
  rotateY(0.2);
  box(80, 80, 80); // Wooden cube
  pop();
  
  push();
  translate(100, -30, 0);
  rotateX(0.3);
  cylinder(60, 8); // Glass jar
  pop();
  
  push();
  translate(-50, 100, 0);
  box(120, 10, 120); // Table top
  pop();
  
  push();
  translate(0, 130, 0);
  rotateX(PI/2);
  ellipse(0, 0, 180, 10); // Lamp base
  pop();
  
  push();
  translate(0, 100, 0);
  rotateX(PI/2);
  cylinder(5, 100); // Lamp post
  pop();
  
  push();
  translate(-30, 80, -60);
  rotateY(0.1);
  box(20, 20, 20); // Small cube
  pop();
  
  push();
  translate(70, 90, 40);
  rotateZ(0.5);
  sphere(25); // Ball
  pop();
  
  noLoop(); // Static composition
}
