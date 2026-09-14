function setup() {
  createCanvas(600, 600, WEBGL);
}

function draw() {
  background(20);

  // Lighting setup
  ambientLight(50);
  pointLight(255, 200, 150, 0, -200, 300); // Warm candle light

  // Table
  push();
  translate(0, 150, 0);
  rotateX(PI / 2);
  fill(139, 69, 19); // Brown table color
  plane(400, 400);
  pop();

  // Transparent jug of water
  push();
  translate(-100, 100, 0);
  rotateY(PI / 6);
  fill(200, 220, 255, 180); // Semi-transparent blue
  noStroke();
  cylinder(40, 100, 16, true);
  pop();

  // Candlesticks
  push();
  translate(100, 130, -20);
  rotateY(PI / 4);
  fill(200);
  for (let i = 0; i < 3; i++) {
    push();
    translate(0, 0, i * 30);
    cylinder(8, 50, 8, true);
    pop();
  }
  pop();

  // Fruit platter
  push();
  translate(0, 140, 100);
  rotateX(PI / 2);
  fill(255, 100, 100); // Red fruit
  sphere(30);
  fill(255, 255, 0); // Yellow
  sphere(25);
  fill(100, 255, 100); // Green
  sphere(20);
  pop();
}
