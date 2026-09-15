let table, jug, candle, berries, foliage;

function setup() {
  createCanvas(600, 600, WEBGL);
  noStroke();
}

function draw() {
  background(20);

  // Lighting setup
  pointLight(255, 255, 255, -100, -100, 300);
  ambientLight(60);

  // Table
  push();
  translate(0, 100, 0);
  rotateX(PI / 2);
  fill(139, 69, 19); // Brown table
  plane(400, 200);
  pop();

  // Jug of water
  push();
  translate(-100, 70, -50);
  rotateY(PI / 6);
  fill(200, 200, 200); // Light gray jug
  cylinder(30, 20);
  pop();

  // Candlestick and candle
  push();
  translate(100, 70, -50);
  rotateY(-PI / 6);
  fill(192, 192, 192); // Silver candlestick
  cylinder(5, 30);
  translate(0, -20, 0);
  fill(255, 255, 255); // White candle
  cylinder(4, 10);
  pop();

  // Berries
  push();
  translate(-50, 90, 0);
  fill(139, 0, 0); // Deep red berries
  sphere(8, 8, 8);
  pop();

  // Foliage
  push();
  translate(0, 90, 50);
  fill(0, 100, 0); // Green foliage
  sphere(12, 10, 10);
  pop();
}
