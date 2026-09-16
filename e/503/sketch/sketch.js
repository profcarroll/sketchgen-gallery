function setup() {
  createCanvas(400, 400, WEBGL);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0);
  
  // Ambient light
  ambientLight(20);
  
  // Primary candle light
  pointLight(255, 255, 255, 0, -100, 300);
  
  // Table
  push();
  translate(0, 150, 0);
  rotateX(PI / 2);
  fill(80, 30, 20);
  plane(400, 400);
  pop();
  
  // Water jug
  push();
  translate(-100, 100, 0);
  rotateY(0.2);
  noStroke();
  fill(200, 50, 90, 0.8);
  cylinder(40, 100, 16, 1);
  pop();
  
  // Candlesticks
  push();
  translate(50, 100, 0);
  rotateY(-0.3);
  noStroke();
  fill(200, 20, 80);
  cylinder(10, 60, 8, 1);
  pop();
  
  // Fruit platter
  push();
  translate(150, 100, 0);
  rotateY(0.1);
  noStroke();
  
  // Red apple
  fill(0, 100, 100);
  sphere(20);
  
  // Orange
  fill(30, 100, 100);
  sphere(20);
  
  // Green grape
  fill(120, 100, 100);
  sphere(10);
  
  // Yellow lemon
  fill(60, 100, 100);
  sphere(15);
  
  pop();
  
  // Candle
  push();
  translate(0, 80, -100);
  rotateX(PI / 2);
  noStroke();
  fill(255, 255, 255);
  cylinder(10, 60, 8, 1);
  pop();
  
  noLoop();
}
