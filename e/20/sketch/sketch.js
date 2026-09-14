function setup() {
  createCanvas(600, 600, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0);
  noStroke();
  
  // Set up lighting
  pointLight(255, 255, 255, 0, -300, 300);
  pointLight(255, 255, 255, 0, 300, 300);
  
  // Center the scene
  translate(0, 0, -300);
  
  // Create a series of interlocking planes to form the figure
  push();
  rotateX(PI/4);
  rotateY(PI/6);
  fill(200, 80, 70);
  plane(200, 300);
  pop();
  
  push();
  rotateX(-PI/6);
  rotateY(PI/4);
  fill(180, 70, 60);
  plane(250, 200);
  pop();
  
  push();
  rotateX(PI/3);
  rotateY(-PI/5);
  fill(160, 60, 50);
  plane(180, 250);
  pop();
  
  // Add more planes to build up the structure
  push();
  translate(0, -100, 0);
  rotateX(PI/2);
  fill(220, 90, 75);
  plane(150, 200);
  pop();
  
  push();
  translate(-80, 50, 0);
  rotateY(PI/3);
  fill(140, 60, 40);
  plane(100, 150);
  pop();
  
  push();
  translate(80, 50, 0);
  rotateY(-PI/3);
  fill(130, 50, 35);
  plane(100, 150);
  pop();
  
  // Converging lines to suggest depth
  stroke(0, 0, 0, 0.2);
  for (let i = 0; i < 10; i++) {
    let y = map(i, 0, 9, -300, 300);
    line(-300, y, 0, 300, y, 0);
  }
  
  noLoop();
}
