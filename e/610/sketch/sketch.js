let table, candlesticks, jug, fruitPlatter;

function setup() {
  createCanvas(400, 400, WEBGL);
  noStroke();

  // Create the table surface
  table = createGraphics(300, 300);
  table.noStroke();
  table.fill(150, 120, 80);
  table.rectMode(CENTER);
  table.rect(0, 0, 300, 300);

  // Add reflective texture to the table
  table.fill(200, 180, 140, 150);
  table.ellipse(0, 0, 300, 300);
  table.ellipse(0, 0, 250, 250);

  // Create candlesticks
  candlesticks = createGraphics(60, 100);
  candlesticks.noStroke();
  candlesticks.fill(180);
  candlesticks.rectMode(CENTER);
  candlesticks.rect(0, 30, 10, 60); // Candlestick base
  candlesticks.fill(255, 200, 0);
  candlesticks.ellipse(0, -20, 8, 15); // Lit candle flame

  // Create jug
  jug = createGraphics(80, 120);
  jug.noStroke();
  jug.fill(200, 220, 255, 180);
  jug.rectMode(CENTER);
  jug.rect(0, 0, 70, 110); // Jug body
  jug.fill(200, 220, 255, 120);
  jug.ellipse(0, -50, 60, 30); // Jug rim

  // Create fruit platter
  fruitPlatter = createGraphics(100, 100);
  fruitPlatter.noStroke();
  fruitPlatter.fill(255, 100, 100);
  fruitPlatter.ellipse(-20, -20, 20, 20); // Red apple
  fruitPlatter.fill(255, 200, 50);
  fruitPlatter.ellipse(10, -10, 15, 15); // Orange
  fruitPlatter.fill(100, 200, 100);
  fruitPlatter.ellipse(0, 15, 18, 18); // Green apple
  fruitPlatter.fill(255, 150, 200);
  fruitPlatter.ellipse(20, 0, 12, 12); // Pink pear
}

function draw() {
  background(0);

  // Lighting setup
  ambientLight(60);
  pointLight(255, 255, 255, 0, -100, 100);
  pointLight(255, 200, 100, 100, 100, 100);

  // Table
  push();
  translate(0, 0, -100);
  rotateX(PI / 2);
  texture(table);
  plane(300, 300);
  pop();

  // Candlesticks
  push();
  translate(-80, -50, -90);
  rotateY(PI / 4);
  texture(candlesticks);
  plane(60, 100);
  pop();

  // Jug
  push();
  translate(80, -60, -90);
  texture(jug);
  plane(80, 120);
  pop();

  // Fruit platter
  push();
  translate(0, 50, -90);
  rotateX(PI / 4);
  texture(fruitPlatter);
  plane(100, 100);
  pop();

  // Reflections on the table surface (simulated)
  push();
  translate(0, 0, -100);
  rotateX(PI / 2);
  fill(255, 255, 255, 80);
  plane(300, 300);
  pop();
}
